function flipCoin() {
    const coin = document.getElementById('coin');
    coin.classList.add('animate');
    
    // Случайный выбор результата
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    setTimeout(() => {
        if (result === 'heads') {
            coin.style.background = 'radial-gradient(circle, #f7c948 0%, #e0b32e 70%, #f7c948 100%)';
            coin.innerHTML = '🦅'; // Орёл
        } else {
            coin.style.background = 'radial-gradient(circle, #f7c948 0%, #e0b32e 70%, #f7c948 100%)';
            coin.innerHTML = '₽'; // Решка
        }
        coin.classList.remove('animate');
    }, 2000);
}

// Telegram Web App расширения
if (window.Telegram) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}