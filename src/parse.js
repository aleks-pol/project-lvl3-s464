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
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  return {
    title,
    description,
    articles: parsedArticles,
  };
};
