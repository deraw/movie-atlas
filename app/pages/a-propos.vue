<script setup lang="ts">
  usePageSeo({
    title: 'À propos',
    description: 'En savoir plus sur MovieAtlas, un projet Nuxt dédié à l’exploration de films via l’API TMDB.',
    path: '/a-propos'
  })
</script>

<template>
  <UContainer class="space-y-10 py-8">
    <BackButton />

    <section class="space-y-3">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
        À propos de MovieAtlas
      </h1>

      <p class="text-sm md:text-base text-slate-300 max-w-2xl">
        MovieAtlas est une application de découverte de films construite avec Nuxt 4 et Nuxt UI.
        L’objectif est de proposer une expérience moderne, rapide et agréable pour explorer les
        tendances du moment, consulter les fiches de films et gérer une liste de favoris.
      </p>
    </section>

    <section class="grid gap-6 md:grid-cols-3">
      <UCard class="md:col-span-2">
        <template #header>
          <h2 class="text-lg font-semibold">
            Le projet
          </h2>
        </template>

        <p class="text-sm text-slate-300 space-y-2">
          <span class="block">
            MovieAtlas est avant tout un projet de démonstration technique autour de l’écosystème
            Nuxt/Vue : rendu SSR/ISR, consommation d’API côté serveur, composants réutilisables,
            gestion d’état via composables et mise en place d’une interface responsive et accessible.
          </span>

          <span class="block mt-2">
            L’application met en avant un hero dynamique, un top des films tendance, une page de
            détails enrichie (casting, recommandations, bande-annonce) et une page de favoris basée
            sur le stockage local du navigateur.
          </span>
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Technologies
          </h2>
        </template>

        <ul class="list-disc list-inside space-y-1 text-sm text-slate-300">
          <li>Nuxt 4 (SSR, ISR, composables, server routes)</li>
          <li>Vue 3 &lt;script setup&gt;</li>
          <li>Nuxt UI (design system & composants UI)</li>
          <li>Nuxt Image (optimisation des visuels TMDB)</li>
          <li>TypeScript (types TMDB & API internes)</li>
          <li>Tailwind CSS (layout & responsive)</li>
        </ul>
      </UCard>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Données et API
          </h2>
        </template>

        <p class="text-sm text-slate-300 space-y-2">
          <span class="block">
            Toutes les données de films (titres, affiches, synopsis, notes, casting, recommandations,
            bandes-annonces) proviennent de l’API de
            <span class="font-medium">The Movie Database (TMDB)</span>.
          </span>

          <span class="block mt-2">
            Les appels vers TMDB sont effectués côté serveur via les routes
            <code class="px-1 py-0.5 rounded bg-slate-900 text-[0.75rem]">/api</code> de Nuxt,
            ce qui permet de garder la clé API sécurisée et de bénéficier du cache et du rendu
            pré-calculé (ISR).
          </span>
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Limites et objectifs
          </h2>
        </template>

        <p class="text-sm text-slate-300 space-y-2">
          <span class="block">
            MovieAtlas n’est pas un service commercial, mais un projet technique. Les fonctionnalités
            sont volontairement ciblées : tendances, détails, favoris locaux et navigation simple.
          </span>

          <span class="block mt-2">
            De futures évolutions possibles incluent : une recherche avancée, des filtres (genre,
            année, note) et une section séries.
          </span>
        </p>
      </UCard>
    </section>

    <section class="space-y-4">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Crédits
          </h2>
        </template>

        <div class="space-y-3 text-sm text-slate-300">
          <p>
            MovieAtlas utilise l’API de The Movie Database (TMDB), mais n’est ni approuvé ni
            certifié par TMDB. Toutes les images, logos et métadonnées de films restent la propriété
            de leurs détenteurs respectifs.
          </p>

          <p class="text-xs text-slate-400">
            « This product uses the TMDB API but is not endorsed or certified by TMDB. »
          </p>
        </div>
      </UCard>
    </section>

    <CatalogButton />
  </UContainer>
</template>
