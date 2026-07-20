# Playwright Fullstack Testing Demo

Демо-магазин для навчання **автоматизації тестування**: живий fullstack-додаток (MERN) + приклади тестів — **E2E**, **API** і **manual (cyborg)**.

Форк оригінального [mern-ecommerce](https://github.com/mohamedsamara/mern-ecommerce) від Mohamed Samara, адаптований під практику QA / SDET.

## Demo

| Що | URL |
|----|-----|
| Магазин (UI) | [https://shopdemo-alex-hot.koyeb.app](https://shopdemo-alex-hot.koyeb.app) |
| Swagger UI | [https://shopdemo-alex-hot.koyeb.app/api-docs](https://shopdemo-alex-hot.koyeb.app/api-docs) |
| OpenAPI JSON | [https://shopdemo-alex-hot.koyeb.app/api-docs.json](https://shopdemo-alex-hot.koyeb.app/api-docs.json) |

Локально після `npm run dev` / `npm start`:

- UI: `http://localhost:3000` (prod) або client на `http://localhost:8080` (dev)
- Docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) · [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

## Що є в репо

```
├── client/          # React storefront + admin
├── server/          # Express API + MongoDB (Mongoose)
│   └── docs/        # OpenAPI 3.0 spec → /api-docs, /api-docs.json
└── test/            # Playwright: e2e / api / cyborg (manual)
```

Ролі в додатку:

1. **Buyer** — каталог, кошик, замовлення, відгуки
2. **Merchant** — свій бренд / товари
3. **Admin** — повне керування магазином

## Тести (`test/`)

Playwright-проєкти:

| Проєкт | Файли | Призначення |
|--------|--------|-------------|
| `e2e` | `*.e2e.ts` | UI end-to-end (покупка, admin, contact us) |
| `api` | `*.api.ts` | HTTP API (наприклад реєстрація) |
| `cyborg` | `*.cyborg.ts` | Напівручні / manual steps (`@cyborgtests/test`) |

Запуск (з каталогу `test/`):

```bash
cd test
npm ci
npx playwright install chromium   # один раз

# потрібен .env з DB_CONNECTION_URI (див. test/env)
npm test                 # api + e2e
npm run test:api
npm run test:e2e
npm run test:cyborg      # manual / cyborg
```

За замовчуванням тести б’ють у задеплоєний демо-сайт (`FRONTEND_URL` / `API_URL` у `test/env`). Деталі — у [`test/README.md`](test/README.md).

CI: [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) (шардований Playwright на push/PR).

## Швидкий старт додатку

Потрібні **Node 16** (див. `.nvmrc`) і **MongoDB**.

```bash
git clone https://github.com/Xotabu4/pw-fullstack-testing-demo.git
cd pw-fullstack-testing-demo
cp .env.example .env
# заповніть мінімум: MONGO_URI, JWT_SECRET, PORT, BASE_*_URL
npm install
npm run dev
```

Мінімальний `.env` (орієнтир — [`.env.example`](.env.example)):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce
JWT_SECRET=change-me
BASE_SERVER_URL=http://localhost:3000
BASE_API_URL=api
BASE_CLIENT_URL=http://localhost:8080
```

Опційно: Mailchimp, Mailgun, Google/Facebook OAuth. AWS S3 у цьому форку не обов’язковий (завантаження зображень може бути замокане / обмежене).

Створити admin-користувача:

```bash
npm run seed:db -- your@email.com your-password
```

Продакшен-збірка:

```bash
npm run build
npm start
```

## Стек

- **Backend:** Node, Express, Mongoose, Passport JWT
- **Frontend:** React, Redux, Webpack
- **Tests:** Playwright, Page Object / fixtures у `test/`
- **API docs:** OpenAPI 3 + `swagger-ui-express`

## Ліцензія / credits

MIT. Базовий ecommerce — © [Mohamed Samara](https://github.com/mohamedsamara/mern-ecommerce). Тестовий шар і демо-адаптація — для навчання автоматизації.
