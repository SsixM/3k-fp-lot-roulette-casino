function createStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 100; i++) { // Increased to 100 stars
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = `${Math.random() * 4 + 2}px`;
        star.style.background = 'linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))';
        star.style.boxShadow = '0 0 5px #fff';
        star.style.borderRadius = '50%';
        star.style.opacity = 0;

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
    let trapCount = 1; // Start with 1 as shown in the image
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

        setTimeout(() => {
            mineButton.classList.remove('loading');
            const trapIndices = new Set();
            while (trapIndices.size < trapCount) {
                const randomIndex = Math.floor(Math.random() * buttons.length);
                trapIndices.add(randomIndex);
            }
            trapIndices.forEach(index => {
                buttons[index].classList.add('active');
            });

            const stars = document.querySelectorAll('.stars div');
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.animation = 'fadeInStars 0.5s ease-out forwards';
                }, index * 50);
            });
        }, 1000);
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

    createStars();
    updateGrid();
});