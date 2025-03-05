function createStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = '#fff';
        star.style.borderRadius = '50%';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animation = `fall ${duration}s linear infinite`;
        starsContainer.appendChild(star);
    }
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fall {
        0% { transform: translateY(-100vh); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0.5; }
    }
`;
document.head.appendChild(styleSheet);

const coin = document.getElementById('coin');
const signalButton = document.getElementById('signalButton');
const resultDisplay = document.getElementById('resultDisplay');
const roundsDisplay = document.getElementById('roundsDisplay');
const roundsAmount = document.getElementById('roundsAmount');
const decreaseRounds = document.getElementById('decreaseRounds');
const increaseRounds = document.getElementById('increaseRounds');

let isFlipping = false;
let currentRounds = 1;
let completedRounds = 0;
let results = [];
let currentSide = 'heads';

// Обновление индикаторов раундов
function updateRoundsDisplay() {
    roundsDisplay.innerHTML = '';
    for (let i = 0; i < currentRounds; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('round-indicator');
        if (i < completedRounds) {
            indicator.innerHTML = results[i] === 'heads' ? '🦅' : '₽';
            indicator.classList.add(results[i]);
        } else {
            indicator.innerHTML = '?';
        }
        roundsDisplay.appendChild(indicator);
    }
}

// Сброс игры
function resetGame() {
    completedRounds = 0;
    results = [];
    resultDisplay.textContent = 'Готово к новому броску!';
    signalButton.textContent = 'Получить сигнал';
    updateRoundsDisplay();
}

// Регулировка количества раундов
decreaseRounds.addEventListener('click', () => {
    if (currentRounds > 1 && !isFlipping) {
        currentRounds--;
        roundsAmount.textContent = currentRounds;
        if (completedRounds > currentRounds) resetGame();
        updateRoundsDisplay();
    }
});

increaseRounds.addEventListener('click', () => {
    if (currentRounds < 10 && !isFlipping) {
        currentRounds++;
        roundsAmount.textContent = currentRounds;
        updateRoundsDisplay();
    }
});

// Получение сигнала и подбрасывание монетки
signalButton.addEventListener('click', () => {
    if (isFlipping) return;

    // Если все раунды завершены, сбрасываем игру
    if (completedRounds >= currentRounds) {
        resetGame();
        return;
    }

    isFlipping = true;
    coin.classList.add('signal');
    resultDisplay.textContent = 'Получение сигнала...';
    signalButton.disabled = true;

    setTimeout(() => {
        coin.classList.remove('signal');

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.classList.add(`result-${result}`);
        results[completedRounds] = result;

        setTimeout(() => {
            coin.style.transform = result === 'heads' ? 'rotateY(0deg)' : 'rotateY(180deg)';
            currentSide = result;
            resultDisplay.textContent = result === 'heads' ? 'Выпал Орёл' : 'Выпала Решка';
            coin.classList.remove(`result-${result}`);
            completedRounds++;
            updateRoundsDisplay();

            if (completedRounds >= currentRounds) {
                signalButton.textContent = 'Подбросить заново';
            }

            isFlipping = false;
            signalButton.disabled = false;
        }, 2500);
    }, 1500);
});

// Telegram Web App
if (window.Telegram) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}

window.addEventListener('load', () => {
    createStars();
    updateRoundsDisplay();
});