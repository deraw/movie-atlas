import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AppFooter from '~/components/AppFooter.vue'

const UFooterStub = {
  name: 'UFooter',
  template: '<footer><slot /></footer>',
}

describe('AppFooter.vue', () => {
  it('renders copyright with current year', () => {
    const year = new Date().getFullYear()

    const wrapper = mount(AppFooter, {
      global: {
        stubs: {
          UFooter: UFooterStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Copyright © Dylan Broussard')
    expect(wrapper.text()).toContain(String(year))
  })
})
