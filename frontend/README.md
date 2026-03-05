# CRM Frontend

Frontend independente do backend, rodando em `http://localhost:3000`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

- `npm run dev` inicia em `3000`
- `npm run lint` valida codigo
- `npm run build` build de producao

## Deploy (Vercel)

No projeto Vercel, configure Root Directory = `frontend`.

Variavel obrigatoria:
- `NEXT_PUBLIC_API_BASE_URL` (URL publica do backend)
