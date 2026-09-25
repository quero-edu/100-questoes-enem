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

O resultado é gerado em `dist/` e pode ser publicado em serviços como Vercel.

## Publicação em querobolsa.com.br/100-questoes-do-enem

A página é servida em `querobolsa.com.br/100-questoes-do-enem` pelo worker `reverse-proxy` do repositório `quero-edu/cloudflare-workers`, que faz proxy para o deploy do Vercel. Por isso o bundle usa `base: '/__100-questoes-do-enem/'` (`vite.config.ts`), seguindo a convenção de namespacing de assets daquele repositório, e arquivos de `public/` devem ser referenciados com `import.meta.env.BASE_URL`. O `vercel.json` reescreve esse prefixo para que o domínio do Vercel continue funcionando direto.

## Conteúdo

O arquivo-fonte original está em `content/100-questoes-enem.md`. A interface consome `src/data/questions.json`, gerado a partir desse Markdown com:

```bash
npm run data:generate
```

Não edite o JSON manualmente; atualize somente o Markdown-fonte e gere os dados novamente.

## Analytics (Montilla)

O SDK do Montilla é carregado pelo snippet oficial do CDN (v6) no `<head>` do `index.html`, com o client **Design Pages**. A configuração de tracking (autoTrack de cliques, formulários, impressões e page views) fica no admin do Montilla, não no código.

O formulário de captura de lead (`src/components/LeadCapture.tsx`) é registrado pelo autoTrack como evento `submit`, com os campos em `data_*` e identificado por `form_id: lead-form` e `data-montilla-form-type: lead`. O evento só dispara com o formulário válido.
