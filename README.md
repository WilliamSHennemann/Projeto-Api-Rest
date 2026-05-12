# API de Gestão de Eventos

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- MongoDB instalado (local ou Atlas)
- Extensão [Talend API Tester](https://chrome.google.com/webstore/detail/talend-api-tester) no Google Chrome (opcional para testes)

### Passos para executar

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd event-management-api
Instale as dependências

bash
npm install
Configure as variáveis de ambiente

bash
cp .env.example .env
Edite o arquivo .env:

text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-management
Inicie o servidor

bash
npm start
O servidor estará rodando em: http://localhost:3000

Lista de Endpoints
Método	Endpoint	Descrição
POST	/api/events	Criar um novo evento
GET	/api/events	Listar todos os eventos
GET	/api/events/:id	Buscar um evento pelo ID
PUT	/api/events/:id	Atualizar um evento
DELETE	/api/events/:id	Deletar um evento
Parâmetros de consulta (GET /api/events)
Parâmetro	Tipo	Exemplo	Descrição
category	string	?category=Workshop	Filtra por categoria
status	string	?status=active	Filtra por status
search	string	?search=Node	Busca no título
page	number	?page=2	Número da página
limit	number	?limit=10	Itens por página
Modelo de Dados (Evento)
Campo	Tipo	Obrigatório	Validação
title	String	Sim	mínimo 3 caracteres
description	String	Sim	mínimo 10 caracteres
date	Date	Sim	deve ser futura
location	String	Sim	-
category	String	Sim	Conferência, Workshop, Meetup, Webinar, Palestra, Outro
capacity	Number	Sim	entre 1 e 10000
price	Number	Não	padrão 0
tags	Array	Não	-
status	String	Não	active, cancelled, completed (padrão: active)
Como testar com Talend API Tester (extensão do Google Chrome)
Passo 1: Abrir a extensão
Clique no ícone da extensão Talend API Tester no canto superior direito do Chrome

Passo 2: Configurar as requisições
1. Criar Evento (POST)
Campo	Valor
URL	http://localhost:3000/api/events
Método	POST
Headers	Content-Type: application/json
Body (JSON):

json
{
  "title": "Evento Teste",
  "description": "Descrição do evento de teste",
  "date": "2026-05-20T19:00:00",
  "location": "São Paulo",
  "capacity": 10,
  "price": 50
}
Como fazer:

Selecione método POST

Digite a URL acima

Vá na aba Headers e adicione Content-Type: application/json

Vá na aba Body, selecione JSON e cole o JSON acima

Clique em Send

Resposta esperada:

json
{
  "success": true,
  "event": {
    "_id":"675a8b3c1234567890abcdef",
    "title":"Workshop de Node.js",
    "description":"Aprenda Node.js criando uma API REST",
    "date":"2025-02-15T14:00:00.000Z",
    "location":"São Paulo - SP",
    "capacity":50,
    "price":49.9,
    "createdAt":"2024-12-12T10:00:00.000Z"
  }
}
2. Listar Eventos (GET)
Campo	Valor
URL	http://localhost:3000/api/events
Método	GET
Como fazer:

Selecione método GET

Digite a URL acima

Clique em Send

Resposta esperada:

json
{
  "success": true,
  "count": 2,
  "total": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "events": [...]
}
3. Buscar Evento por ID (GET)
Campo	Valor
URL	http://localhost:3000/api/events/ID_DO_EVENTO
Método	GET
Como fazer:

Copie o _id de um evento retornado na listagem

Substitua ID_DO_EVENTO pelo ID copiado

Selecione método GET

Clique em Send

Resposta esperada:

json
{
  "success": true,
  "event": {
    "_id": "675a8b3c1234567890abcdef",
    "title": "Workshop de Node.js",
    ...
  }
}
4. Atualizar Evento (PUT)
Campo	Valor
URL	http://localhost:3000/api/events/ID_DO_EVENTO
Método	PUT
Headers	Content-Type: application/json
Body (JSON):

json
{
  "capacity": 100,
  "price": 79.90,
  "status": "active"
}
Como fazer:

Selecione método PUT

Digite a URL com o ID do evento

Adicione o Header Content-Type: application/json

Cole o JSON no Body

Clique em Send

Resposta esperada:

json
{
  "success": true,
  "event": {
    "_id": "675a8b3c1234567890abcdef",
    "capacity": 100,
    "price": 79.9,
    ...
  }
}
5. Deletar Evento (DELETE)
Campo	Valor
URL	http://localhost:3000/api/events/ID_DO_EVENTO
Método	DELETE
Como fazer:

Selecione método DELETE

Digite a URL com o ID do evento

Clique em Send

Resposta esperada:

json
{
  "success": true,
  "message": "Evento deletado com sucesso"
}
Exemplo visual no Talend API Tester
text
┌─────────────────────────────────────────────┐
│  POST   http://localhost:3000/api/events    │
├─────────────────────────────────────────────┤
│  Headers                                    │
│  ┌─────────────────────────────────────┐    │
│  │ Content-Type │ application/json     │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  Body (JSON)                                │
│  ┌─────────────────────────────────────┐    │
│  │ {                                   │    │
│  │   "title": "Workshop Node.js",      │    │
│  │   "description": "Aprenda Node.js", │    │
│  │   "date": "2025-02-15T14:00:00Z",   │    │
│  │   "location": "São Paulo",          │    │    
│  │   "capacity": 50                    │    │
│  │ }                                   │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│           [ SEND ]                          │
├─────────────────────────────────────────────┤
│  RESPOSTA                                   │
│  ┌─────────────────────────────────────┐    │
│  │ Status: 201 Created                 │    │
│  │ {                                   │    │
│  │   "success": true,                  │    │
│  │   "event": {...}                    │    │
│  │ }                                   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
Testes rápidos com curl (terminal)
bash
# Criar evento
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu Evento","description":"Descrição","date":"2025-12-31T20:00:00Z","location":"Online","category":"Webinar","capacity":100}'

# Listar eventos
curl http://localhost:3000/api/events

# Buscar evento por ID
curl http://localhost:3000/api/events/ID_DO_EVENTO

# Atualizar evento
curl -X PUT http://localhost:3000/api/events/ID_DO_EVENTO \
  -H "Content-Type: application/json" \
  -d '{"capacity":200}'

# Deletar evento
curl -X DELETE http://localhost:3000/api/events/ID_DO_EVENTO
Observações importantes
O servidor precisa estar rodando antes de testar (npm start)

O ID do evento é gerado automaticamente pelo MongoDB

Guarde o ID retornado na criação para usar nas requisições GET, PUT e DELETE

A data deve estar no formato ISO: 2025-02-15T14:00:00Z

As categorias disponíveis são: Conferência, Workshop, Meetup, Webinar, Palestra, Outro

Os status disponíveis são: active, cancelled, completed

Estrutura do Projeto

Projeto-Api-Rest/
├── src/
│   ├── config/
│   │   └── db.js     
│   ├── models/
│   │   └── Event.js         
│   ├── controllers/
│   │   └── EventController.js
│   └── routes/
│       └── EventRoutes.js    
├── .env         
├── .gitignore                
├── package.json              
├── server.js                 
└── README.md                 

Tecnologias Utilizadas
Node.js
Express
MongoDB
Mongoose
Dotenv

Autor
William dos Santos Hennemann - WilliamSHennemann
