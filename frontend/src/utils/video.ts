/**
 * Video & Document Utilities for Antariksh Academy
 * Supports YouTube & Streamable video hosting and Google Drive / Document study materials.
 */

export interface VideoInfo {
  isValid: boolean;
  provider: 'youtube' | 'streamable';
  videoId: string | null;
  embedUrl: string | null;
  canonicalUrl: string | null;
  error?: string;
}

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const STREAMABLE_CODE_REGEX = /^[a-zA-Z0-9_-]{4,12}$/;

/**
 * Validate and parse a video URL from YouTube or Streamable.
 */
export function parseVideoUrl(rawInput: string): VideoInfo {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      provider: 'youtube',
      videoId: null,
      embedUrl: null,
      canonicalUrl: null,
      error: 'Please enter a video URL or ID.',
    };
  }

  const trimmed = rawInput.trim();

  // 1. Direct 11-char YouTube ID
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return {
      isValid: true,
      provider: 'youtube',
      videoId: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&modestbranding=1`,
    };
  }

  // 2. Direct Streamable shortcode (e.g. moo9au)
  if (STREAMABLE_CODE_REGEX.test(trimmed) && !trimmed.includes('.') && !trimmed.includes('/')) {
    return {
      isValid: true,
      provider: 'streamable',
      videoId: trimmed,
      canonicalUrl: `https://streamable.com/${trimmed}`,
      embedUrl: `https://streamable.com/e/${trimmed}`,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      provider: 'youtube',
      videoId: null,
      embedUrl: null,
      canonicalUrl: null,
      error: 'Invalid URL format.',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      provider: 'youtube',
      videoId: null,
      embedUrl: null,
      canonicalUrl: null,
      error: 'HTTPS protocol is required for video links.',
    };
  }

  const host = parsed.hostname.toLowerCase();

  // Streamable
  if (host === 'streamable.com' || host === 'www.streamable.com') {
    const parts = parsed.pathname.split('/').filter(Boolean);
    let code: string | null = null;
    if (parts.length === 1) {
      code = parts[0];
    } else if (parts.length >= 2 && (parts[0] === 'e' || parts[0] === 'o')) {
      code = parts[1];
    }

    if (code && STREAMABLE_CODE_REGEX.test(code)) {
      return {
        isValid: true,
        provider: 'streamable',
        videoId: code,
        canonicalUrl: `https://streamable.com/${code}`,
        embedUrl: `https://streamable.com/e/${code}`,
      };
    }

    return {
      isValid: false,
      provider: 'streamable',
      videoId: null,
      embedUrl: null,
      canonicalUrl: null,
      error: 'Invalid Streamable link format.',
    };
  }

  // YouTube
  if (
    host === 'youtube.com' ||
    host === 'www.youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtu.be' ||
    host === 'www.youtube-nocookie.com'
  ) {
    let ytId: string | null = null;
    if (host === 'youtu.be') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length > 0) ytId = parts[0];
    } else {
      if (parsed.searchParams.has('v')) {
        ytId = parsed.searchParams.get('v');
      } else if (
        parsed.pathname.startsWith('/embed/') ||
        parsed.pathname.startsWith('/v/') ||
        parsed.pathname.startsWith('/live/') ||
        parsed.pathname.startsWith('/shorts/')
      ) {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) ytId = parts[1];
      }
    }

    if (ytId && YOUTUBE_ID_REGEX.test(ytId)) {
      return {
        isValid: true,
        provider: 'youtube',
        videoId: ytId,
        canonicalUrl: `https://www.youtube.com/watch?v=${ytId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`,
      };
    }

    return {
      isValid: false,
      provider: 'youtube',
      videoId: null,
      embedUrl: null,
      canonicalUrl: null,
      error: 'Could not find a valid YouTube video ID.',
    };
  }

  return {
    isValid: false,
    provider: 'youtube',
    videoId: null,
    embedUrl: null,
    canonicalUrl: null,
    error: 'Only YouTube (youtube.com, youtu.be) and Streamable (streamable.com) links are supported.',
  };
}

export interface DocumentInfo {
  isValid: boolean;
  type: 'google_drive' | 'google_docs' | 'external';
  canonicalUrl: string | null;
  previewUrl: string | null;
  error?: string;
}

/**
 * Validate and parse study notes or document links (Google Drive, Docs, PDFs).
 */
export function parseDocumentUrl(rawInput: string): DocumentInfo {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      type: 'external',
      canonicalUrl: null,
      previewUrl: null,
      error: 'Document URL is required.',
    };
  }

  const trimmed = rawInput.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      type: 'external',
      canonicalUrl: null,
      previewUrl: null,
      error: 'Invalid document URL format.',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      type: 'external',
      canonicalUrl: null,
      previewUrl: null,
      error: 'HTTPS protocol is required for document links.',
    };
  }

  const host = parsed.hostname.toLowerCase();

  // Google Drive
  if (host === 'drive.google.com') {
    const fileMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileMatch ? fileMatch[1] : parsed.searchParams.get('id');

    if (fileId) {
      return {
        isValid: true,
        type: 'google_drive',
        canonicalUrl: `https://drive.google.com/file/d/${fileId}/view`,
        previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      };
    }

    return {
      isValid: true,
      type: 'google_drive',
      canonicalUrl: trimmed,
      previewUrl: trimmed,
    };
  }

  // Google Docs / Sheets / Slides
  if (host === 'docs.google.com') {
    const docMatch = parsed.pathname.match(/\/(document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      const docType = docMatch[1];
      const docId = docMatch[2];
      return {
        isValid: true,
        type: 'google_docs',
        canonicalUrl: `https://docs.google.com/${docType}/d/${docId}/edit`,
        previewUrl: `https://docs.google.com/${docType}/d/${docId}/preview`,
      };
    }

    return {
      isValid: true,
      type: 'google_docs',
      canonicalUrl: trimmed,
      previewUrl: trimmed,
    };
  }

  // General HTTPS document
  return {
    isValid: true,
    type: 'external',
    canonicalUrl: trimmed,
    previewUrl: trimmed,
  };
}

/**
 * Smart external media click handler.
 * - On Desktop: opens in a new tab/window without modifying browser behavior.
 * - On Mobile (Android / iOS): intercepts click and attempts deep-linking directly into
 *   the native mobile application (YouTube App, Google Drive App, Google Docs/Sheets),
 *   with fallback to the webpage if the app is unavailable.
 */
export function handleExternalMediaClick(rawUrl: string, e?: React.MouseEvent): void {
  if (!rawUrl || typeof rawUrl !== 'string') return;
  const trimmed = rawUrl.trim();
  if (!trimmed) return;

  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMobile = isAndroid || isIOS;

  if (!isMobile) {
    // On desktop, the standard <a> tag with target="_blank" and rel="noopener noreferrer"
    // naturally opens in a fresh browser tab/page. If called programmatically without an event,
    // open via window.open.
    if (!e) {
      window.open(trimmed, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  // Prevent default new tab spawn in mobile browser to allow OS app intent dispatch
  if (e) {
    e.preventDefault();
  }

  // 1. YouTube Video
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const video = parseVideoUrl(trimmed);
    const videoId = video.videoId;

    if (isAndroid && videoId) {
      // Android Intent scheme specifically triggers the native YouTube app
      // and falls back gracefully to https:// in browser if uninstalled.
      window.location.href = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
      return;
    }

    if (isIOS && videoId) {
      // iOS YouTube app URL scheme
      window.location.href = `vnd.youtube://${videoId}`;
      setTimeout(() => {
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
      }, 500);
      return;
    }

    window.location.href = trimmed;
    return;
  }

  // 2. Google Drive Link
  if (trimmed.includes('drive.google.com')) {
    const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileMatch ? fileMatch[1] : '';

    if (isAndroid) {
      const intentUrl = fileId
        ? `intent://drive.google.com/file/d/${fileId}/view#Intent;package=com.google.android.apps.docs;scheme=https;end`
        : `intent://${trimmed.replace(/^https?:\/\//, '')}#Intent;package=com.google.android.apps.docs;scheme=https;end`;
      window.location.href = intentUrl;
      return;
    }

    if (isIOS) {
      if (fileId) {
        window.location.href = `googledrive://drive.google.com/file/d/${fileId}/view`;
        setTimeout(() => {
          window.location.href = trimmed;
        }, 500);
        return;
      }
    }

    window.location.href = trimmed;
    return;
  }

  // 3. Google Docs / Sheets / Slides
  if (trimmed.includes('docs.google.com')) {
    if (isAndroid) {
      let pkg = 'com.google.android.apps.docs';
      if (trimmed.includes('/document/')) pkg = 'com.google.android.apps.docs.editors.docs';
      else if (trimmed.includes('/spreadsheets/')) pkg = 'com.google.android.apps.docs.editors.sheets';
      else if (trimmed.includes('/presentation/')) pkg = 'com.google.android.apps.docs.editors.slides';

      window.location.href = `intent://${trimmed.replace(/^https?:\/\//, '')}#Intent;package=${pkg};scheme=https;end`;
      return;
    }

    if (isIOS) {
      if (trimmed.includes('/document/')) {
        window.location.href = `googledocs://${trimmed.replace(/^https?:\/\//, '')}`;
      } else if (trimmed.includes('/spreadsheets/')) {
        window.location.href = `googlesheets://${trimmed.replace(/^https?:\/\//, '')}`;
      } else if (trimmed.includes('/presentation/')) {
        window.location.href = `googleslides://${trimmed.replace(/^https?:\/\//, '')}`;
      }
      setTimeout(() => {
        window.location.href = trimmed;
      }, 500);
      return;
    }

    window.location.href = trimmed;
    return;
  }

  // 4. Default: Open in new window or navigate
  window.open(trimmed, '_blank', 'noopener,noreferrer');
}
