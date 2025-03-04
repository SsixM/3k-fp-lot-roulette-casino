// Создание падающих звёзд
function createStars() {
    const starsContainer = document.querySelector('.stars');

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = '#fff';
        star.style.borderRadius = '50%';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
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
            opacity: 0.5;
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