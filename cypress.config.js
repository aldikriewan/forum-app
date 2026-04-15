import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000,
    allowCypressEnv: false,
    supportFile: false,
    // Additional settings to prevent overlay issues
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    // Force Electron browser to avoid overlay issues
    browser: 'electron',
    // Additional settings
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
})