<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const route = useRoute()

  const items = computed<NavigationMenuItem[]>(() => [
    {
      label: 'Catalogue',
      to: '/catalogue',
      active: route.path.startsWith('/catalogue'),
    },
    {
      label: 'Favoris',
      to: '/favoris',
      active: route.path === '/favoris',
    },
    {
      label: 'À propos',
      to: '/a-propos',
      active: route.path === '/a-propos',
    },
  ])
</script>

<template>
  <UHeader
    title="MovieAtlas"
    mode="drawer"
  >
    <UNavigationMenu :items="items" />

    <template #right>
      <UTooltip text="Ouvrir sur GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/deraw/movie-atlas"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </template>
  </UHeader>
</template>
