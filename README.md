# 🎬 MovieAtlas

MovieAtlas is a movie discovery application built with **Nuxt 4**, **Nuxt UI**, and **The Movie Database (TMDB) API**.

It delivers a fast, elegant and responsive experience for browsing trending movies, viewing detailed pages, and managing personal favorites stored locally in the browser.

This project demonstrates modern Nuxt best practices: SSR/ISR rendering, server API routes, composables, runtime configuration, SEO meta optimization, reusable and accessible UI components.

---

## ✨ Features

### Home Page
- Daily trending movies from TMDB (server-side fetching)
- Dynamic hero section with HD backdrop, poster, score, genres and synopsis
- Favorite toggle with instant UI updates
- Responsive movie grid (1 column on mobile)

### Movie Details
- Full movie information (title, synopsis, runtime, release date, genres…)
- Cast details
- Recommended movies
- Trailer preview (YouTube modal)
- Shared Hero component adapted for rich movie data
- Smart “go back” button (back history or fallback to home)

### Favorites
- Persistent favorites stored using `localStorage`
- Managed via a custom `useFavorites()` composable
- Accessible movie grid showing saved favorites

### Catalog (placeholder)
- Dedicated catalog page for future full browsing and filtering

### About Page
- Project presentation
- Technology overview
- TMDB attribution

---

## Tech Stack

- **Nuxt 4** — SSR/ISR, server routes, async data, SEO meta, file-based routing
- **Vue 3** — `<script setup>`, composables, reactivity
- **Nuxt UI** — navigation, cards, badges, buttons, modal
- **Tailwind CSS** — responsive layout and design system
- **Nuxt Image** — optimized TMDB image loading
- **TypeScript** — full typing of TMDB API and internal models
- **TMDB API** — trending movies, details, recommendations, trailers, cast

---

## API Integration

All TMDB requests are handled server-side through Nuxt API routes:

```
/server/api/movies
/server/api/trending-movies
```

This ensures:
- Secure API key usage
- Faster server caching
- Optimal SSR/ISR rendering
- Cleaner client-side code

---

## 🧑‍💻 Installation

```bash
pnpm install
```

---

## Development

```bash
pnpm run dev
```

The project will be available at:

```
http://localhost:3000
```

---

## Production

Build the application:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

---

## Environment Variables

Create a `.env` file:

```
NUXT_TMDB_API_KEY=your_api_key
NUXT_PUBLIC_APP_URL=https://your-site.com
```

---

## SEO & Open Graph

Each page uses:
- `definePageMeta()` for titles (with global `titleTemplate`)
- `useSeoMeta()` wrapped in `if (import.meta.server)` for server-only meta generation
- Dynamic OG images for movie pages using TMDB backdrops

---

## TMDB Attribution

> This product uses the TMDB API but is not endorsed or certified by TMDB.

All movie images and data are provided by **The Movie Database**.

---

## License

MIT  
Feel free to explore, modify or reuse this project.
