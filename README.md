# API de Gestão de Eventos

API REST para gerenciamento de eventos, usuários e inscrições. O projeto utiliza Node.js, Express, MongoDB, Mongoose, autenticação JWT e documentação interativa com Swagger.

## Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Criação, listagem, busca, atualização e remoção de eventos
- Filtros, busca textual e paginação na listagem de eventos
- Inscrição e cancelamento de inscrição em eventos
- Listagem de eventos criados pelo usuário autenticado
- Listagem de eventos em que o usuário está inscrito
- Documentação Swagger em `/api-docs`

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- dotenv
- Swagger UI Express

## Pré-requisitos

- Node.js instalado
- MongoDB local ou uma conexão MongoDB Atlas
- Cliente HTTP para testes, como Talend API Tester, Insomnia, Postman ou `curl`

## Como Rodar

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd "Projeto Api-Rest"
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

No arquivo `.env`, ajuste os valores conforme seu ambiente:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=sua_chave_secreta
```

4. Inicie o servidor:

```bash
npm start
```

O servidor ficará disponível em:

```text
http://localhost:3000
```

A documentação Swagger ficará disponível em:

```text
http://localhost:3000/api-docs/
```

## Autenticação

As rotas protegidas exigem um token JWT no header `Authorization`.

Exemplo:

```text
Authorization: Bearer SEU_TOKEN_JWT
```

Para obter o token, faça cadastro ou login pelas rotas `/api/auth/register` ou `/api/auth/login`.

## Endpoints

### Autenticação

| Método | Endpoint | Protegida | Descrição |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Não | Cadastra um novo usuário |
| POST | `/api/auth/login` | Não | Autentica um usuário |
| GET | `/api/auth/profile` | Sim | Retorna o perfil do usuário autenticado |

### Eventos

| Método | Endpoint | Protegida | Descrição |
| --- | --- | --- | --- |
| GET | `/api/events` | Não | Lista eventos |
| POST | `/api/events` | Sim | Cria um novo evento |
| GET | `/api/events/:id` | Não | Busca um evento pelo ID |
| PUT | `/api/events/:id` | Sim | Atualiza um evento criado pelo usuário autenticado |
| DELETE | `/api/events/:id` | Sim | Remove um evento criado pelo usuário autenticado |
| POST | `/api/events/:id/register` | Sim | Inscreve o usuário autenticado em um evento |
| POST | `/api/events/:id/unregister` | Sim | Cancela a inscrição do usuário autenticado |
| GET | `/api/events/user/created` | Sim | Lista eventos criados pelo usuário autenticado |
| GET | `/api/events/user/registered` | Sim | Lista eventos em que o usuário está inscrito |

### Rotas de teste

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/hello` | Retorna uma mensagem simples |
| GET | `/api/events/hello` | Retorna uma mensagem simples |

## Parâmetros de Consulta

A rota `GET /api/events` aceita os seguintes parâmetros:

| Parâmetro | Tipo | Exemplo | Descrição |
| --- | --- | --- | --- |
| `category` | string | `?category=Workshop` | Filtra por categoria |
| `status` | string | `?status=active` | Filtra por status |
| `search` | string | `?search=node` | Busca pelo título do evento |
| `page` | number | `?page=2` | Define a página da listagem |
| `limit` | number | `?limit=10` | Define a quantidade de itens por página |

Exemplo:

```text
GET /api/events?category=Workshop&status=active&page=1&limit=10
```

## Modelo de Dados

### Usuário

| Campo | Tipo | Obrigatório | Observações |
| --- | --- | --- | --- |
| `name` | String | Sim | Nome do usuário |
| `email` | String | Sim | Deve ser único e válido |
| `password` | String | Sim | Mínimo de 6 caracteres; armazenado com hash |
| `phone` | String | Não | Telefone do usuário |
| `role` | String | Não | `participant`, `organizer` ou `admin`; padrão: `participant` |
| `registeredEvents` | ObjectId[] | Não | Eventos em que o usuário está inscrito |
| `createdEvents` | ObjectId[] | Não | Eventos criados pelo usuário |
| `createdAt` | Date | Não | Data de criação do registro |

### Evento

| Campo | Tipo | Obrigatório | Observações |
| --- | --- | --- | --- |
| `title` | String | Sim | Entre 3 e 100 caracteres |
| `description` | String | Sim | Entre 10 e 1000 caracteres |
| `date` | Date | Sim | Deve ser uma data futura |
| `location` | String | Sim | Local do evento |
| `category` | String | Sim | `Conferência`, `Workshop`, `Meetup`, `Webinar`, `Palestra` ou `Outro` |
| `capacity` | Number | Sim | Entre 1 e 10000 |
| `price` | Number | Não | Valor mínimo 0; padrão: 0 |
| `tags` | String[] | Não | Lista de tags |
| `status` | String | Não | `active`, `cancelled` ou `completed`; padrão: `active` |
| `createdBy` | ObjectId | Sim | Usuário criador do evento |
| `attendees` | ObjectId[] | Não | Usuários inscritos |
| `createdAt` | Date | Não | Data de criação do evento |

## Exemplos com Curl

### Cadastrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "phone": "11999999999",
    "role": "organizer"
  }'
```

### Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

Guarde o valor de `token` retornado para acessar as rotas protegidas.

### Criar Evento

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "title": "Workshop de Node.js",
    "description": "Aprenda a criar uma API REST com Node.js, Express e MongoDB.",
    "date": "2026-12-31T20:00:00.000Z",
    "location": "São Paulo - SP",
    "category": "Workshop",
    "capacity": 50,
    "price": 49.9,
    "tags": ["node", "api", "mongodb"]
  }'
```

### Listar Eventos

```bash
curl http://localhost:3000/api/events
```

### Buscar Evento por ID

```bash
curl http://localhost:3000/api/events/ID_DO_EVENTO
```

### Atualizar Evento

```bash
curl -X PUT http://localhost:3000/api/events/ID_DO_EVENTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "capacity": 100,
    "price": 79.9,
    "status": "active"
  }'
```

### Inscrever-se em um Evento

```bash
curl -X POST http://localhost:3000/api/events/ID_DO_EVENTO/register \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### Cancelar Inscrição

```bash
curl -X POST http://localhost:3000/api/events/ID_DO_EVENTO/unregister \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### Deletar Evento

```bash
curl -X DELETE http://localhost:3000/api/events/ID_DO_EVENTO \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## Testando com Talend API Tester

1. Abra a extensão Talend API Tester no Google Chrome.
2. Informe a URL da rota desejada, por exemplo `http://localhost:3000/api/events`.
3. Escolha o método HTTP.
4. Para requisições com JSON, adicione o header `Content-Type: application/json`.
5. Para rotas protegidas, adicione o header `Authorization: Bearer SEU_TOKEN_JWT`.
6. Envie a requisição e confira a resposta.

## Estrutura do Projeto

```text
Projeto Api-Rest/
|-- src/
|   |-- config/
|   |   |-- db.js
|   |   `-- swagger.js
|   |-- controllers/
|   |   |-- AuthController.js
|   |   `-- EventController.js
|   |-- middleware/
|   |   |-- auth.js
|   |   `-- isEventOwner.js
|   |-- models/
|   |   |-- Event.js
|   |   `-- User.js
|   `-- routes/
|       |-- AuthRoutes.js
|       `-- EventRoutes.js
|-- .env.example
|-- package.json
|-- server.js
|-- swagger-autogen.js
`-- README.md
```

## Observações

- O MongoDB precisa estar acessível antes de iniciar o servidor.
- As datas de eventos devem estar em formato ISO e precisam ser futuras.
- O ID de eventos e usuários é gerado automaticamente pelo MongoDB.
- Apenas o usuário que criou um evento pode atualizá-lo ou removê-lo.
- A rota `/api-docs/` é a forma mais prática de explorar e testar a API durante o desenvolvimento.

## Autor

William dos Santos Hennemann - WilliamSHennemann
