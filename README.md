# API REST da Loja

API refatorada para persistencia relacional com MySQL, autenticacao JWT e CRUD protegido de categorias.

## Requisitos

- Node.js
- MySQL

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Configure o `.env` com as credenciais do MySQL:

```env
PORT=3000
API_VERSION=2.0.0
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=loja
JWT_SECRET=bolitio123
JWT_EXPIRES_IN=7d
```

3. Importe o banco:

```bash
mysql -u root -p < database/loja.sql
```

4. Inicie a API:

```bash
npm start
```

## Rotas principais

- `GET /api/status`
- `GET /api/versao`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/profile`
- `GET /api/categorias`
- `GET /api/categorias/:id`
- `POST /api/categorias`
- `PUT /api/categorias/:id`
- `DELETE /api/categorias/:id`

## Login de teste

O script `database/loja.sql` cria um usuario de teste:

```json
{
  "email": "admin@loja.com",
  "senha": "123456"
}
```

## Protecao do CRUD de categorias

As rotas de categorias exigem duas informacoes ao mesmo tempo:

- Header `Authorization: Bearer <token>`
- ID explicito do usuario no header `x-user-id` ou no body/query como `usuarioId`

Sem token, a API retorna `401`. Com token valido mas sem ID explicito, tambem retorna `401`. Com ID diferente do token, retorna `403`.

Exemplo de criacao:

```http
POST /api/categorias
Authorization: Bearer <token>
x-user-id: 1
Content-Type: application/json

{
  "nome": "Eletronicos",
  "descricao": "Produtos eletronicos"
}
```

## Swagger

Com o servidor iniciado, acesse:

```text
http://localhost:3000/api-docs
```

Para regenerar a documentacao automaticamente com `swagger-autogen`, rode:

```bash
npm run swagger-autogen
```

O comando atualiza o arquivo `swagger-output.json`, usado pelo Swagger UI.
