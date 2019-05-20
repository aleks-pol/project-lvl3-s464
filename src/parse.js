const parser = new DOMParser();

function parseArticle(article) {
  const title = article.querySelector('title').textContent;
  const description = article.querySelector('description').textContent;
  const link = article.querySelector('link').textContent;
  const pubDate = article.querySelector('pubDate').textContent;
  return {
    title,
    description,
    link,
    pubDate,
  };
}

export default (data) => {
  const rss = parser.parseFromString(data, 'application/xml');
  const articles = rss.querySelectorAll('item');
  const parsedArticles = [...articles].map(parseArticle);
  const parsedFeed = {
    title: rss.querySelector('title').textContent,
    description: rss.querySelector('description').textContent,
  };
  return [parsedArticles, parsedFeed];
};
