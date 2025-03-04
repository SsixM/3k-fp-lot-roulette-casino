document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const trapCountElement = document.getElementById('trapCount');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const mineButton = document.getElementById('mineButton');
    const resetButton = document.getElementById('resetButton');
    let trapCount = 7;

    // Фиксированное 5x5 поле
    function updateGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 25; i++) { // 5x5 = 25 ячеек
            const button = document.createElement('button');
            button.className = 'grid-button';
            grid.appendChild(button);
        }
    }

    decreaseButton.addEventListener('click', () => {
        if (trapCount > 1) {
            trapCount--;
            trapCountElement.textContent = trapCount;
        }
    });

    increaseButton.addEventListener('click', () => {
        if (trapCount < 15) {
            trapCount++;
            trapCountElement.textContent = trapCount;
        }
    });

    mineButton.addEventListener('click', () => {
        const buttons = grid.getElementsByClassName('grid-button');
        // Очищаем все активные ячейки перед новым набором
        for (let button of buttons) {
            button.classList.remove('active');
        }
        for (let i = 0; i < trapCount; i++) {
            const randomIndex = Math.floor(Math.random() * buttons.length);
            if (!buttons[randomIndex].classList.contains('active')) {
                buttons[randomIndex].classList.add('active');
            } else {
                // Если ячейка уже активна, пробуем следующую
                i--;
            }
        }
    });

    resetButton.addEventListener('click', () => {
        const buttons = grid.getElementsByClassName('grid-button');
        for (let button of buttons) {
            button.classList.remove('active');
        }
    });

    // Инициализация
    updateGrid();
});