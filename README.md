<div align="center">

# KataKode

**Bercerita tentang kode — ruang belajar, eksplorasi, dan berbagi pengetahuan seputar teknologi.**

[![Astro](https://img.shields.io/badge/Astro-7.4-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.0-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)

[Website](https://blog.nafeka.my.id/) · [Nafeka Ecosystem](https://nafeka.my.id/) · [MainKode](https://mainkode.nafeka.my.id/) · [GitHub](https://github.com/MainKode-Indonesia)

</div>

---

## Tentang Proyek

**KataKode** adalah platform blog teknologi bagian dari **Nafeka Ecosystem** yang berfokus pada artikel, tutorial, dan pembahasan seputar pemrograman, web development, Linux, dan jaringan komputer.

Dirancang dengan pendekatan *content-first*, KataKode mengutamakan tipografi yang nyaman dibaca, performa statis yang cepat, serta arsitektur konten hibrida yang menggabungkan **Astro Content Collections (Markdown)** dengan **Directus CMS**.

---

## Fitur Utama

- **Arsitektur Konten Hibrida** — Menggabungkan artikel Markdown lokal (`src/content/articles`) dan Directus CMS (`KataKode_Articles` & `KataKode_Categories`) dengan mekanisme *graceful fallback* otomatis jika CMS belum dikonfigurasi.
- **Reading Progress Indicator** — Indikator progres membaca di bagian atas halaman artikel (`/artikel/[slug]/`) yang mengikuti posisi gulir pembaca secara halus dan aksesibel.
- **Pencarian Instan (`/cari/`)** — Pencarian berbasis indeks statis (`/search-index.json`) yang memfilter judul, deskripsi, kategori, dan tag secara *real-time*.
- **Eksplorasi Topik (`/topik/`)** — Pengelompokan artikel terkurasi (Web Development, Programming, Linux, Networking) lengkap dengan penghitung jumlah artikel otomatis.
- **Keamanan Konten CMS** — Sanitasi HTML konten dari Directus menggunakan `sanitize-html` sebelum dirender ke halaman artikel.
- **Fondasi SEO & Sindikasi Lengkap** — Dilengkapi OpenGraph, Twitter Card, *canonical URL*, JSON-LD `BlogPosting` Schema, RSS Feed (`/rss.xml`), dan Sitemap otomatis (`@astrojs/sitemap`).

---

## Tech Stack

| Kategori | Teknologi |
| --- | --- |
| **Framework** | [Astro](https://astro.build/) (`^7.4`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Tipografi** | [Inter](https://fontsource.org/fonts/inter) (`@fontsource/inter`) |
| **Bahasa** | TypeScript |
| **CMS (Opsional)** | Directus REST API |
| **Keamanan** | `sanitize-html` |
| **SEO & Feed** | `@astrojs/sitemap`, `@astrojs/rss`, JSON-LD |

---

## Struktur Proyek

```text
.
├── public/                     # Aset statis (favicon, og-default.svg, robots.txt)
├── src/
│   ├── components/
│   │   ├── layout/             # Navbar & Footer
│   │   └── ui/                 # ArticleCard, CategoryBadge, TopicCard, ReadingProgress
│   ├── content/
│   │   └── articles/           # Artikel Markdown lokal
│   ├── content.config.ts       # Skema validasi Astro Content Collections
│   ├── data/                   # Definisi topik bawaan
│   ├── layouts/                # BaseLayout (SEO, meta tags, font, shell)
│   ├── lib/                    # Adaptor artikel, loader topik, & klien Directus
│   ├── pages/
│   │   ├── artikel/            # Daftar artikel & halaman detail [slug]
│   │   ├── topik/              # Daftar topik & filter per topik [slug]
│   │   ├── cari.astro          # Halaman pencarian artikel
│   │   ├── tentang.astro       # Halaman profil KataKode
│   │   ├── rss.xml.ts          # Endpoint RSS Feed
│   │   └── search-index.json.ts# Indeks JSON untuk fitur pencarian
│   └── styles/
│       └── global.css          # Tema Tailwind v4 & utilitas global
├── .env.example                # Contoh konfigurasi environment variable
├── astro.config.mjs            # Konfigurasi Astro, Vite, & Sitemap
└── package.json
```

---

## Memulai Secara Lokal

### Prasyarat

- **Node.js** `>= 22.0.0`
- **npm**

### Instalasi & Menjalankan Server

1. **Clone repositori**

   ```bash
   git clone https://github.com/MainKode-Indonesia/KataKode.git
   cd KataKode
   ```

2. **Pasang dependensi**

   ```bash
   npm install
   ```

3. **Konfigurasi environment variable (opsional untuk Directus)**

   ```bash
   cp .env.example .env
   ```

   Jika `DIRECTUS_URL` dan `DIRECTUS_TOKEN` dikosongkan, aplikasi tetap berjalan normal menggunakan artikel Markdown lokal.

4. **Jalankan server pengembangan**

   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`.

### Perintah Tersedia

| Perintah | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Astro di port `3000` |
| `npm run build` | Membangun situs statis produksi ke folder `dist/` |
| `npm run preview` | Menjalankan pratinjau hasil build produksi |
| `npx astro check` | Memeriksa tipe TypeScript dan diagnostik file `.astro` |

---

## Menulis Artikel

### 1. Artikel Markdown Lokal

Buat file `.md` baru di dalam direktori `src/content/articles/` dengan frontmatter berikut:

```markdown
---
title: "Judul Artikel"
description: "Ringkasan singkat isi artikel untuk pratinjau dan meta deskripsi."
category: "Web Development"
pubDate: 2026-11-23
readingTime: 5
featured: false
draft: false
tags: ["astro", "typescript"]
---

Tulis isi artikel dalam format Markdown di sini.
```

> Catatan: Apabila terdapat `slug` yang sama antara artikel Markdown dan Directus, artikel Markdown akan mendapat prioritas.

### 2. Integrasi Directus CMS (Opsional)

Atur variabel berikut pada file `.env` untuk menarik artikel dan kategori dari instance Directus:

```env
DIRECTUS_URL=https://cms.domainanda.com
DIRECTUS_TOKEN=your_directus_static_token
```

---

## Ekosistem Nafeka

KataKode merupakan bagian dari ekosistem digital **Nafeka**:

- **[Nafeka](https://nafeka.my.id/)** — Situs utama dan pusat identitas ekosistem.
- **[MainKode](https://mainkode.nafeka.my.id/)** — Portofolio pengembangan dan showcase proyek.
- **[KataKode](https://blog.nafeka.my.id/)** — Platform blog teknologi dan berbagi pengetahuan.

---

## Kontribusi

Kontribusi, saran perbaikan, maupun laporan *bug* sangat diterima. Pastikan perubahan yang diajukan tetap menjaga keterbacaan kode, konsistensi desain, dan lolos pemeriksaan `npx astro check` serta `npm run build`.

---

<div align="center">
  <sub>Dibangun dengan Astro & Tailwind CSS · Bagian dari <strong>Nafeka Ecosystem</strong></sub>
</div>
