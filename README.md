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

A URL pública é `querobolsa.com.br/portal/100-questoes-do-enem`, servida pelo worker `querobolsa-portal-test` do repositório `quero-edu/cloudflare-workers`, que faz proxy para o app do Coolify **preservando o path**.

O app roda no Coolify (projeto **QeevoLandpages**, app `100-questoes-enem`) em `https://100-questoes-enem.quero.app/portal/100-questoes-do-enem/`, a partir do `.infra/Dockerfile`: build do Vite + nginx (`.infra/nginx.conf.template`). Pushes no `main` fazem o redeploy.

O path vem de uma variável só, `BASE_PATH` no `.infra/Dockerfile` (`/portal/100-questoes-do-enem/`): ela vira o `--base` do `vite build`, o diretório do `dist/` na imagem e os `location` do nginx. Arquivos de `public/` usados no código devem ser referenciados com `import.meta.env.BASE_URL`. Para gerar localmente o mesmo build de produção:

```bash
npm run build -- --base /portal/100-questoes-do-enem/
```

## Conteúdo

O arquivo-fonte original está em `content/100-questoes-enem.md`. A interface consome `src/data/questions.json`, gerado a partir desse Markdown com:

```bash
npm run data:generate
```

Não edite o JSON manualmente; atualize somente o Markdown-fonte e gere os dados novamente.

## Analytics (Montilla)

O SDK do Montilla é carregado pelo snippet oficial do CDN (v6) no `<head>` do `index.html`, com o client **Design Pages**. A configuração de tracking (autoTrack de cliques, formulários, impressões e page views) fica no admin do Montilla, não no código.

O formulário de captura de lead (`src/components/LeadCapture.tsx`) é registrado pelo autoTrack como evento `submit`, com os campos em `data_*` e identificado por `form_id: lead-form` e `data-montilla-form-type: lead`. O evento só dispara com o formulário válido.
