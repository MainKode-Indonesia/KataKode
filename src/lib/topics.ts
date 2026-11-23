import { getDirectusCategories } from "./directus";

export interface Topic {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export async function getAllTopics(): Promise<Topic[]> {
  const categories = await getDirectusCategories();

  return categories
    .filter((category) => category.slug?.trim())
    .map((category) => ({
      name: category.name,
      slug: category.slug.trim().toLowerCase(),
      description:
        category.description ||
        `Jelajahi artikel, tutorial, dan pembahasan seputar ${category.name}.`,
      icon: "◇",
    }));
}

export function getArticleCategory(article: {
  category?: string | { name?: string } | null;
}): string {
  if (typeof article.category === "string") {
    return article.category;
  }

  return article.category?.name ?? "Umum";
}

export function isArticleInTopic(
  article: { category?: string | { name?: string } | null },
  topic: Topic,
): boolean {
  return (
    getArticleCategory(article).trim().toLowerCase() ===
    topic.name.trim().toLowerCase()
  );
}
