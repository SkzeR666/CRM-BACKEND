# CRM Backend

API do CRM (independente do frontend), rodando em `http://localhost:4000`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

- `npm run dev` inicia em `4000`
- `npm run test` roda testes
- `npm run lint` valida codigo
- `npm run build` build de producao

## Deploy (Vercel)

No projeto Vercel, configure Root Directory = `backend`.

Variaveis obrigatorias:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_KEY`
- `FRONTEND_ORIGIN` (aceita lista separada por virgula)
