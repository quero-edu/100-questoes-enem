import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Bundle namespaced for the reverse proxy at querobolsa.com.br/100-questoes-do-enem
  // (cloudflare-workers/reverse-proxy convention: `/__<slug>/` avoids clashing with the host's assets).
  base: '/__100-questoes-do-enem/',
  plugins: [react()],
})
