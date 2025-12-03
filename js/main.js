
        // Данные криптовалют
        const cryptoData = [
            { id: 1, name: "Bitcoin", symbol: "BTC", price: 45123.67, change24h: 2.45, volume: 28563456789, marketCap: 876543210987, color: "#F7931A" },
            { id: 2, name: "Ethereum", symbol: "ETH", price: 2389.45, change24h: 1.23, volume: 15678943210, marketCap: 287654321098, color: "#627EEA" },
            { id: 3, name: "Binance Coin", symbol: "BNB", price: 312.56, change24h: -0.45, volume: 8765432109, marketCap: 48765432109, color: "#F3BA2F" },
            { id: 4, name: "Ripple", symbol: "XRP", price: 0.6234, change24h: 3.21, volume: 2345678901, marketCap: 33765432109, color: "#23292F" },
            { id: 5, name: "Cardano", symbol: "ADA", price: 0.4567, change24h: -1.23, volume: 1234567890, marketCap: 15987654321, color: "#0033AD" },
            { id: 6, name: "Solana", symbol: "SOL", price: 98.76, change24h: 5.67, volume: 3456789012, marketCap: 38765432109, color: "#00FFA3" },
            { id: 7, name: "Polkadot", symbol: "DOT", price: 6.78, change24h: -2.34, volume: 987654321, marketCap: 8765432109, color: "#E6007A" },
            { id: 8, name: "Dogecoin", symbol: "DOGE", price: 0.0789, change24h: 7.89, volume: 1234567890, marketCap: 10987654321, color: "#C2A633" },
            { id: 9, name: "Shiba Inu", symbol: "SHIB", price: 0.00000987, change24h: -3.21, volume: 456789012, marketCap: 5876543210, color: "#FF3B30" },
            { id: 10, name: "Polygon", symbol: "MATIC", price: 0.8765, change24h: 1.45, volume: 765432109, marketCap: 7654321098, color: "#8247E5" }
        ];

        // Функция для форматирования чисел
        function formatNumber(num) {
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(2) + 'B';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(2) + 'K';
            }
            return num.toFixed(2);
        }

        // Функция для форматирования цены
        function formatPrice(price) {
            if (price < 0.01) {
                return '$' + price.toFixed(8);
            }
            if (price < 1) {
                return '$' + price.toFixed(4);
            }
            return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Заполнение таблицы криптовалют
        function populateCryptoTable() {
            const tableBody = document.getElementById('crypto-table-body');
            tableBody.innerHTML = '';
            
            cryptoData.forEach(crypto => {
                const row = document.createElement('tr');
                
                // Определяем класс для изменения цены
                const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
                const changeSign = crypto.change24h >= 0 ? '+' : '';
                
                row.innerHTML = `
                    <td>${crypto.id}</td>
                    <td>
                        <div class="crypto-info">
                            <div class="crypto-icon" style="background-color: ${crypto.color}">${crypto.symbol.charAt(0)}</div>
                            <div>
                                <span class="crypto-name">${crypto.name}</span>
                                <span class="crypto-symbol">${crypto.symbol}</span>
                            </div>
                        </div>
                    </td>
                    <td>${formatPrice(crypto.price)}</td>
                    <td><span class="price-change ${changeClass}">${changeSign}${crypto.change24h.toFixed(2)}%</span></td>
                    <td>${formatNumber(crypto.volume)}</td>
                    <td>${formatNumber(crypto.marketCap)}</td>
                    <td>
                        <div style="height: 30px; width: 100px; background-color: rgba(255,255,255,0.1); border-radius: 3px;"></div>
                    </td>
                    <td>
                        <button class="watchlist-btn">★</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            populateCryptoTable();
            
            // Добавляем обработчики для кнопок списка наблюдения
            document.querySelectorAll('.watchlist-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.textContent = this.classList.contains('active') ? '★' : '☆';
                });
            });
            
            // Добавляем обработчики для фильтров
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Добавляем обработчики для опций графика
            document.querySelectorAll('.chart-option').forEach(option => {
                option.addEventListener('click', function() {
                    this.parentElement.querySelectorAll('.chart-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Добавляем обработчик для переключения темы
            document.querySelector('.theme-toggle').addEventListener('click', function() {
                document.body.classList.toggle('light-theme');
                this.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
            });
        });
    