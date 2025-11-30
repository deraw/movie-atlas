export const useDate = () => {
  const config = useRuntimeConfig()

  const formatDate = (iso: string) => {
    if (!iso) {
      return ''
    }

    return new Date(iso).toLocaleDateString(config.public.appLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateShort = (iso: string) => {
    if (!iso) {
      return ''
    }

    return new Date(iso).toLocaleDateString(config.public.appLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return { formatDate, formatDateShort }
}
