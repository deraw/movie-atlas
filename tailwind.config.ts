import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontSize: {
        xs: '0.9em',
        sm: '1em',
        base: '1.125em',
        lg: '1.25em',
      },
    },
  },
}
