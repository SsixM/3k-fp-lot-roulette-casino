// Создание падающих звёзд
function createStars() {
    const starsContainer = document.querySelector('.stars');

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = `${Math.random() * 4 + 2}px`; // Высота варьируется
        star.style.background = 'linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))'; // Хвост
        star.style.boxShadow = '0 0 5px #fff'; // Свечение
        star.style.borderRadius = '50%';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1; // Начинаем выше экрана
        const duration = Math.random() * 3 + 2;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.animation = `fall ${duration}s linear infinite`;

        starsContainer.appendChild(star);
    }
}

// Добавление стилей анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100vh);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Переход на страницу игры по клику
document.getElementById('menuCard').addEventListener('click', () => {
    window.location.href = 'mines/mines.html';
});
document.getElementById('menuMoney').addEventListener('click', () => {
    window.location.href = 'Coin/Coin.html';
});

window.addEventListener('load', createStars);