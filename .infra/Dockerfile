# Contexto de build: a raiz do repo (no Coolify, base_directory "/" e
# dockerfile_location "/.infra/Dockerfile"). O ignore fica ao lado, em
# Dockerfile.dockerignore.

# ---- build: compila o app Vite ----
FROM node:22-alpine AS build
WORKDIR /app

# instala dependências a partir do lockfile (cache eficiente)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime: serve o dist/ com nginx ----
FROM nginx:alpine AS runtime

COPY .infra/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
