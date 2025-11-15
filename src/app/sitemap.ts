import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: 'https://ambience-chat.vercel.app',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://ambience-chat.vercel.app/chat',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://ambience-chat.vercel.app/profile',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}
