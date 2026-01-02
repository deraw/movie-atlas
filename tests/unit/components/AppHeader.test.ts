import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import AppHeader from '~/components/AppHeader.vue'

vi.mock('#imports', () => ({
  useRoute: () => ({ path: '/' }),
}))

vi.mock('#app', () => ({
  useRoute: () => ({ path: '/' }),
}))

const UHeaderStub = {
  name: 'UHeader',
  template: '<div><slot /><slot name="right" /><slot name="body" /></div>',
}

const UNavigationMenuStub = {
  name: 'UNavigationMenu',
  props: ['items', 'orientation'],
  template: '<nav data-testid="menu"></nav>',
}

const UTooltipStub = {
  name: 'UTooltip',
  template: '<div><slot /></div>',
}

const UButtonStub = {
  name: 'UButton',
  props: ['to', 'target'],
  template: `
    <a
      data-testid="github"
      :href="to"
      :target="target"
    >
      GitHub
    </a>
  `,
}

const Stub = { template: '<div />' }

describe('AppHeader.vue', () => {
  async function mountComponent() {
    return mount(AppHeader, {
      global: {
        stubs: {
          UHeader: UHeaderStub,
          UNavigationMenu: UNavigationMenuStub,
          UTooltip: UTooltipStub,
          UButton: UButtonStub,
          UColorModeButton: Stub,
        },
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders two navigation menus (header and drawer)', async () => {
    const wrapper = await mountComponent()

    const menus = wrapper.findAll('[data-testid="menu"]')
    expect(menus).toHaveLength(2)
  })

  it('renders the GitHub link inside the right slot', async () => {
    const wrapper = await mountComponent()

    const link = wrapper.get('[data-testid="github"]')
    expect(link.attributes('href')).toBe('https://github.com/deraw/movie-atlas')
    expect(link.attributes('target')).toBe('_blank')
  })
})
