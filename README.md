# Inmeta Backend — API de Gerenciamento de Documentação de Colaboradores

API RESTful desenvolvida em **NestJS + TypeScript** para gerenciar o fluxo de **documentação obrigatória de colaboradores**.

A aplicação permite o cadastro de colaboradores, vinculação com tipos de documentos, registro de envio de documentos e consulta de pendências.

---

## 🛠 Tecnologias Utilizadas

- Node.js + TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Docker + Docker Compose

---

## 📂 Estrutura do Projeto

src/
├── employees/ # Módulo de colaboradores
├── document-types/ # Módulo de tipos de documento
├── documents/ # Módulo de documentos
├── app.module.ts
└── main.ts

---

## 🚀 Como Executar

### Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=<SEU_USUARIO>
DB_PASS=<SUA_SENHA>
DB_NAME=<SEU_BANCO>

### Docker

#### Desenvolvimento (Hot Reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

Produção
docker compose -f docker-compose.yml up --build

Rodar migrations
docker compose exec api npm run typeorm migration:run

Resetar banco (somente desenvolvimento)
docker compose down -v
docker compose up --build

📜 Licença

Projeto desenvolvido para avaliação técnica.
