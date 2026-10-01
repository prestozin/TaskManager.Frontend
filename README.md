# TaskManager Frontend

Frontend da aplicação TaskManager, desenvolvido em Angular com componentes standalone, Signals, Facades e gerenciamento de estado por feature.

## Stack

- Angular 22
- TypeScript 6
- SCSS
- RxJS
- Ng-Zorro Ant Design
- Vitest
- npm

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de tarefas
- Criação, edição, visualização e exclusão de tarefas
- Filtros por texto, status, prioridade e período
- Paginação e ordenação
- Seleção múltipla de tarefas
- Relatórios
- Perfil do usuário
- Configurações
- Layout responsivo
- Route guard para páginas autenticadas
- Interceptor para autenticação e loading global

## Arquitetura

O projeto utiliza componentes standalone e separa responsabilidades entre componentes, Facades e State.

```text
src/
├── app/
│   ├── core/
│   ├── layouts/
│   ├── features/
│   │   ├── auth/
│   │   ├── home-page/
│   │   ├── profile/
│   │   ├── report/
│   │   ├── settings/
│   │   └── tasks/
│   └── shared/
├── environments/
└── styles/
```

## Requisitos

- Node.js
- npm 11+
- Angular CLI 22

Instale as dependências:

```bash
npm install
```

## Configuração

As URLs da API são definidas nos arquivos:

```text
src/environments/environment.development.ts
src/environments/environment.production.ts
```

Ambiente local:

```text
http://localhost:7102/api
```

Ambiente de produção:

```text
https://taskmanager-api-a1v2.onrender.com/api
```

## Execução

### Desenvolvimento local

```bash
npm run start:local
```

Aplicação:

```text
http://localhost:4200
```

### Conectando à API remota

```bash
npm run start:remote
```

### Build de produção

```bash
npm run build
```

Os arquivos gerados ficam no diretório `dist/`.

## Testes

```bash
npm test
```

O projeto utiliza Vitest através do Angular CLI.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run start:local` | Servidor local com API local |
| `npm run start:remote` | Servidor local utilizando a API remota |
| `npm run start:prod` | Servidor utilizando a configuração de produção |
| `npm run build` | Build de produção |
| `npm run watch` | Build em modo watch |
| `npm test` | Testes unitários |

## Autenticação

O login é realizado através da API. Após a autenticação, o token JWT é armazenado pelo frontend e utilizado pelo interceptor nas requisições protegidas.

O acesso às páginas autenticadas é controlado pelo route guard.

## API

API de produção:

```text
https://taskmanager-api-a1v2.onrender.com
```

Health check:

```text
GET /health
```

## Desenvolvimento

Para adicionar uma nova funcionalidade:

1. Criar ou alterar a feature correspondente.
2. Criar os componentes necessários.
3. Definir modelos e enums quando necessário.
4. Adicionar operações ao State e Facade quando houver estado compartilhado ou chamadas à API.
5. Adicionar a rota quando a funcionalidade possuir uma nova página.
6. Implementar os testes.
7. Validar o comportamento em desktop e mobile.

## Licença

Projeto desenvolvido para fins de estudo e portfólio.
