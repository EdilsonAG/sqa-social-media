import { defineConfig, devices } from '@playwright/test';

// URLs do sistema rodando localmente
export const API_URL = 'http://localhost:8080';
export const FRONT_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // roda um teste por vez (mais fácil de acompanhar na apresentação)
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      // Testes de API: não abrem navegador, só fazem requisições HTTP
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
   {
  name: 'e2e',
  testDir: './tests/e2e',
  use: { ...devices['Desktop Chrome'], channel: 'msedge', baseURL: FRONT_URL },
},
  ],
});
