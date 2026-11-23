import { getDirectusArticles } from "./directus";
import {
  adaptDirectusArticle,
  type UnifiedArticle,
} from "./article-adapter";

export async function getPublishedArticles(): Promise<UnifiedArticle[]> {
  const articles = (await getDirectusArticles()).map(
    adaptDirectusArticle
  );

  return articles.sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );
}

export async function getFeaturedArticle(): Promise<UnifiedArticle | undefined> {
  const articles = await getPublishedArticles();
  return articles[0];
}

export async function getLatestArticles(
  limit = 6
): Promise<UnifiedArticle[]> {
  const articles = await getPublishedArticles();
  const featured = articles[0];

  return articles
    .filter((article) => article.id !== featured?.id)
    .slice(0, limit);
}

export function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function getAllPublishedArticles(): Promise<UnifiedArticle[]> {
  return getPublishedArticles();
}
