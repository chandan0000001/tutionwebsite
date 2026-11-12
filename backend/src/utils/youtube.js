/**
 * Centralized YouTube URL and ID Validator
 *
 * Implements strict security controls:
 * - Standard URL parser (new URL())
 * - HTTPS protocol enforcement
 * - Exact hostname whitelist (no unsafe substring checks)
 * - Strict 11-character video ID validation (/^[a-zA-Z0-9_-]{11}$/)
 * - Canonicalization and privacy-enhanced embed URL generation
 * - Rejection of javascript:, data:, http:, and arbitrary domains
 */

const ALLOWED_HOSTNAMES = new Set([
  'www.youtube.com',
  'youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
]);

const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Validate and extract YouTube video information.
 *
 * @param {string} rawInput - Full URL or raw 11-char video ID
 * @returns {{ isValid: boolean, videoId: string | null, canonicalUrl: string | null, embedUrl: string | null, error?: string }}
 */
export function validateYouTubeUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'YouTube URL or video ID is required.',
    };
  }

  const trimmed = rawInput.trim();

  // If a direct 11-character alphanumeric video ID is provided
  if (VIDEO_ID_REGEX.test(trimmed)) {
    return {
      isValid: true,
      videoId: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&modestbranding=1`,
    };
  }

  // Parse using standard WHATWG URL parser
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Invalid URL format.',
    };
  }

  // Protocol check: HTTPS strictly required
  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'HTTPS protocol is strictly required for YouTube video links.',
    };
  }

  // Exact hostname whitelist verification
  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTNAMES.has(hostname)) {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: `Disallowed video domain '${hostname}'. Only official YouTube URLs are permitted.`,
    };
  }

  let videoId = null;

  if (hostname === 'youtu.be') {
    // Format: https://youtu.be/VIDEO_ID
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      videoId = pathParts[0];
    }
  } else {
    // Formats:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://www.youtube.com/v/VIDEO_ID
    // https://www.youtube.com/live/VIDEO_ID
    // https://www.youtube.com/shorts/VIDEO_ID
    if (parsed.searchParams.has('v')) {
      videoId = parsed.searchParams.get('v');
    } else if (
      parsed.pathname.startsWith('/embed/') ||
      parsed.pathname.startsWith('/v/') ||
      parsed.pathname.startsWith('/live/') ||
      parsed.pathname.startsWith('/shorts/')
    ) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        videoId = parts[1];
      }
    }
  }

  if (!videoId || !VIDEO_ID_REGEX.test(videoId)) {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Could not extract a valid 11-character YouTube video ID from the provided URL.',
    };
  }

  return {
    isValid: true,
    videoId,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
  };
}

/**
 * Backward compatibility: extract YouTube video ID
 * @param {string} url
 * @returns {string | null}
 */
export function extractYouTubeId(url) {
  const result = validateYouTubeUrl(url);
  return result.isValid ? result.videoId : null;
}

/**
 * Backward compatibility: generate privacy-enhanced embed URL
 * @param {string} url
 * @returns {string | null}
 */
export function getYouTubeEmbedUrl(url) {
  const result = validateYouTubeUrl(url);
  return result.isValid ? result.embedUrl : null;
}

/* ========================================================================== */
/* STREAMABLE VIDEO VALIDATION & EMBED GENERATION                            */
/* ========================================================================== */

const STREAMABLE_HOSTNAMES = new Set([
  'streamable.com',
  'www.streamable.com',
]);

const STREAMABLE_CODE_REGEX = /^[a-zA-Z0-9_-]{4,12}$/;

/**
 * Validate and extract Streamable video information.
 * Supports direct shortcodes, standard URLs, and embed URLs.
 *
 * @param {string} rawInput
 * @returns {{ isValid: boolean, videoId: string | null, canonicalUrl: string | null, embedUrl: string | null, error?: string }}
 */
export function validateStreamableUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Streamable URL or shortcode is required.',
    };
  }

  const trimmed = rawInput.trim();

  // If a direct shortcode is provided (e.g. "moo9au")
  if (STREAMABLE_CODE_REGEX.test(trimmed) && !trimmed.includes('.') && !trimmed.includes('/')) {
    return {
      isValid: true,
      videoId: trimmed,
      canonicalUrl: `https://streamable.com/${trimmed}`,
      embedUrl: `https://streamable.com/e/${trimmed}`,
    };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Invalid Streamable URL format.',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'HTTPS protocol is strictly required for Streamable video links.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!STREAMABLE_HOSTNAMES.has(hostname)) {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: `Disallowed domain '${hostname}'. Only official streamable.com URLs are permitted.`,
    };
  }

  const pathParts = parsed.pathname.split('/').filter(Boolean);
  let shortcode = null;

  if (pathParts.length === 1) {
    shortcode = pathParts[0];
  } else if (pathParts.length >= 2 && (pathParts[0] === 'e' || pathParts[0] === 'o')) {
    shortcode = pathParts[1];
  }

  if (!shortcode || !STREAMABLE_CODE_REGEX.test(shortcode)) {
    return {
      isValid: false,
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Could not extract a valid Streamable shortcode from the provided URL.',
    };
  }

  return {
    isValid: true,
    videoId: shortcode,
    canonicalUrl: `https://streamable.com/${shortcode}`,
    embedUrl: `https://streamable.com/e/${shortcode}`,
  };
}

/* ========================================================================== */
/* UNIFIED MULTI-PROVIDER VIDEO VALIDATOR (YouTube & Streamable)             */
/* ========================================================================== */

/**
 * Validate either a YouTube or Streamable URL.
 * Automatically detects the provider and extracts video metadata.
 *
 * @param {string} rawInput
 * @returns {{ isValid: boolean, provider: 'youtube' | 'streamable', videoId: string | null, canonicalUrl: string | null, embedUrl: string | null, error?: string }}
 */
export function validateVideoUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      provider: 'youtube',
      videoId: null,
      canonicalUrl: null,
      embedUrl: null,
      error: 'Video URL is required.',
    };
  }

  const trimmed = rawInput.trim();
  const isStreamable = trimmed.toLowerCase().includes('streamable.com');

  if (isStreamable) {
    const res = validateStreamableUrl(trimmed);
    return {
      ...res,
      provider: 'streamable',
    };
  }

  // Default to YouTube validation
  const res = validateYouTubeUrl(trimmed);
  return {
    ...res,
    provider: 'youtube',
  };
}

/**
 * Extract safe video metadata (provider, ID, embedUrl) from a stored video link.
 *
 * @param {string} rawInput
 * @returns {{ provider: 'youtube' | 'streamable', videoId: string | null, embedUrl: string | null, canonicalUrl: string | null }}
 */
export function extractVideoMetadata(rawInput) {
  const result = validateVideoUrl(rawInput);
  if (result.isValid) {
    return {
      provider: result.provider,
      videoId: result.videoId,
      embedUrl: result.embedUrl,
      canonicalUrl: result.canonicalUrl,
    };
  }

  return {
    provider: rawInput && rawInput.includes('streamable') ? 'streamable' : 'youtube',
    videoId: null,
    embedUrl: null,
    canonicalUrl: rawInput || null,
  };
}

/* ========================================================================== */
/* DOCUMENT / STUDY MATERIAL URL VALIDATOR (Google Drive, Docs, PDFs)        */
/* ========================================================================== */

/**
 * Validate and sanitize document / lecture notes links.
 * Supports Google Drive files, Google Docs, Sheets, Slides, and general HTTPS document links.
 *
 * @param {string} rawInput
 * @returns {{ isValid: boolean, type: 'google_drive' | 'google_docs' | 'external', canonicalUrl: string | null, previewUrl: string | null, error?: string }}
 */
export function validateDocumentUrl(rawInput) {
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

  let parsed;
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
      error: 'HTTPS protocol is strictly required for document links.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 1. Google Drive (PDFs, Shared files, Folders)
  if (hostname === 'drive.google.com') {
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

    // Google Drive folder or generic sharing link
    return {
      isValid: true,
      type: 'google_drive',
      canonicalUrl: trimmed,
      previewUrl: trimmed,
    };
  }

  // 2. Google Docs / Sheets / Slides
  if (hostname === 'docs.google.com') {
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

  // 3. General external HTTPS documents (e.g. hosted PDFs, OneDrive, Dropbox)
  return {
    isValid: true,
    type: 'external',
    canonicalUrl: trimmed,
    previewUrl: trimmed,
  };
}
