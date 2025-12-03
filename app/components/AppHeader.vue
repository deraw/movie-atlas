<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const route = useRoute()

  const items = computed<NavigationMenuItem[]>(() => [
    {
      label: 'Catalogue',
      to: '/catalogue',
      active: route.path.startsWith('/catalogue')
    },
    {
      label: 'Favoris',
      to: '/favoris',
      active: route.path === '/favoris'
    },
    {
      label: 'À propos',
      to: '/a-propos',
      active: route.path === '/a-propos'
    }
  ])
</script>

<template>
  <UHeader title="MovieAtlas">
    <UNavigationMenu :items="items" />
  </UHeader>
</template>
