const fs = require('fs');
const path = require('path');

async function fetchAndSaveArticles() {
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

    // Save to public directory
    const filePath = path.join(process.cwd(), 'public', 'articles.json');
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
    console.log('Articles saved successfully!');
  } catch (error) {
    console.error('Failed to fetch Medium articles:', error);
  }
}

fetchAndSaveArticles(); 