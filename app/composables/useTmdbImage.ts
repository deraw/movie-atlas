export const useTmdbImage = () => {
  const config = useRuntimeConfig()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const VALID_SIZES = [
    'w92', 'w154', 'w185', 'w342', 'w500', 'w780',
    'w300', 'w780', 'w1280', // backdrops
    'original',
  ] as const

  type TmdbImageSize = (typeof VALID_SIZES)[number]

  function getImageUrl(
    path: string | null | undefined,
    size: TmdbImageSize = 'original',
  ): string | undefined {
    if (!path) {
      return undefined
    }

    return `${config.public.tmdbImageBase}/${size}${path}`
  }

  return { getImageUrl }
}
