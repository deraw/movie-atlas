import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Home page', () => {
  test('renders trending hero and grid', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    await expect(
      page.getByText('Top tendance aujourd’hui', { exact: true }),
    ).toBeVisible()

    const heroTitle = page.getByRole('heading', { level: 1 })
    await expect(heroTitle).toBeVisible()
    await expect(heroTitle).not.toBeEmpty()

    await expect(
      page.getByRole('link', { name: 'Voir les détails' }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Top 10 des films tendance aujourd’hui',
      }),
    ).toBeVisible()

    const movieTitles = page.getByRole('heading', { level: 3 })
    await expect(movieTitles.first()).toBeVisible()
  })

  test('links to a movie details page', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const detailsLink = page.getByRole('link', { name: 'Voir les détails' })
    await expect(detailsLink).toBeVisible()

    await detailsLink.click()

    await expect(page).toHaveURL(/\/movie\/\d+$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('links to the catalogue page', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const catalogueLink = page.getByRole('link', {
      name: 'Voir le catalogue complet',
    })

    await expect(catalogueLink).toBeVisible()

    await catalogueLink.click()

    await expect(page).toHaveURL('/catalogue')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
