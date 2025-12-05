<script setup lang="ts">
  defineProps<{
    title: string
    backdrop: string | null
    poster?: string | null
    tagline?: string | null
    status?: string | null
    runtime?: number | null
    releaseDate?: string | null
    vote?: number
    genres?: { id: number, name: string }[]
    overview?: string | null
  }>()

  const expanded = ref(false)
  const shouldClampOverview = computed(() => !expanded.value)

  const { getImageUrl } = useTmdbImage()
  const { formatDate } = useDate()
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl bg-black">
    <div class="relative w-full">
      <NuxtImg
        v-if="backdrop"
        :src="getImageUrl(backdrop, 'w1280')"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      <div
        class="
        relative
        z-10
        flex
        flex-col
        justify-end
        min-h-[55vh]
        sm:min-h-80
        lg:min-h-[420px]
      "
      >
        <div class="p-6 md:p-10 flex gap-6 md:gap-10 items-end w-full">
          <div class="hidden sm:block w-32 md:w-40 lg:w-48 shrink-0">
            <div class="relative aspect-2/3 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
              <NuxtImg
                v-if="poster"
                :src="getImageUrl(poster, 'w342')"
                :alt="title"
                class="w-full h-full object-cover"
              />

              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-slate-800 text-xs text-slate-300"
              >
                Aucune image
              </div>
            </div>
          </div>

          <div class="space-y-3 text-white max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <slot name="badge">
                <UBadge
                  v-if="status"
                  color="success"
                  variant="soft"
                  size="sm"
                >
                  {{ status }}
                </UBadge>
              </slot>

              <span
                v-if="runtime"
                class="text-slate-200"
              >
                {{ runtime }} min
              </span>
            </div>

            <div class="space-y-1">
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {{ title }}
              </h1>

              <p
                v-if="tagline"
                class="md:text-base text-slate-300 italic"
              >
                {{ tagline }}
              </p>
            </div>

            <div class="flex flex-wrap gap-3 items-center text-slate-200">
              <time
                v-if="releaseDate"
                :datetime="releaseDate"
              >
                {{ formatDate(releaseDate) }}
              </time>

              <span
                v-if="vote !== undefined"
                class="inline-flex items-center gap-1"
              >
                ⭐
                <span class="font-semibold">
                  {{ vote.toFixed(1) }}
                </span>
                /10
              </span>

              <span
                v-if="genres?.length"
                class="inline-flex flex-wrap gap-2"
              >
                <UBadge
                  v-for="genre in genres"
                  :key="genre.id"
                  color="neutral"
                  variant="soft"
                >
                  {{ genre.name }}
                </UBadge>
              </span>
            </div>

            <template v-if="overview">
              <p
                :class="[
                  'text-sm md:text-base text-slate-100',
                  shouldClampOverview ? 'line-clamp-3' : '',
                ]"
              >
                {{ overview }}
              </p>

              <button
                class="text-xs text-slate-300 hover:underline"
                @click="expanded = !expanded"
              >
                {{ expanded ? 'Afficher moins' : 'Afficher plus' }}
              </button>

              <div class="pt-2 flex flex-wrap gap-3">
                <slot name="actions" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
