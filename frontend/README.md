# CRM Frontend

Frontend enxuto para reconstruir a interface com base no novo Figma.

Arquitetura oficial:

- Front: UI, navegacao e estado de interface
- Back: API oficial e regras de negocio
- Supabase: banco de dados

Fluxo principal:

`Front -> Back/API -> Supabase`

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Variaveis importantes

- `NEXT_PUBLIC_API_BASE_URL` (URL publica do backend, ex: `https://api.seudominio.com`)

## Scripts

- `npm run dev` inicia em `3000`
- `npm run lint` valida codigo
- `npm run build` build de producao

## Estrutura base

- `src/app`: rotas e layout global
- `src/components`: componentes de UI reutilizaveis
- `src/lib/api`: cliente HTTP e contratos de consumo da API do backend
- `src/types`: tipos compartilhados do frontend
