import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BackButton from '~/components/BackButton.vue'

const UButtonStub = {
  name: 'UButton',
  props: ['to'],
  template: `
    <a data-testid="back-button" :href="to">
      <slot />
    </a>
  `,
}

describe('BackButton.vue', () => {
  it('renders a link back to home with accessible label', () => {
    const wrapper = mount(BackButton, {
      global: {
        stubs: {
          UButton: UButtonStub,
        },
      },
    })

    const button = wrapper.get('[data-testid="back-button"]')

    expect(button.attributes('href')).toBe('/')
    expect(wrapper.text()).toContain('Retour à l\'accueil')
  })
})
