import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Catalogue page', () => {
  test('renders header and mode toggles', async ({ page, goto }) => {
    await goto('/catalogue', { waitUntil: 'hydration' })

    await expect(page.getByRole('heading', { level: 1, name: 'Catalogue de films' })).toBeVisible()

    await expect(page.getByRole('button', { name: 'Rechercher par titre' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Filtrer le catalogue' })).toBeVisible()

    await expect(page.getByRole('button', { name: 'Réinitialiser' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Rechercher', exact: true })).toBeVisible()
  })

  test('switches between search mode and filter mode', async ({ page, goto }) => {
    await goto('/catalogue', { waitUntil: 'hydration' })

    const searchModeBtn = page.getByRole('button', { name: 'Rechercher par titre' })
    const filterModeBtn = page.getByRole('button', { name: 'Filtrer le catalogue' })

    await expect(page.getByPlaceholder('Titre du film')).toBeVisible()

    await filterModeBtn.click()

    await expect(page.getByText('Année', { exact: true })).toBeVisible()
    await expect(page.getByText('Trier par', { exact: true })).toBeVisible()
    await expect(page.getByPlaceholder('Note min.')).toBeVisible()

    await expect(page.getByPlaceholder('Titre du film')).toHaveCount(0)

    await searchModeBtn.click()
    await expect(page.getByPlaceholder('Titre du film')).toBeVisible()
  })

  test('submitting a title search updates the route query', async ({ page, goto }) => {
    await goto('/catalogue', { waitUntil: 'hydration' })

    await page.getByPlaceholder('Titre du film').fill('matrix')
    await page.getByRole('button', { name: 'Rechercher', exact: true }).click()

    await expect(page).toHaveURL(/\/catalogue\?.*search=matrix/i)
  })

  test('reset clears the query string', async ({ page, goto }) => {
    await goto('/catalogue?search=matrix&page=3', { waitUntil: 'hydration' })

    await page.getByRole('button', { name: 'Réinitialiser' }).click()

    await expect(page).toHaveURL(/\/catalogue(\?|$)/)
    await expect(page.getByPlaceholder('Titre du film')).toHaveValue('')
  })

  test('applies filters and writes expected route query', async ({ page, goto }) => {
    await goto('/catalogue', { waitUntil: 'hydration' })

    await page.getByRole('button', { name: 'Filtrer le catalogue', exact: true }).click()

    await page.getByText('Année', { exact: true }).click()
    await page.getByRole('option', { name: '2023' }).click()

    await page.getByRole('combobox', { name: 'Trier par' }).click()
    await page.getByLabel('Date de sortie').getByText('Date de sortie').click()

    await page.getByRole('button', { name: 'Augmenter' }).click({ clickCount: 3 })

    const form = page.locator('form')
    await form.getByRole('button', { name: 'Rechercher', exact: true }).click()

    await expect(page).toHaveURL(/\/catalogue\?/)
    await expect(page).toHaveURL(/(?:\?|&)mode=filter(?:&|$)/)
    await expect(page).toHaveURL(/(?:\?|&)page=1(?:&|$)/)
    await expect(page).toHaveURL(/(?:\?|&)year=2023(?:&|$)/)
    await expect(page).toHaveURL(/(?:\?|&)minVote=1(?:&|$)/)

    await expect(page).toHaveURL(
      /(?:\?|&)sortBy=primary_release_date\.desc(?:&|$)/,
    )
  })
})
