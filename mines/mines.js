function createStars(count) {
    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = '';
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
    // Элементы DOM
    const grid = document.getElementById('grid');
    const trapCountElement = document.getElementById('trapCount');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const mineButton = document.getElementById('mineButton');
    const menuButton = document.getElementById('menuButton');
    const modal = document.getElementById('inputModal');
    const modalInput = document.getElementById('modalUserInput');
    const modalSubmit = document.getElementById('modalSubmit');
    const modalError = document.getElementById('modalError');
    const chargeCountEl = document.getElementById('chargeCount');
    const timerEl = document.getElementById('timer');

    let trapCount = 1;
    const allowedTraps = [1, 3, 5, 7];
    let isLoading = false;
    let userText = '';
    let hasPlayed = false;

    // Telegram проверка и инициализация
    let userId = 'test_user'; // Fallback для теста вне Telegram
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.ready();
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
            userId = user.id;
        } else {
            console.warn('Telegram user not found, using test mode');
        }
        Telegram.WebApp.expand();
    } else {
        console.warn('Not running in Telegram, using test mode');
    }

    // Настройки зарядов
    const MAX_CHARGES = 5;
    const CHARGE_REFRESH_TIME = 30 * 60 * 1000; // 30 минут
    const storageKey = `charges_${userId}_mines`;
    let chargesData = JSON.parse(localStorage.getItem(storageKey)) || {
        count: MAX_CHARGES,
        lastRefresh: Date.now()
    };

    modal.classList.add('active');
    mineButton.classList.add('disabled');

    function updateGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const button = document.createElement('button');
            button.className = 'grid-button';
            grid.appendChild(button);
        }
    }

    function updateCharges() {
        const now = Date.now();
        if (now - chargesData.lastRefresh >= CHARGE_REFRESH_TIME) {
            chargesData.count = MAX_CHARGES;
            chargesData.lastRefresh = now;
            localStorage.setItem(storageKey, JSON.stringify(chargesData));
        }
        chargeCountEl.textContent = chargesData.count;
        updateButtonState();
    }

    function updateButtonState() {
        mineButton.disabled = !(chargesData.count > 0 && userText && !hasPlayed);
        mineButton.classList.toggle('disabled', mineButton.disabled);
    }

    function updateTimer(timestamp) {
        const now = Date.now();
        const timeLeft = CHARGE_REFRESH_TIME - (now - chargesData.lastRefresh);
        if (timeLeft <= 0) {
            updateCharges();
            timerEl.textContent = 'Обновление: 30:00';
        } else {
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            timerEl.textContent = `Обновление: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        requestAnimationFrame(updateTimer);
    }

    function checkModalInput() {
        const inputValue = modalInput.value.trim();
        if (!inputValue || inputValue.length < 6 || /[а-яА-ЯёЁ]/.test(inputValue) || !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*(\?[\w=&-]*)?\/?$/.test(inputValue)) {
            modalError.textContent = inputValue ?
                (inputValue.length < 6 ? 'Минимум 6 символов!' :
                    /[а-яА-ЯёЁ]/.test(inputValue) ? 'Без русских символов!' : 'Некорректная ссылка!') :
                'Введите ссылку!';
            modalError.style.display = 'block';
            return false;
        }
        modalError.style.display = 'none';
        return true;
    }

    function getStarCount(trapCount) {
        return { 1: 6, 3: 5, 5: 4, 7: 2 }[trapCount] || 0;
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

    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            hasPlayed = false;
            updateButtonState();
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    mineButton.addEventListener('click', () => {
        if (isLoading || mineButton.disabled) return;

        if (hasPlayed) {
            modalInput.value = '';
            modal.classList.add('active');
            return;
        }

        isLoading = true;
        mineButton.classList.add('loading');
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) button.classList.remove('active');

        chargesData.count--;
        localStorage.setItem(storageKey, JSON.stringify(chargesData));
        updateCharges();

        const starCount = getStarCount(trapCount);
        const trapIndices = new Set();
        while (trapIndices.size < starCount) {
            trapIndices.add(Math.floor(Math.random() * buttons.length));
        }

        let delay = 0;
        Array.from(trapIndices).forEach((index, i) => {
            setTimeout(() => {
                buttons[index].classList.add('active');
                if (i === trapIndices.size - 1) {
                    mineButton.classList.remove('loading');
                    isLoading = false;
                    hasPlayed = true;
                    userText = '';
                    updateButtonState();
                }
            }, delay);
            delay += 500;
        });

        createStars(6);
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', e => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', e => e.touches.length > 1 && e.preventDefault(), { passive: false });

    createStars(6);
    updateGrid();
    updateCharges();
    requestAnimationFrame(updateTimer);
});