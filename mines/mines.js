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
    const grid = document.getElementById('grid');
    const startButton = document.getElementById('startButton');
    const menuButton = document.getElementById('menuButton');
    const errorMessage = document.getElementById('errorMessage');
    const modal = document.getElementById('inputModal');
    const modalInput = document.getElementById('modalUserInput');
    const modalSubmit = document.getElementById('modalSubmit');
    const modalError = document.getElementById('modalError');
    const chargeCountElement = document.getElementById('chargeCount');
    const cooldownTimerElement = document.getElementById('cooldownTimer');
    let gameActive = false;
    let userText = '';
    let hasPlayed = false;
    let charges = 5;
    const maxCharges = 5;
    const resetInterval = 30 * 60 * 1000; // 30 минут
    const gridSize = 25;
    const mineCount = 5;
    let mines = [];

    function loadCharges() {
        const saved = localStorage.getItem('minesCharges');
        const lastReset = localStorage.getItem('minesLastReset');
        const now = Date.now();
        if (saved && lastReset) {
            const timeElapsed = now - parseInt(lastReset);
            if (timeElapsed >= resetInterval) {
                charges = maxCharges;
                localStorage.setItem('minesCharges', charges);
                localStorage.setItem('minesLastReset', now);
            } else {
                charges = parseInt(saved);
            }
        } else {
            charges = maxCharges;
            localStorage.setItem('minesCharges', charges);
            localStorage.setItem('minesLastReset', now);
        }
        updateChargeDisplay();
    }

    function saveCharges() {
        localStorage.setItem('minesCharges', charges);
        localStorage.setItem('minesLastReset', Date.now());
    }

    function updateChargeDisplay() {
        chargeCountElement.textContent = `${charges}/${maxCharges}`;
        if (charges === 0) {
            startButton.classList.add('disabled');
            updateCooldownTimer();
        } else {
            startButton.classList.remove('disabled');
            cooldownTimerElement.style.display = 'none';
        }
    }

    function updateCooldownTimer() {
        const lastReset = parseInt(localStorage.getItem('minesLastReset') || 0);
        const now = Date.now();
        const timeElapsed = now - lastReset;
        const timeLeft = resetInterval - timeElapsed;

        if (timeLeft > 0 && charges === 0) {
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            cooldownTimerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            cooldownTimerElement.style.display = 'block';
        } else {
            cooldownTimerElement.style.display = 'none';
            if (charges === 0) {
                charges = maxCharges;
                saveCharges();
                updateChargeDisplay();
            }
        }
    }

    setInterval(updateCooldownTimer, 1000);

    modal.classList.add('active');

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

    function createGrid() {
        grid.innerHTML = '';
        mines = [];
        const cells = Array(gridSize).fill(false);

        // Случайно размещаем мины
        while (mines.length < mineCount) {
            const index = Math.floor(Math.random() * gridSize);
            if (!mines.includes(index)) mines.push(index);
        }

        for (let i = 0; i < gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            grid.appendChild(cell);
        }
    }

    function handleCellClick(e) {
        if (!gameActive) return;
        const index = parseInt(e.target.dataset.index);
        if (mines.includes(index)) {
            e.target.classList.add('mine');
            endGame(false);
        } else {
            e.target.classList.add('open');
        }
    }

    function endGame(won) {
        gameActive = false;
        startButton.textContent = 'Начать игру';
        hasPlayed = true;
        userText = '';
        if (!won) {
            errorMessage.textContent = 'Вы проиграли!';
            errorMessage.style.display = 'block';
        }
    }

    modalSubmit.addEventListener('click', () => {
        if (checkModalInput()) {
            userText = modalInput.value.trim();
            modal.classList.remove('active');
            if (charges > 0) startButton.classList.remove('disabled');
            if (hasPlayed) hasPlayed = false;
        }
    });

    modalInput.addEventListener('input', checkModalInput);

    startButton.addEventListener('click', () => {
        if (startButton.classList.contains('disabled') || charges === 0) return;

        if (hasPlayed) {
            modalInput.value = '';
            modal.classList.add('active');
            startButton.classList.add('disabled');
            return;
        }

        charges--;
        saveCharges();
        updateChargeDisplay();

        gameActive = true;
        startButton.textContent = 'Игра идет...';
        errorMessage.style.display = 'none';
        createGrid();
    });

    menuButton.addEventListener('click', () => {
        window.location.href = 'https://devastcheats.github.io/3k-fp-lot-roulette-casino'; // Замена Telegram.WebApp.close()
    });

    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    createStars();
    loadCharges();
    updateCooldownTimer();
});