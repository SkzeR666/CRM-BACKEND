# CRM Backend

API oficial do projeto, rodando em `http://localhost:4000`.

Responsabilidades desta camada:

- expor rotas da API consumidas pelo frontend
- validar payloads (Zod)
- proteger rotas administrativas
- aplicar regras de negocio
- integrar com Supabase (banco)

Fluxo oficial:

`Front -> Back/API -> Supabase`

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

## Endpoints principais

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/projects/by-slug/:slug`
- `POST /api/projects` (admin)
- `PATCH /api/projects/:id` (admin)
- `DELETE /api/projects/:id` (admin)
- `GET /api/leads` (admin)
- `POST /api/leads` (publico)
- `PATCH /api/leads/:id` (admin)
- `DELETE /api/leads/:id` (admin)

## Auth admin

- Em desenvolvimento, `x-admin-key` pode ser usado com `ADMIN_API_KEY`.
- Em producao, rotas admin exigem usuario autenticado via Supabase.
- Opcional: `ALLOW_ADMIN_KEY_IN_PRODUCTION=true` libera `x-admin-key` tambem em producao.

## Deploy (Vercel)

No projeto Vercel, configure Root Directory = `backend`.

Variaveis obrigatorias:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_KEY`
- `ALLOW_ADMIN_KEY_IN_PRODUCTION` (`false` por padrao)
- `FRONTEND_ORIGIN` (aceita lista separada por virgula)

## Supabase: confirmacao por codigo

No painel do Supabase:

1. `Authentication > Providers > Email`: habilitar Email.
2. `Authentication > URL Configuration`: definir `Site URL` e `Redirect URLs` do frontend.
3. Habilitar confirmacao de email/codigo conforme o fluxo desejado.
