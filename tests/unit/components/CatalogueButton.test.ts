import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CatalogButton from '~/components/CatalogButton.vue'

const UButtonStub = {
  name: 'UButton',
  props: ['to'],
  template: `
    <a data-testid="catalog-button" :href="to">
      <slot />
    </a>
  `,
}

describe('CatalogButton.vue', () => {
  it('renders a button linking to the catalogue', () => {
    const wrapper = mount(CatalogButton, {
      global: {
        stubs: {
          UButton: UButtonStub,
        },
      },
    })

    const button = wrapper.get('[data-testid="catalog-button"]')

    expect(button.attributes('href')).toBe('/catalogue')
    expect(wrapper.text()).toContain('Voir le catalogue complet')
  })
})
