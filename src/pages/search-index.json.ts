import type { APIRoute } from "astro";
import { getAllPublishedArticles } from "../lib/articles";

export const GET: APIRoute = async () => {
  const articles = await getAllPublishedArticles();

  const searchIndex = articles.map((article) => ({
    title: article.title,
    description: article.description,
    category: article.category,
    tags: [],
    url: `/artikel/${article.id}/`,
    date: article.pubDate.toISOString().slice(0, 10),
    readingTime: article.readingTime,
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
