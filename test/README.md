# Tests

Playwright-тести для [демо-магазину](https://shopdemo-alex-hot.koyeb.app).

API-документація магазину:

- Swagger UI: https://shopdemo-alex-hot.koyeb.app/api-docs
- OpenAPI JSON: https://shopdemo-alex-hot.koyeb.app/api-docs.json

## Проєкти

| npm script | Playwright project | Що перевіряє |
|------------|--------------------|--------------|
| `npm run test:e2e` | `e2e` | UI flows (`tests/e2e/*.e2e.ts`) |
| `npm run test:api` | `api` | REST API (`tests/api/*.api.ts`) |
| `npm run test:cyborg` | `cyborg` | Manual / cyborg steps (`tests/cyborg/*.cyborg.ts`) |
| `npm test` | `api` + `e2e` | Обидва автоматичні проєкти |

## Setup

```bash
cd test
npm ci
npx playwright install chromium
cp ../.env.example .env   # або створіть test/.env самостійно
```

У `test/.env` потрібні змінні з [`env/index.ts`](env/index.ts):

```env
FRONTEND_URL=https://shopdemo-alex-hot.koyeb.app
API_URL=https://shopdemo-alex-hot.koyeb.app/api
DB_CONNECTION_URI=mongodb://...
```

`FRONTEND_URL` і `API_URL` мають дефолти на демо; `DB_CONNECTION_URI` — обов’язковий.

## Структура

```
test/
├── app/           # Page objects / UI abstraction
├── api/           # API helpers / controllers
├── db/            # DB helpers
├── fixture/       # Playwright fixtures (shopTest, …)
├── tests/
│   ├── e2e/
│   ├── api/
│   └── cyborg/
└── playwright.config.ts
```
