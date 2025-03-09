const grid = document.querySelector(".grid");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameOverDisplay = document.querySelector(".game-over");
let squares = [];
let score = 0;
let time = 0; // Time in seconds
let timerInterval; // To store the timer interval

// Create the game board
function createBoard() {
    for (let i = 0; i < 16; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
        squares.push(square);
    }
    generateNumber();
    generateNumber();
    startTimer(); // Start the timer when the game begins
}

// Generate a new number (2 or 4)
function generateNumber() {
    const randomNumber = Math.random() > 0.5 ? 2 : 4;
    const emptySquares = squares.filter(square => square.textContent === "");
    if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        emptySquares[randomIndex].textContent = randomNumber;
        addFlipAnimation(emptySquares[randomIndex]); // Trigger flip animation
    }
}

// Function to add flip animation to a tile
function addFlipAnimation(tile) {
    tile.classList.add("flip-animation");
    setTimeout(() => {
        tile.classList.remove("flip-animation");
    }, 500); // Remove the class after the animation completes
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") moveUp();
    if (e.key === "ArrowDown") moveDown();
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
});

// Movement functions
function moveUp() {
    let moved = false;
    for (let i = 4; i < 16; i++) {
        if (squares[i].textContent !== "") {
            let j = i;
            while (j >= 4 && squares[j - 4].textContent === "") {
                squares[j - 4].textContent = squares[j].textContent;
                squares[j].textContent = "";
                j -= 4;
                moved = true;
            }
            if (j >= 4 && squares[j - 4].textContent === squares[j].textContent) {
                squares[j - 4].textContent = String(Number(squares[j].textContent) * 2);
                squares[j].textContent = "";
                score += Number(squares[j - 4].textContent);
                scoreDisplay.textContent = score;
                addFlipAnimation(squares[j - 4]); // Trigger flip animation on merge
                moved = true;
            }
        }
    }
    if (moved) {
        generateNumber();
        checkGameOver();
    }
}

function moveDown() {
    let moved = false;
    for (let i = 11; i >= 0; i--) {
        if (squares[i].textContent !== "") {
            let j = i;
            while (j <= 11 && squares[j + 4].textContent === "") {
                squares[j + 4].textContent = squares[j].textContent;
                squares[j].textContent = "";
                j += 4;
                moved = true;
            }
            if (j <= 11 && squares[j + 4].textContent === squares[j].textContent) {
                squares[j + 4].textContent = String(Number(squares[j].textContent) * 2);
                squares[j].textContent = "";
                score += Number(squares[j + 4].textContent);
                scoreDisplay.textContent = score;
                addFlipAnimation(squares[j + 4]); // Trigger flip animation on merge
                moved = true;
            }
        }
    }
    if (moved) {
        generateNumber();
        checkGameOver();
    }
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 16; i++) {
        if (squares[i].textContent !== "") {
            let j = i;
            while (j % 4 !== 0 && squares[j - 1].textContent === "") {
                squares[j - 1].textContent = squares[j].textContent;
                squares[j].textContent = "";
                j -= 1;
                moved = true;
            }
            if (j % 4 !== 0 && squares[j - 1].textContent === squares[j].textContent) {
                squares[j - 1].textContent = String(Number(squares[j].textContent) * 2);
                squares[j].textContent = "";
                score += Number(squares[j - 1].textContent);
                scoreDisplay.textContent = score;
                addFlipAnimation(squares[j - 1]); // Trigger flip animation on merge
                moved = true;
            }
        }
    }
    if (moved) {
        generateNumber();
        checkGameOver();
    }
}

function moveRight() {
    let moved = false;
    for (let i = 15; i >= 0; i--) {
        if (squares[i].textContent !== "") {
            let j = i;
            while (j % 4 !== 3 && squares[j + 1].textContent === "") {
                squares[j + 1].textContent = squares[j].textContent;
                squares[j].textContent = "";
                j += 1;
                moved = true;
            }
            if (j % 4 !== 3 && squares[j + 1].textContent === squares[j].textContent) {
                squares[j + 1].textContent = String(Number(squares[j].textContent) * 2);
                squares[j].textContent = "";
                score += Number(squares[j + 1].textContent);
                scoreDisplay.textContent = score;
                addFlipAnimation(squares[j + 1]); // Trigger flip animation on merge
                moved = true;
            }
        }
    }
    if (moved) {
        generateNumber();
        checkGameOver();
    }
}

// Check for game over
function checkGameOver() {
    let isGameOver = true;
    for (let i = 0; i < 16; i++) {
        if (squares[i].textContent === "") {
            isGameOver = false;
            break;
        }
        if (i % 4 !== 3 && squares[i].textContent === squares[i + 1].textContent) {
            isGameOver = false;
            break;
        }
        if (i < 12 && squares[i].textContent === squares[i + 4].textContent) {
            isGameOver = false;
            break;
        }
    }
    if (isGameOver) {
        gameOverDisplay.style.display = "block";
        stopTimer(); // Stop the timer when the game is over
    }
}

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        updateTimerDisplay();
    }, 1000); // Update every second
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

function updateTimerDisplay() {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Add touch controls
const gameContainer = document.querySelector(".container");
const hammer = new Hammer(gameContainer);

hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

hammer.on("swipeup", () => moveUp());
hammer.on("swipedown", () => moveDown());
hammer.on("swipeleft", () => moveLeft());
hammer.on("swiperight", () => moveRight());

createBoard();
