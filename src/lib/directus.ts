// src/lib/directus.ts

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN;

export interface DirectusCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface DirectusArticle {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  excerpt: string;
  content: string;
  published_at: string | null;
  cover_image: string | null;
  category: DirectusCategory | null;
}

interface DirectusResponse<T> {
  data: T;
}

async function directusFetch<T>(
  endpoint: string,
  fallback: T
): Promise<T> {
  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    console.warn(
      "[AI Studio] DIRECTUS_URL or DIRECTUS_TOKEN not configured — using local content only."
    );
    return fallback;
  }

  try {
    const response = await fetch(
      `${DIRECTUS_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `[AI Studio] Directus API error: HTTP ${response.status} — using fallback.`
      );
      return fallback;
    }

    const result =
      (await response.json()) as DirectusResponse<T>;

    return result.data;
  } catch (error) {
    console.warn(
      "[AI Studio] Directus API unreachable — using fallback.",
      error
    );
    return fallback;
  }
}

// Mengambil artikel yang sudah diterbitkan
export async function getDirectusArticles() {
  const params = new URLSearchParams();

  params.set("filter[status][_eq]", "published");
  params.set("fields", "id,title,slug,status,excerpt,content,published_at,cover_image,category.id,category.name,category.slug");
  params.set("sort", "-published_at");
  params.set("limit", "-1");

  return directusFetch<DirectusArticle[]>(
    `/items/KataKode_Articles?${params.toString()}`,
    []
  );
}

// Mengambil daftar kategori
export async function getDirectusCategories() {
  return directusFetch<DirectusCategory[]>(
    "/items/KataKode_Categories?fields=id,name,slug,description",
    []
  );
}
