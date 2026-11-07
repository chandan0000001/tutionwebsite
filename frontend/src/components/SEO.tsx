import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

const DEFAULT_OG_IMAGE = 'https://antarikshacademy.vercel.app/og-image.png';
const BASE_URL = 'https://antarikshacademy.vercel.app';
const SITE_NAME = 'Antariksh Academy';

export function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME} Berhampur`;
    document.title = formattedTitle;

    // Helper: set or create a meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper: set or create link tag (canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'title', formattedTitle);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Canonical Link
    const targetCanonical = canonicalPath
      ? `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : `${BASE_URL}${location.pathname}`;
    setLinkTag('canonical', targetCanonical);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', targetCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // 5. Twitter Card Tags
    setMetaTag('property', 'twitter:title', formattedTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:url', targetCanonical);
    setMetaTag('property', 'twitter:image', ogImage);
  }, [title, description, keywords, canonicalPath, ogImage, ogType, location.pathname]);

  return null;
}

export default SEO;
