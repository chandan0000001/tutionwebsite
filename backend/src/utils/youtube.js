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
