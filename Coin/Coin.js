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
    // Элементы DOM
    const coin = document.getElementById('coin');
    const signalButton = document.getElementById('signalButton');
    const eagleCard = document.getElementById('eagleCard');
    const tailCard = document.getElementById('tailCard');
    const menuButton = document.getElementById('menuButton');
    const modal = document.getElementById('inputModal');
    const modalInput = document.getElementById('modalUserInput');
    const modalSubmit = document.getElementById('modalSubmit');
    const modalError = document.getElementById('modalError');
    const chargeCountEl = document.getElementById('chargeCount');
    const timerEl = document.getElementById('timer');

    let isFlipping = false;
    let userText = '';
    let hasFlipped = false;

    // Telegram проверка и инициализация
    let userId = 'test_user'; // Фallback для теста вне Telegram
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
    const storageKey = `charges_${userId}_coin`;
    let chargesData = JSON.parse(localStorage.getItem(storageKey)) || {
        count: MAX_CHARGES,
        lastRefresh: Date.now()
    };

    modal.classList.add('active');
    signalButton.classList.add('disabled');

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
        signalButton.disabled = !(chargesData.count > 0 && userText && !hasFlipped);
        signalButton.classList.toggle('disabled', signalButton.disabled);
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
            hasFlipped = false;
            updateButtonState();
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    signalButton.addEventListener('click', () => {
        if (isFlipping || signalButton.disabled) return;

        if (hasFlipped) {
            modalInput.value = '';
            modal.classList.add('active');
            return;
        }

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
    document.addEventListener('touchmove', e => e.touches.length > 1 && e.preventDefault(), { passive: false });

    createStars();
    updateCharges();
    requestAnimationFrame(updateTimer);
});