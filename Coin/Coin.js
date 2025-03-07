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

// Check if watermark image loads, fallback to no watermark if it fails
const watermarkImg = new Image();
watermarkImg.src = 'watermark.png';
watermarkImg.onload = () => {
    document.body.style.backgroundImage = `url('watermark.png')`;
};
watermarkImg.onerror = () => {
    console.log('Watermark image not found, skipping watermark.');
};

const coin = document.getElementById('coin');
const signalButton = document.getElementById('signalButton');
const eagleCard = document.getElementById('eagleCard');
const tailCard = document.getElementById('tailCard');
const userInput = document.getElementById('userInput');
const menuButton = document.getElementById('menuButton');

let isFlipping = false;

// Сброс состояния карт и анимации
function resetCards() {
    eagleCard.classList.remove('winner', 'loser');
    tailCard.classList.remove('winner', 'loser');
    coin.style.animation = 'none';
    void coin.offsetWidth;
}

signalButton.addEventListener('click', () => {
    const userInputValue = userInput.value.trim();

    if (!userInputValue) {
        return;
    }

    if (isFlipping) return;

    isFlipping = true;
    signalButton.disabled = true;
    resetCards();

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    if (result === 'heads') {
        coin.style.animation = 'coinSpinHeads 3s ease-in-out forwards';
    } else {
        coin.style.animation = 'coinSpinTails 3s ease-in-out forwards';
    }

    setTimeout(() => {
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
        signalButton.disabled = false;
    }, 3000);
});

menuButton.addEventListener('click', () => {
    window.location.href = 'menu.html';
});

if (window.Telegram) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

const savedValue = localStorage.getItem('userInputValue');
if (savedValue) {
    userInput.value = savedValue;
}

userInput.addEventListener('input', () => {
    localStorage.setItem('userInputValue', userInput.value);
});

document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

window.addEventListener('load', () => {
    createStars();
});