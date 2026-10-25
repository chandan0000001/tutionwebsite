/**
 * 🔊 Kobra-Inspired UI Sound & Haptics Engine
 *
 * Implements pure synthesized Web Audio API sound effects and tactile haptic feedback
 * based on kobra.systems/components/sound design specifications.
 *
 * Key advantages:
 * - 0 external audio files (0 KB network transfer, 0 ms latency).
 * - Synthesized oscillators + noise buffers + gain envelopes + filters.
 * - 14+ distinct interaction sounds designed for UI micro-feedback.
 * - Tactile vibration (haptics) for supported touch devices.
 * - Mute / Unmute persistence via localStorage.
 */

export type SoundType =
  | 'tap'
  | 'select'
  | 'toggleOn'
  | 'toggleOff'
  | 'open'
  | 'close'
  | 'tick'
  | 'sliderTick'
  | 'success'
  | 'error'
  | 'warning'
  | 'destructive'
  | 'copy'
  | 'notification'
  | 'swoosh'
  | 'blocked';

// Haptic vibration patterns (in milliseconds)
const HAPTIC_PATTERNS: Record<SoundType, number | number[]> = {
  tap: 10,
  select: 12,
  toggleOn: [10, 30, 15],
  toggleOff: [15, 20, 10],
  open: [12, 35, 18],
  close: 12,
  tick: 8,
  sliderTick: 6,
  success: [15, 40, 20, 35, 30],
  error: [30, 40, 40, 40, 25],
  warning: [20, 30, 20],
  destructive: [35, 50, 20],
  copy: [10, 25, 15],
  notification: [15, 50, 20],
  swoosh: 15,
  blocked: [15, 20, 15],
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private brownNoiseBuffer: AudioBuffer | null = null;
  private isEnabled: boolean = true;
  private isHapticsEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('antariksh_sound_volume');
      if (savedVolume) {
        const v = parseFloat(savedVolume);
        if (!isNaN(v) && v >= 0 && v <= 1) this.volume = v;
      }
    }
  }

  /**
   * Auto-activates and resumes Web AudioContext on user interaction
   */
  public activate(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Lazy initialize Web AudioContext on first user interaction
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * White noise buffer for crisp mechanical ticks
   */
  private getWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = ctx.sampleRate * 0.2; // 200ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Brown noise buffer for deep impact/destructive feedback
   */
  private getBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.brownNoiseBuffer) return this.brownNoiseBuffer;
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    this.brownNoiseBuffer = buffer;
    return buffer;
  }

  /**
   * Trigger haptic vibration on mobile/tactile devices
   */
  public triggerHaptic(type: SoundType): void {
    if (!this.isHapticsEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        const pattern = HAPTIC_PATTERNS[type] ?? 10;
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors if blocked by platform
      }
    }
  }

  /**
   * Play any of the 14+ Kobra-inspired synthesized UI sounds
   */
  public play(type: SoundType, options?: { volume?: number; detune?: number }): void {
    // Always trigger haptics on interaction even if sound is muted
    this.triggerHaptic(type);

    if (!this.isEnabled) return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const userVol = options?.volume ?? 1;

    switch (type) {
      case 'tap': {
        // Short punchy micro-tap (1300Hz sine with FM modulation, decay 18ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1300, now);

        mod.type = 'sine';
        mod.frequency.setValueAtTime(650, now);
        modGain.gain.setValueAtTime(100, now);

        mod.connect(modGain);
        modGain.connect(osc.frequency);

        const peakGain = 0.22 * userVol;
        gain.gain.setValueAtTime(peakGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        osc.connect(gain);
        gain.connect(this.masterGain);

        mod.start(now);
        osc.start(now);
        mod.stop(now + 0.02);
        osc.stop(now + 0.02);
        break;
      }

      case 'select': {
        // Clean UI selection blip (triangle 900Hz -> 780Hz, decay 55ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.055);

        const peakGain = 0.25 * userVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'toggleOn': {
        // Upbeat state activation (sine 520Hz -> 880Hz upward pitch sweep)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        const peakGain = 0.26 * userVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'toggleOff': {
        // Downbeat state deactivation (sine 780Hz -> 420Hz downward sweep)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(780, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

        const peakGain = 0.24 * userVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'open': {
        // Menu / Modal opening chime (triangle 320Hz -> 620Hz, lowpass 2600Hz, 130ms)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now);

        const peakGain = 0.22 * userVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.14);
        break;
      }

      case 'close': {
        // Menu / Modal dismiss (triangle 560Hz -> 300Hz, lowpass 2200Hz, 110ms)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        const peakGain = 0.2 * userVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'tick': {
        // Subtle tactile click (square 1400Hz, lowpass 3000Hz, 14ms)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);

        const peakGain = 0.14 * userVol;
        gain.gain.setValueAtTime(peakGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.016);
        break;
      }

      case 'sliderTick': {
        // Tactile white noise tick + subtle sine body
        const noise = ctx.createBufferSource();
        noise.buffer = this.getWhiteNoiseBuffer(ctx);
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(3000, now);
        bandpass.Q.setValueAtTime(4, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18 * userVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        noise.connect(bandpass);
        bandpass.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        oscGain.gain.setValueAtTime(0.09 * userVol, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        noise.start(now);
        osc.start(now);
        noise.stop(now + 0.022);
        osc.stop(now + 0.015);
        break;
      }

      case 'success': {
        // Harmonious chord (triangle 784Hz [G5] + triangle 1175Hz [D6] delayed 75ms)
        const playTone = (freq: number, startTime: number, vol: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(vol * userVol, startTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(startTime);
          osc.stop(startTime + 0.21);
        };

        playTone(784, now, 0.22);
        playTone(1175, now + 0.075, 0.18);
        break;
      }

      case 'error': {
        // Low descending warning tones (300Hz + 224Hz delayed 90ms, lowpass 1000Hz)
        const playBuzz = (freq: number, startTime: number, vol: number, dur: number) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1000, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(vol * userVol, startTime + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(startTime);
          osc.stop(startTime + dur + 0.01);
        };

        playBuzz(300, now, 0.24, 0.13);
        playBuzz(224, now + 0.09, 0.22, 0.18);
        break;
      }

      case 'warning': {
        // Double alert chime (triangle 622Hz, 85ms apart)
        const playChime = (startTime: number, vol: number) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(622, startTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2800, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(vol * userVol, startTime + 0.003);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.14);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(startTime);
          osc.stop(startTime + 0.15);
        };

        playChime(now, 0.2);
        playChime(now + 0.085, 0.17);
        break;
      }

      case 'destructive': {
        // Low pitch drop (triangle 300Hz -> 170Hz) + brown noise impact
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(170, now + 0.12);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.3 * userVol, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        const noise = ctx.createBufferSource();
        noise.buffer = this.getBrownNoiseBuffer(ctx);
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(700, now);
        noiseFilter.Q.setValueAtTime(1.1, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08 * userVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc.start(now);
        noise.start(now);
        osc.stop(now + 0.13);
        noise.stop(now + 0.07);
        break;
      }

      case 'copy': {
        // Double high blip for clipboard copy (sine 1200Hz + 1400Hz delayed 40ms)
        const playBlip = (freq: number, startTime: number, vol: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(vol * userVol, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.02);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(startTime);
          osc.stop(startTime + 0.025);
        };

        playBlip(1200, now, 0.18);
        playBlip(1400, now + 0.04, 0.15);
        break;
      }

      case 'notification': {
        // Ambient chime bell (triangle 523Hz [C5] + triangle 784Hz [G5] delayed 120ms)
        const playBell = (freq: number, startTime: number, vol: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(vol * userVol, startTime + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(startTime);
          osc.stop(startTime + dur + 0.02);
        };

        playBell(523, now, 0.15, 0.28);
        playBell(784, now + 0.12, 0.13, 0.25);
        break;
      }

      case 'swoosh': {
        // Airy sweep transition (sine 300Hz -> 2000Hz sweep)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.12);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12 * userVol, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.14);
        break;
      }

      case 'blocked': {
        // Low muted rejection thud (sine 180Hz, lowpass 700Hz, 60ms)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18 * userVol, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('antariksh_sound_muted', enabled ? 'false' : 'true');
    }
  }

  public isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public toggleSound(): boolean {
    const nextState = !this.isEnabled;
    this.setEnabled(nextState);
    if (nextState) {
      this.play('toggleOn');
    }
    return nextState;
  }

  public setHapticsEnabled(enabled: boolean): void {
    this.isHapticsEnabled = enabled;
  }

  public isHapticEnabled(): boolean {
    return this.isHapticsEnabled;
  }
}

export const soundEngine = new SoundEngine();
