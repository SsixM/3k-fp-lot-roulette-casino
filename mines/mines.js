// Создание падающих звёзд
function createStars() {
    const starsContainer = document.querySelector('.stars');

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = `${Math.random() * 4 + 2}px`;
        star.style.background = 'linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))';
        star.style.boxShadow = '0 0 5px #fff';
        star.style.borderRadius = '50%';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * -1;
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

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const trapCountElement = document.getElementById('trapCount');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const mineButton = document.getElementById('mineButton');
    const resetButton = document.getElementById('resetButton');
    const userInput = document.getElementById('userInput');
    const menuButton = document.getElementById('menuButton');
    let trapCount = 7;

    // Фиксированное 5x5 поле
    function updateGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const button = document.createElement('button');
            button.className = 'grid-button';
            grid.appendChild(button);
        }
    }

    decreaseButton.addEventListener('click', () => {
        if (trapCount > 1) {
            trapCount--;
            trapCountElement.textContent = trapCount;
        }
    });

    increaseButton.addEventListener('click', () => {
        if (trapCount < 15) {
            trapCount++;
            trapCountElement.textContent = trapCount;
        }
    });

    mineButton.addEventListener('click', () => {
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }
        for (let i = 0; i < trapCount; i++) {
            const randomIndex = Math.floor(Math.random() * buttons.length);
            if (!buttons[randomIndex].classList.contains('active')) {
                buttons[randomIndex].classList.add('active');
            } else {
                i--;
            }
        }
    });

    resetButton.addEventListener('click', () => {
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }
    });

    // Переход на menu.html
    menuButton.addEventListener('click', () => {
        window.location.href = 'file:///C:/Users/slava/OneDrive/Документы/GitHub/DevLegacy/3k-fp-lot-roulette-casino/menu.html';
    });

    // Сохранение значения поля ввода в localStorage
    const savedValue = localStorage.getItem('userInputValue');
    if (savedValue) {
        userInput.value = savedValue;
    }

    userInput.addEventListener('input', () => {
        localStorage.setItem('userInputValue', userInput.value);
    });

    // Блокировка масштабирования
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Инициализация
    createStars();
    updateGrid();
});