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

document.addEventListener('DOMContentLoaded', () => {
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
    let isFlipping = false;
    let userText = '';
    let hasFlipped = false;

    // Показать модальное окно при загрузке
    modal.classList.add('active');
    signalButton.classList.add('disabled');

    // Проверка ввода в модальном окне
    function checkModalInput() {
        const inputValue = modalInput.value.trim();

        // Проверка на пустой ввод
        if (!inputValue) {
            modalError.textContent = 'Введите ссылку для продолжения!';
            modalError.style.display = 'block';
            return false;
        }

        // Проверка на минимальную длину (менее 6 символов)
        if (inputValue.length < 6) {
            modalError.textContent = 'Ссылка должна содержать минимум 6 символов!';
            modalError.style.display = 'block';
            return false;
        }

        // Проверка на русские символы (кириллицу)
        const cyrillicPattern = /[а-яА-ЯёЁ]/;
        if (cyrillicPattern.test(inputValue)) {
            modalError.textContent = 'Ссылка не должна содержать русские символы!';
            modalError.style.display = 'block';
            return false;
        }

        // Проверка, является ли ввод валидной ссылкой
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(inputValue)) {
            modalError.textContent = 'Введите корректную ссылку!';
            modalError.style.display = 'block';
            return false;
        }

        modalError.style.display = 'none';
        return true;
    }

    // Сброс состояния карт и анимации
    function resetCards() {
        eagleCard.classList.remove('winner', 'loser');
        tailCard.classList.remove('winner', 'loser');
        coin.style.animation = 'none';
        void coin.offsetWidth;
    }

    // Обработка подтверждения в модальном окне
    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            signalButton.classList.remove('disabled');
            if (hasFlipped) {
                hasFlipped = false; // Сбрасываем флаг после повторного ввода
            }
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    signalButton.addEventListener('click', () => {
        if (isFlipping || signalButton.classList.contains('disabled')) return;

        // Если монетка уже была подкинута, показываем модальное окно
        if (hasFlipped) {
            modalInput.value = '';
            modal.classList.add('active');
            signalButton.classList.add('disabled');
            return;
        }

        isFlipping = true;
        signalButton.classList.add('loading');
        resetCards();

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        if (result === 'heads') {
            coin.style.animation = 'coinSpinHeads 3s ease-in-out forwards';
        } else {
            coin.style.animation = 'coinSpinTails 3s ease-in-out forwards';
        }

        setTimeout(() => {
            signalButton.classList.remove('loading');
            if (result === 'heads') {
                eagleCard.classList.add('winner');
                tailCard.classList.add('loser');
                console.log('Result: heads (Орёл), Coin Face: coineagle.png');
            } else {
                tailCard.classList.add('winner');
                eagleCard.classList.add('loser');
                console.log('Result: tails (Решка), Coin Face: cointail.png');
            }
            isFlipping = false;
            hasFlipped = true;
            userText = ''; // Очищаем текст после броска
        }, 3000);
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'https://devastcheats.github.io/3k-fp-lot-roulette-casino/';
    });

    // Предотвращение масштабирования
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    createStars();

    // Telegram Web App initialization
    if (window.Telegram) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        console.log(Telegram.WebApp.viewportHeight);
        console.log(window.innerWidth);
    }
});

// Watermark
const watermarkImg = new Image();
watermarkImg.src = 'watermark.png';
watermarkImg.onload = () => {
    document.body.style.backgroundImage = `url('watermark.png')`;
};
watermarkImg.onerror = () => {
    console.log('Watermark image not found, skipping watermark.');
};