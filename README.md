# Samfer

Projeto unificado em um unico deploy:

- landing e area publica
- area admin
- rotas `/api/*` do CRM no mesmo app Next.js

## Rodar local

```bash
cp frontend/.env.example frontend/.env.local
npm install --prefix frontend
npm run dev
```

## Deploy na Vercel

Use um unico projeto na Vercel apontando para este repositorio com:

- Root Directory = `frontend`

### Variaveis de ambiente

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase

No painel do Supabase (`Authentication > Providers > Email`):

1. Ative `Email`.
2. Ative `Confirm email` se quiser validacao por codigo ou link.
3. Configure `Site URL` com a URL publicada da Vercel.
4. Adicione essa mesma URL em `Redirect URLs`.

## SQL util

Os scripts de apoio do banco ficam em `sql/`.
