# API REST da Loja

API refatorada para persistencia relacional com MySQL, autenticacao JWT e CRUD protegido de categorias, produtos, clientes e pedidos.

## Configuracao

```bash
npm install
npm run swagger-autogen
npm start
```

Importe o seu banco `loja.sql` fornecido pelo professor:

```bash
mysql -u root -p < database/loja.sql
```

Garanta tambem que a tabela `usuarios` exista no banco `loja`, pois ela e usada no login.

Configure o `.env`:

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

## Login

`usuarios` autentica. `clientes` e uma entidade separada da loja.

```json
{
  "email": "admin@loja.com",
  "senha": "123456"
}
```

Use o token no botao **Authorize** do Swagger e use `x-user-id: 1` nos CRUDs privados.

## Rotas

- `GET /api/status`
- `GET /api/versao`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/profile`
- `/api/categorias`
- `/api/produtos`
- `/api/clientes`
- `/api/pedidos`

Swagger:

```text
http://localhost:3000/api-docs
```
