<script setup lang="ts">
  const router = useRouter()

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    icon="i-heroicons-arrow-left"
    class="text-sm"
    @click="goBack"
  >
    <span class="sr-only sm:not-sr-only">
      Retour à la page précédente
    </span>
  </UButton>
</template>
