export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'rounded-full font-semibold'
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
      }
    },
    card: {
      slots: {
        root: 'rounded-xl',
        body: 'h-full'
      }
    }
  }
})
