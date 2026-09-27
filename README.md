# Miss Clean

Лендинг сервиса уборки в Валенсии.

## Запуск локально

```bash
npm install
cp .env.example .env.local
# заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Контакты и цены

Меняются в одном месте: [`src/config/site.ts`](src/config/site.ts).

## Деплой на Vercel

1. Создайте репозиторий GitHub и запушьте этот проект
2. [vercel.com/new](https://vercel.com/new) → Import репозитория
3. Environment Variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
4. Deploy

Подробнее: [`documentation.md`](documentation.md).
