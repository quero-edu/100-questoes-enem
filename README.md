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

## Conteúdo

O arquivo-fonte original está em `content/100-questoes-enem.md`. A interface consome `src/data/questions.json`, gerado a partir desse Markdown com:

```bash
npm run data:generate
```

Não edite o JSON manualmente; atualize somente o Markdown-fonte e gere os dados novamente.
