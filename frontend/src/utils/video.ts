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
