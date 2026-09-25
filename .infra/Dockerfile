# Contexto de build: a raiz do repo (no Coolify, base_directory "/" e
# dockerfile_location "/.infra/Dockerfile"). O ignore fica ao lado, em
# Dockerfile.dockerignore.
#
# Path sob o qual o app é servido. UMA variável para as três coisas que precisam
# concordar: o `base` do Vite, o diretório do dist na imagem e os `location` do
# nginx. Barra no início e no fim. Em produção a página fica em
# querobolsa.com.br/portal/100-questoes-do-enem/ via worker `querobolsa-portal-test`,
# que preserva o path.
ARG BASE_PATH=/portal/100-questoes-do-enem/

# ---- build: compila o app Vite ----
FROM node:22-alpine AS build
WORKDIR /app

# instala dependências a partir do lockfile (cache eficiente)
COPY package.json package-lock.json ./
RUN npm ci

# ARG global não atravessa o FROM: precisa ser redeclarado em cada stage
ARG BASE_PATH

COPY . .
# `--base` vai pro `vite build` (último comando do script `build`)
RUN npm run build -- --base "$BASE_PATH"

# ---- runtime: serve o dist/ com nginx ----
FROM nginx:alpine AS runtime

ARG BASE_PATH
# lido pelo envsubst do entrypoint da imagem nginx, que expande o template no boot
ENV BASE_PATH=$BASE_PATH

COPY .infra/nginx.conf.template /etc/nginx/templates/default.conf.template

# o proxy PRESERVA o path: o nginx recebe /portal/100-questoes-do-enem/... e
# precisa achar os arquivos ali
COPY --from=build /app/dist /usr/share/nginx/html$BASE_PATH

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
