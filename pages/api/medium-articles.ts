import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const mediumUsername = '@lilmod';
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`);
    const data = await response.json();
    
    const articles = data.items.map((item: any) => ({
      title: item.title,
      date: new Date(item.pubDate).toISOString(),
      description: item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      link: item.link,
      readTime: `${Math.ceil(item.content.split(' ').length / 200)} min read`,
      tags: item.categories || []
    }));

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Medium articles' });
  }
} 