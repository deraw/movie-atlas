import { vi } from 'vitest'

export const composablesMock = {
  useTmdbImage: () => ({
    getImageUrl: (path: string, size: string) =>
      `https://image.tmdb.org/t/p/${size}${path}`,
  }),
  useDate: () => ({
    formatDate: (date: string) => new Date(date).toLocaleDateString(),
  }),
}

export function mockComposables() {
  vi.mock('#app', () => composablesMock)
  vi.mock('#imports', () => composablesMock)
}
