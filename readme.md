# Crypto Hub — CoinGecko style

Полностью независимый крипто-хаб на чистом HTML/CSS/JS с CoinGecko API и TradingView. Готов к деплою на GitHub Pages.

## Фичи
- Реальный CoinGecko API: рынки, детали монет, спарклайны, проценты 24h/7d.
- TradingView виджет в модальном окне.
- Поиск, сортировка, пагинация, избранное.
- Тема (dark/light) и локализация (ru/en/ro).
- Локальный кэш (TTL), fallback при ошибках API.
- Роутинг по hash: `#/`, `#/favorites`, `#/coin/:id`.

## Деплой
1. Создайте репозиторий на GitHub и добавьте файлы из `crypto-hub`.
2. Включите GitHub Pages: Settings → Pages → Source: `main` → Root.
3. Откройте опубликованный URL — сайт готов.

## Настройки
- localStorage:
  - `currency`: usd/eur/rub/ron
  - `theme`: dark/light
  - `lang`: ru/en/ro
  - `favorites`: массив id монет

## Расширение
- Добавьте страницы: “Рынки”, “Сектора”, “Новости”.
- Подключите дополнительные источники (биржевые тикеры, RSS).
- Вынесите конфиг (env) для кастомизации.
