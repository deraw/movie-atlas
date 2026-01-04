import { test, expect } from '@nuxt/test-utils/playwright'

test('About page renders main content and legal notice', async ({ page, goto }) => {
  await goto('/a-propos', { waitUntil: 'hydration' })

  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toHaveText('À propos de MovieAtlas')

  await expect(page.getByRole('heading', { level: 2, name: 'Le projet' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Technologies' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Données et API' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Limites et objectifs' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Crédits' })).toBeVisible()

  await expect(
    page.getByText('The Movie Database (TMDB)', { exact: true }),
  ).toBeVisible()

  await expect(
    page.getByText('not endorsed or certified by TMDB'),
  ).toBeVisible()
})
