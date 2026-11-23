import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getAllPublishedArticles } from "../lib/articles";

export const GET: APIRoute = async (context) => {
  const articles = await getAllPublishedArticles();

  return rss({
    title: "KataKode — Bercerita tentang kode",
    description:
      "Artikel, tutorial, dan cerita seputar teknologi dan pemrograman.",
    site: context.site ?? "https://blog.nafeka.my.id",

    items: articles.map((article) => ({
      title: article.title,
      description: article.description,
      pubDate: article.pubDate,
      link: `/artikel/${article.id}/`,
      categories: [article.category],
    })),

    customData: "<language>id-ID</language>",
  });
};
