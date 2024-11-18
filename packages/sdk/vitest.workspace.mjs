import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vite.config.mjs',
  {
    extends: 'vite.config.mjs',
    test: {
      browser: {
        enabled: true,
        name: 'edge',
        // headless: true,
        provider: 'webdriverio',
        // https://webdriver.io
        providerOptions: {},
      },
    },
  },
])
