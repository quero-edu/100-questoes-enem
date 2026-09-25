import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O `base` (path sob o qual o app é servido) vem do build: o `.infra/Dockerfile` roda
// `npm run build -- --base $BASE_PATH`. Em produção é /portal/100-questoes-do-enem/, servido em
// querobolsa.com.br pelo worker `querobolsa-portal-test` (quero-edu/cloudflare-workers), que
// PRESERVA o path — sem o base, os assets sairiam na raiz de querobolsa.com.br e dariam 404.
// Sem a flag (dev local) o app roda na raiz.
export default defineConfig({
  plugins: [react()],
})
