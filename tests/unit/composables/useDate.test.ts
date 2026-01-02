import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useDate } from '~/composables/useDate'

vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      appLocale: 'fr-FR',
    },
  }),
}))

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      appLocale: 'fr-FR',
    },
  }),
}))

describe('useDate', () => {
  const isoDate = '2024-01-15'

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns empty string when iso date is empty (formatDate)', () => {
    const { formatDate } = useDate()
    expect(formatDate('')).toBe('')
  })

  it('returns empty string when iso date is empty (formatDateShort)', () => {
    const { formatDateShort } = useDate()
    expect(formatDateShort('')).toBe('')
  })

  it('formats date with long format options', () => {
    const toLocaleSpy = vi
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockReturnValue('15 janvier 2024')

    const { formatDate } = useDate()
    const result = formatDate(isoDate)

    expect(toLocaleSpy).toHaveBeenCalledWith('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(result).toBe('15 janvier 2024')
  })

  it('formats date with short format options', () => {
    const toLocaleSpy = vi
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockReturnValue('15 janv. 2024')

    const { formatDateShort } = useDate()
    const result = formatDateShort(isoDate)

    expect(toLocaleSpy).toHaveBeenCalledWith('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    expect(result).toBe('15 janv. 2024')
  })
})
