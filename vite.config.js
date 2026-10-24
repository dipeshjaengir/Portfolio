import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vitePluginCampaignApi } from './server/vitePluginApi.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePluginCampaignApi()
  ],
  server: {
    watch: {
      ignored: ['**/data/**', '**/*.json', '**/.git/**']
    }
  }
})
