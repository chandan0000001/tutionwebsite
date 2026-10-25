import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const { isSoundEnabled, toggleSound } = useSound();

  return (
    <button
      type="button"
      onClick={toggleSound}
      data-sound="swoosh"
      className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-600 hover:text-[#17365D] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] transition-all focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer flex items-center justify-center relative group ${className}`}
      aria-label={isSoundEnabled ? 'Mute interface sounds' : 'Unmute interface sounds'}
      title={isSoundEnabled ? 'Mute interface sounds' : 'Unmute interface sounds'}
      aria-pressed={isSoundEnabled}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] group-hover:scale-110 transition-transform" />
      ) : (
        <VolumeX className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
      )}
      <span className="sr-only">
        {isSoundEnabled ? 'Interface audio enabled' : 'Interface audio muted'}
      </span>
    </button>
  );
};

export default SoundToggle;
