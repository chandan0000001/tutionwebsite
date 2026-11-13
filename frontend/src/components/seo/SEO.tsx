import React, { useEffect } from 'react';
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

export const SEO: React.FC<SEOProps> = React.memo(({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}) => {
  const location = useLocation();

  const formattedTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME} Berhampur`;

  const targetCanonical = canonicalPath
    ? `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    document.title = formattedTitle;
  }, [formattedTitle]);

  return (
    <>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="title" content={formattedTitle} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={targetCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={targetCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card Tags */}
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={targetCanonical} />
      <meta property="twitter:image" content={ogImage} />
    </>
  );
});

SEO.displayName = 'SEO';

export default SEO;

