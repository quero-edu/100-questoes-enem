# 100 Questões ENEM Comentadas

Aplicação web interativa em React + Vite para responder 100 questões organizadas nas quatro áreas do ENEM, com correção imediata, comentários, resultados por área e revisão de erros.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

O resultado é gerado em `dist/`.

## Publicação

O app roda no Coolify (projeto **QeevoLandpages**, app `100-questoes-enem`) em `https://100-questoes-enem.quero.app`, a partir do `.infra/Dockerfile`: build do Vite + nginx servindo o `dist/` (`.infra/nginx.conf`). Pushes no `main` fazem o redeploy.

A URL pública é `querobolsa.com.br/100-questoes-do-enem`, servida pelo worker `reverse-proxy` do repositório `quero-edu/cloudflare-workers`, que faz proxy para o app do Coolify. Por isso o bundle usa `base: '/__100-questoes-do-enem/'` (`vite.config.ts`), seguindo a convenção de namespacing de assets daquele repositório, e arquivos de `public/` devem ser referenciados com `import.meta.env.BASE_URL`. O worker tira esse prefixo antes de repassar; o `.infra/nginx.conf` também aceita o prefixo, para o domínio `*.quero.app` funcionar direto.

## Conteúdo

O arquivo-fonte original está em `content/100-questoes-enem.md`. A interface consome `src/data/questions.json`, gerado a partir desse Markdown com:

```bash
npm run data:generate
```

Não edite o JSON manualmente; atualize somente o Markdown-fonte e gere os dados novamente.

## Analytics (Montilla)

O SDK do Montilla é carregado pelo snippet oficial do CDN (v6) no `<head>` do `index.html`, com o client **Design Pages**. A configuração de tracking (autoTrack de cliques, formulários, impressões e page views) fica no admin do Montilla, não no código.

O formulário de captura de lead (`src/components/LeadCapture.tsx`) é registrado pelo autoTrack como evento `submit`, com os campos em `data_*` e identificado por `form_id: lead-form` e `data-montilla-form-type: lead`. O evento só dispara com o formulário válido.
