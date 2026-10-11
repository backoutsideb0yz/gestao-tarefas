# Gestão de Tarefas

Aplicação fullstack de gerenciamento de tarefas. Cada usuário cria uma conta e vê apenas as próprias tarefas.

## Funcionalidades

- Cadastro e login com JWT
- Senhas protegidas com hash (bcrypt)
- Tarefas por usuário: criar, listar, editar, concluir e excluir
- Prioridade (baixa, média, alta) e data de vencimento
- Filtros por status e prioridade, busca e ordenação
- Contadores (total, pendentes, concluídas, atrasadas)
- Rotas protegidas no frontend e no backend

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Sonner, Lucide |
| Backend | Node.js, Express, TypeScript, Zod, JWT, bcryptjs |
| Banco | PostgreSQL, Prisma ORM (v6) |
| Infra | Docker Compose (banco) |

## Estrutura

```
gestao-tarefas/
├── backend/        API REST (Express + Prisma)
├── frontend/       Interface (Next.js)
└── docker-compose.yml
```

## Como rodar

**Pré-requisitos:** Node.js 20+, Docker e Git.

1. Clone e suba o banco, na raiz:
```bash
   docker compose up -d
```

2. Backend:
```bash
   cd backend
   cp .env.example .env
   npm install
   npx prisma migrate dev
   npm run dev
```
   Troque o `JWT_SECRET` do `.env` por um valor aleatório. Para gerar um:
```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Frontend, em outro terminal:
```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
```

Frontend: http://localhost:3000 · API: http://localhost:3333

No Windows (PowerShell), use `Copy-Item .env.example .env` no lugar do `cp`.

## Variáveis de ambiente

**backend/.env**

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `PORT` | Porta da API (padrão 3333) |
| `JWT_SECRET` | Segredo para assinar os tokens |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `7d`) |

**frontend/.env.local**

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL da API (ex.: `http://localhost:3333`) |

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | não | Cadastra usuário |
| POST | `/auth/login` | não | Retorna token e usuário |
| GET | `/auth/me` | sim | Dados do usuário logado |
| GET | `/tasks` | sim | Lista as tarefas do usuário |
| POST | `/tasks` | sim | Cria tarefa |
| PATCH | `/tasks/:id` | sim | Atualiza tarefa |
| DELETE | `/tasks/:id` | sim | Exclui tarefa |

Rotas autenticadas exigem o header `Authorization: Bearer <token>`.

## Decisões de segurança

- Senhas guardadas apenas como hash (bcrypt).
- O `userId` das tarefas vem do token, nunca do corpo da requisição.
- Toda consulta de tarefa filtra pelo usuário logado, e tarefa de outro usuário responde 404.
- Login devolve a mesma mensagem para email inexistente e senha errada.

## Melhorias futuras

- Middleware global de tratamento de erros
- Tratar corrida no cadastro com o erro `P2002` do Prisma
- Token em cookie `httpOnly` em vez de `localStorage`
- Validar datas absurdas no backend
- Modo escuro
- Deploy