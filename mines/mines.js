function createStars(count) {
    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = ''; // Очищаем предыдущие фоновые звезды
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '4px';
        star.style.height = `${Math.random() * 6 + 4}px`;
        star.style.background = 'linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))';
        star.style.boxShadow = '0 0 8px #fff';
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

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const trapCountElement = document.getElementById('trapCount');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const mineButton = document.getElementById('mineButton');
    const userInput = document.getElementById('userInput');
    const menuButton = document.getElementById('menuButton');
    const errorMessage = document.getElementById('errorMessage');
    let trapCount = 1; // Число ловушек, выбираемых стрелочками
    const allowedTraps = [1, 3, 5, 7];

    function updateGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const button = document.createElement('button');
            button.className = 'grid-button';
            grid.appendChild(button);
        }
    }

    function checkInput() {
        const inputValue = userInput.value.trim();
        if (!inputValue) {
            mineButton.classList.add('disabled');
            errorMessage.textContent = 'Введите текст для продолжения!';
            errorMessage.style.display = 'block';
            return false;
        } else {
            mineButton.classList.remove('disabled');
            errorMessage.style.display = 'none';
            return true;
        }
    }

    // Функция для получения количества звезд в полях в зависимости от trapCount
    function getStarCount(trapCount) {
        switch (trapCount) {
            case 1: return 6; // 1 ловушка → 6 звезд
            case 3: return 5; // 3 ловушки → 5 звезд
            case 5: return 4; // 5 ловушек → 4 звезды
            case 7: return 2; // 7 ловушек → 2 звезды
            default: return 0;
        }
    }

    decreaseButton.addEventListener('click', () => {
        const currentIndex = allowedTraps.indexOf(trapCount);
        if (currentIndex > 0) {
            trapCount = allowedTraps[currentIndex - 1];
            trapCountElement.textContent = trapCount;
        }
    });

    increaseButton.addEventListener('click', () => {
        const currentIndex = allowedTraps.indexOf(trapCount);
        if (currentIndex < allowedTraps.length - 1) {
            trapCount = allowedTraps[currentIndex + 1];
            trapCountElement.textContent = trapCount;
        }
    });

    mineButton.addEventListener('click', () => {
        if (mineButton.classList.contains('loading') || mineButton.classList.contains('disabled')) return;

        if (!checkInput()) return;

        mineButton.classList.add('loading');
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }

        const starCount = getStarCount(trapCount); // Получаем нужное количество звезд
        const trapIndices = new Set();
        while (trapIndices.size < starCount) { // Используем starCount вместо trapCount
            const randomIndex = Math.floor(Math.random() * buttons.length);
            trapIndices.add(randomIndex);
        }

        // Последовательное появление звезд в полях
        let delay = 0;
        const trapArray = Array.from(trapIndices);
        trapArray.forEach((index, i) => {
            setTimeout(() => {
                buttons[index].classList.add('active');
                if (i === trapArray.length - 1) {
                    mineButton.classList.remove('loading'); // Убираем loading после последней звезды
                }
            }, delay);
            delay += 300; // Задержка 300 мс между звездами
        });

        // Обновляем фоновые звезды (оставляем как было, если не нужно менять)
        createStars(6); // Можно оставить фиксированное число фоновых звезд, например, 6
    });

    userInput.addEventListener('input', () => {
        checkInput();
        localStorage.setItem('userInputValue', userInput.value);
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'file:///C:/Users/slava/OneDrive/Документы/GitHub/DevLegacy/3k-fp-lot-roulette-casino/menu.html';
    });

    const savedValue = localStorage.getItem('userInputValue');
    if (savedValue) {
        userInput.value = savedValue;
        checkInput();
    } else {
        checkInput();
    }

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

    createStars(6); // Изначально создаем 6 фоновых звезд
    updateGrid();
});