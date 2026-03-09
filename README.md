# CRM Workspace

Monorepo com 2 apps independentes:

- `backend/` API CRM (Next.js, porta 4000)
- `frontend/` UI/Landing (Next.js, porta 3000)

Nao existe acoplamento de codigo entre eles.

## Rodar local

### Backend

```bash
cd backend
cp .env.example .env.local
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Deploy na Vercel

Crie 2 projetos na Vercel apontando para o mesmo repo:

1. Projeto `crm-backend` com Root Directory = `backend`
2. Projeto `crm-frontend` com Root Directory = `frontend`

### Variaveis de ambiente

Backend (`backend`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_KEY`
- `ALLOW_ADMIN_KEY_IN_PRODUCTION` (`true` para liberar `x-admin-key` em producao)
- `FRONTEND_ORIGIN` (ex: `https://seu-frontend.vercel.app`)

Frontend (`frontend`):
- `NEXT_PUBLIC_API_BASE_URL` (ex: `https://seu-backend.vercel.app`)
- `NEXT_PUBLIC_SITE_URL` (ex: `https://seu-frontend.vercel.app`)

## Supabase (confirmacao por codigo)

No painel do Supabase (`Authentication > Providers > Email`):

1. Ative `Email`.
2. Ative `Confirm email` (codigo/link).
3. Configure `Site URL` com a URL do frontend publicado.
4. Adicione o frontend em `Redirect URLs`.

Obs: enquanto o fluxo de sessao Supabase nao estiver pronto no frontend admin, voce pode manter
`ALLOW_ADMIN_KEY_IN_PRODUCTION=true` no backend para operacao via `x-admin-key`.
