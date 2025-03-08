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
    const menuButton = document.getElementById('menuButton');
    const errorMessage = document.getElementById('errorMessage');
    const modal = document.getElementById('inputModal');
    const modalInput = document.getElementById('modalUserInput');
    const modalSubmit = document.getElementById('modalSubmit');
    const modalError = document.getElementById('modalError');
    let trapCount = 1; // Число ловушек, выбираемых стрелочками
    const allowedTraps = [1, 3, 5, 7];
    let isLoading = false;
    let userText = '';
    let hasPlayed = false;

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

    // Обработка подтверждения в модальном окне
    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            mineButton.classList.remove('disabled');
            if (hasPlayed) {
                hasPlayed = false; // Сбрасываем флаг после повторного ввода
            }
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    mineButton.addEventListener('click', () => {
        if (isLoading || mineButton.classList.contains('disabled')) return;

        // Если игра уже была сыграна, показываем модальное окно
        if (hasPlayed) {
            modalInput.value = '';
            modal.classList.add('active');
            mineButton.classList.add('disabled');
            return;
        }

        isLoading = true;
        mineButton.classList.add('loading');
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }

        const starCount = getStarCount(trapCount);
        const trapIndices = new Set();
        while (trapIndices.size < starCount) {
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
                    mineButton.classList.remove('loading');
                    isLoading = false;
                    hasPlayed = true;
                    userText = ''; // Очищаем текст после игры
                }
            }, delay);
            delay += 300;
        });

        createStars(6); // Обновляем фоновые звезды
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'https://devastcheats.github.io/3k-fp-lot-roulette-casino/';
    });

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