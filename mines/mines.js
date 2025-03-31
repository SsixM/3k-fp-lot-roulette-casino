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
    // Проверка Telegram WebApp
    if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
        document.body.innerHTML = '<h1>Доступ возможен только через Telegram</h1>';
        return;
    }

    Telegram.WebApp.ready();
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (!user) {
        document.body.innerHTML = '<h1>Ошибка аутентификации Telegram</h1>';
        Telegram.WebApp.close();
        return;
    }

    // Элементы DOM
    const grid = document.getElementById('grid');
    const trapCountElement = document.getElementById('trapCount');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    县委Button = document.getElementById('mineButton');
    const menuButton = document.getElementById('menuButton');
    const errorMessage = document.getElementById('errorMessage');
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

    // Настройки зарядов
    const MAX_CHARGES = 5;
    const CHARGE_REFRESH_TIME = 30 * 60 * 1000; // 30 минут
    const storageKey = `charges_${user.id}_mines`;
    let chargesData = JSON.parse(localStorage.getItem(storageKey)) || {
        count: MAX_CHARGES,
        lastRefresh: Date.now()
    };

    // Показать модальное окно при загрузке
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

    // Обновление зарядов
    function updateCharges() {
        const now = Date.now();
        const timeSinceLastRefresh = now - chargesData.lastRefresh;
        if (timeSinceLastRefresh >= CHARGE_REFRESH_TIME) {
            chargesData.count = MAX_CHARGES;
            chargesData.lastRefresh = now;
        }
        localStorage.setItem(storageKey, JSON.stringify(chargesData));
        chargeCountEl.textContent = chargesData.count;
        updateButtonState();
    }

    function updateButtonState() {
        if (chargesData.count > 0 && userText && !hasPlayed) {
            mineButton.classList.remove('disabled');
            mineButton.disabled = false;
        } else {
            mineButton.classList.add('disabled');
            mineButton.disabled = true;
        }
    }

    function updateTimer() {
        const now = Date.now();
        const timeLeft = CHARGE_REFRESH_TIME - (now - chargesData.lastRefresh);
        if (timeLeft <= 0) {
            updateCharges();
            return;
        }
        const minutes = Math.floor(timeLeft / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        timerEl.textContent = `Обновление: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Проверка ввода в модальном окне
    function checkModalInput() {
        const inputValue = modalInput.value.trim();
        if (!inputValue) {
            modalError.textContent = 'Введите ссылку для продолжения!';
            modalError.style.display = 'block';
            return false;
        }
        if (inputValue.length < 6) {
            modalError.textContent = 'Ссылка должна содержать минимум 6 символов!';
            modalError.style.display = 'block';
            return false;
        }
        const cyrillicPattern = /[а-яА-ЯёЁ]/;
        if (cyrillicPattern.test(inputValue)) {
            modalError.textContent = 'Ссылка не должна содержать русские символы!';
            modalError.style.display = 'block';
            return false;
        }
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*(\?[\w=&-]*)?\/?$/;
        if (!urlPattern.test(inputValue)) {
            modalError.textContent = 'Введите корректную ссылку!';
            modalError.style.display = 'block';
            return false;
        }
        modalError.style.display = 'none';
        return true;
    }

    function getStarCount(trapCount) {
        switch (trapCount) {
            case 1: return 6;
            case 3: return 5;
            case 5: return 4;
            case 7: return 2;
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

    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            updateButtonState();
            if (hasPlayed) hasPlayed = false;
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    mineButton.addEventListener('click', () => {
        if (isLoading || mineButton.classList.contains('disabled')) return;

        if (hasPlayed) {
            modalInput.value = '';
            modal.classList.add('active');
            mineButton.classList.add('disabled');
            return;
        }

        if (chargesData.count <= 0) return;

        isLoading = true;
        mineButton.classList.add('loading');
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }

        chargesData.count--;
        localStorage.setItem(storageKey, JSON.stringify(chargesData));
        updateCharges();

        const starCount = getStarCount(trapCount);
        const trapIndices = new Set();
        while (trapIndices.size < starCount) {
            trapIndices.add(Math.floor(Math.random() * buttons.length));
        }

        let delay = 0;
        const trapArray = Array.from(trapIndices);
        trapArray.forEach((index, i) => {
            setTimeout(() => {
                buttons[index].classList.add('active');
                if (i === trapArray.length - 1) {
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
    document.addEventListener('touchmove', e => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    createStars(6);
    updateGrid();
    updateCharges();
    setInterval(updateTimer, 1000);

    Telegram.WebApp.expand();
});