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

document.addEventListener('DOMContentLoaded', () => {
    // Telegram проверка
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
    const coin = document.getElementById('coin');
    const signalButton = document.getElementById('signalButton');
    const eagleCard = document.getElementById('eagleCard');
    const tailCard = document.getElementById('tailCard');
    const menuButton = document.getElementById('menuButton');
    const errorMessage = document.getElementById('errorMessage');
    const modal = document.getElementById('inputModal');
    const modalInput = document.getElementById('modalUserInput');
    const modalSubmit = document.getElementById('modalSubmit');
    const modalError = document.getElementById('modalError');
    const chargeCountEl = document.getElementById('chargeCount');
    const timerEl = document.getElementById('timer');

    let isFlipping = false;
    let userText = '';
    let hasFlipped = false;

    // Настройки зарядов
    const MAX_CHARGES = 5;
    const CHARGE_REFRESH_TIME = 30 * 60 * 1000;
    const storageKey = `charges_${user.id}_coin`;

    let chargesData = JSON.parse(localStorage.getItem(storageKey)) || {
        count: MAX_CHARGES,
        lastRefresh: Date.now()
    };

    // Показать модальное окно
    modal.classList.add('active');
    signalButton.classList.add('disabled');

    // Функции зарядов
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
        if (chargesData.count > 0 && userText && !hasFlipped) {
            signalButton.classList.remove('disabled');
            signalButton.disabled = false;
        } else {
            signalButton.classList.add('disabled');
            signalButton.disabled = true;
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

    // Проверка ввода
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

    function resetCards() {
        eagleCard.classList.remove('winner', 'loser');
        tailCard.classList.remove('winner', 'loser');
        coin.style.animation = 'none';
        void coin.offsetWidth;
    }

    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            updateButtonState();
            if (hasFlipped) hasFlipped = false;
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    signalButton.addEventListener('click', () => {
        if (isFlipping || signalButton.classList.contains('disabled')) return;

        if (hasFlipped) {
            modalInput.value = '';
            modal.classList.add('active');
            return;
        }

        if (chargesData.count <= 0) return;

        isFlipping = true;
        signalButton.classList.add('loading');
        resetCards();

        chargesData.count--;
        localStorage.setItem(storageKey, JSON.stringify(chargesData));
        updateCharges();

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.style.animation = result === 'heads' ?
            'coinSpinHeads 3s ease-in-out forwards' :
            'coinSpinTails 3s ease-in-out forwards';

        setTimeout(() => {
            signalButton.classList.remove('loading');
            if (result === 'heads') {
                eagleCard.classList.add('winner');
                tailCard.classList.add('loser');
            } else {
                tailCard.classList.add('winner');
                eagleCard.classList.add('loser');
            }
            isFlipping = false;
            hasFlipped = true;
            userText = '';
            updateButtonState();
        }, 3000);
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

    createStars();
    updateCharges();
    setInterval(updateTimer, 1000);

    Telegram.WebApp.expand();
});