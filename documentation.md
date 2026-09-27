# Miss Clean — документация

Короткий обзор лендинга клининга в Валенсии.

## Что сделано
- Одностраничный сайт на **Next.js** (Vercel)
- Языки: **ES / EN / RU / UK** (по умолчанию испанский, автоопределение по языку устройства + ручной переключатель)
- Калькулятор: уборка **18 €/час** (мин. 2 ч) и химчистка (**выезд 40 €** + позиции)
- Форма заявки → Telegram-группа
- Каждый заход на сайт → уведомление в Telegram
- Фавикон и бренд — логотип Miss Clean
- Фото в `public/photos/`: герой, услуги, галерея работ и карточки позиций химчистки

## Калькулятор и фото
- Вкладка «по часам»: степпер +/−, формула и итог, фото `hourly.jpg`
- Вкладка химчистки: бейдж выезда, сетка карточек с фото (`sofa-*.jpg`, `armchair.jpg`, `mattress-*.jpg`, `carpet-*.jpg`)
- Hero: `hero.jpg` + лёгкий паттерн; услуги: `hourly.jpg` / `upholstery.jpg`; работы: `work-*.jpg`

## Где менять контакты и цены
Файл: [`src/config/site.ts`](src/config/site.ts)

Там:
- телефон / WhatsApp / Instagram
- ссылки на рилсы (`instagramEmbeds`)
- цены часов, выезда и позиций химчистки

## Telegram
1. Добавьте бота в группу и дайте право писать сообщения
2. Узнайте `chat_id` группы
3. В Vercel → Project → Settings → Environment Variables:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

Локально можно скопировать `.env.example` → `.env.local`.

API:
- `POST /api/track` — визит
- `POST /api/booking` — заявка

## Языки
Словари: `src/messages/{es,en,ru,uk}.json`  
Логика: `src/i18n/I18nProvider.tsx`

## Деплой
```bash
npm install
npm run build
```
Репозиторий → GitHub → Import в Vercel → добавить env → Deploy.  
Домен позже: Vercel → Domains.
