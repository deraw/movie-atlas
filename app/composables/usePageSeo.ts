type SeoValue = string | (() => string)

interface UsePageSeoOptions {
  title: SeoValue
  description: SeoValue
  path?: SeoValue
  type?: 'website' | 'article' | 'video.movie'
  ogImage?: SeoValue
}

export const usePageSeo = (options: UsePageSeoOptions) => {
  const config = useRuntimeConfig()

  const baseUrl = config.public.appUrl
  const defaultOgImage = `${baseUrl}/og-default.jpg`

  const {
    title,
    description,
    path = '/',
    type = 'website',
    ogImage
  } = options

  const url: SeoValue =
    typeof path === 'function'
      ? () => `${baseUrl}${path()}`
      : `${baseUrl}${path}`

  const image: SeoValue =
    ogImage ??
    defaultOgImage

  useSeoMeta({
    title,
    description,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogImage: image,

    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image
  })
}
