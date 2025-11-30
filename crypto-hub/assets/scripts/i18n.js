window.i18n = (() => {
  const dict = {
    ru: {
      toolbar: {
        searchPlaceholder: 'Поиск монет…',
        sort: {
          market_cap_desc: 'По капитализации ↓',
          market_cap_asc: 'По капитализации ↑',
          volume_desc: 'По объёму ↓',
          volume_asc: 'По объёму ↑',
          price_desc: 'По цене ↓',
          price_asc: 'По цене ↑',
          change_desc: '% за 24ч ↓',
          change_asc: '% за 24ч ↑',
        },
        currency: 'Валюта',
        theme: 'Тема',
        lang: 'Язык',
        favorites: 'Избранное',
      },
      grid: { coin: 'Монета', price: 'Цена', change24h: '% 24ч', mcap: 'Капитализация', volume: 'Объём', change7d: 'Изм. 7д', pair: 'Курс', chart: 'График' },
      pagination: { back: 'Назад', next: 'Вперёд', page: 'Страница' },
      modal: { close: 'Закрыть', details: 'Детали', addFav: 'В избранное', price: 'Цена', mcap: 'Капитализация', vol: 'Объём', supply: 'Оборот', sites: 'Сайты', openCG: 'Открыть на CoinGecko', openTV: 'Открыть в TradingView' },
      routes: { home: 'Главная', favorites: 'Избранное', coin: 'Монета' }
    },
    en: {
      toolbar: {
        searchPlaceholder: 'Search coins…',
        sort: {
          market_cap_desc: 'Market cap ↓',
          market_cap_asc: 'Market cap ↑',
          volume_desc: 'Volume ↓',
          volume_asc: 'Volume ↑',
          price_desc: 'Price ↓',
          price_asc: 'Price ↑',
          change_desc: '% 24h ↓',
          change_asc: '% 24h ↑',
        },
        currency: 'Currency',
        theme: 'Theme',
        lang: 'Language',
        favorites: 'Favorites',
      },
      grid: { coin: 'Coin', price: 'Price', change24h: '% 24h', mcap: 'Market cap', volume: 'Volume', change7d: '7d change', pair: 'Pair', chart: 'Chart' },
      pagination: { back: 'Back', next: 'Next', page: 'Page' },
      modal: { close: 'Close', details: 'Details', addFav: 'Add to favorites', price: 'Price', mcap: 'Market cap', vol: 'Volume', supply: 'Supply', sites: 'Sites', openCG: 'Open on CoinGecko', openTV: 'Open in TradingView' },
      routes: { home: 'Home', favorites: 'Favorites', coin: 'Coin' }
    },
    ro: {
      toolbar: {
        searchPlaceholder: 'Caută monede…',
        sort: {
          market_cap_desc: 'Capitalizare ↓',
          market_cap_asc: 'Capitalizare ↑',
          volume_desc: 'Volum ↓',
          volume_asc: 'Volum ↑',
          price_desc: 'Preț ↓',
          price_asc: 'Preț ↑',
          change_desc: '% 24h ↓',
          change_asc: '% 24h ↑',
        },
        currency: 'Valută',
        theme: 'Temă',
        lang: 'Limbă',
        favorites: 'Favorite',
      },
      grid: { coin: 'Monedă', price: 'Preț', change24h: '% 24h', mcap: 'Capitalizare', volume: 'Volum', change7d: 'Schimb 7z', pair: 'Pereche', chart: 'Grafic' },
      pagination: { back: 'Înapoi', next: 'Înainte', page: 'Pagină' },
      modal: { close: 'Închide', details: 'Detalii', addFav: 'Adaugă la favorite', price: 'Preț', mcap: 'Capitalizare', vol: 'Volum', supply: 'Aprovizionare', sites: 'Site-uri', openCG: 'Deschide pe CoinGecko', openTV: 'Deschide în TradingView' },
      routes: { home: 'Acasă', favorites: 'Favorite', coin: 'Monedă' }
    }
  };

  const get = (lang) => dict[lang] || dict.ru;
  return { get };
})();
