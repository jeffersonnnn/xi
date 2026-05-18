import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://worldcupxi.xyz';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    { url: `${base}/vote`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${base}/players`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/leaderboard`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
