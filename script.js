const players = {
    Ben: [
        'apple', 'banana', 'orange', 'grape', 'pear', 'peach', 'kiwi', 'mango', 'plum', 'berry',
        'melon', 'lemon', 'cherry', 'strawberry', 'raspberry', 'blueberry', 'pineapple', 'avocado', 'coconut', 'papaya',
        'lime', 'watermelon', 'apricot', 'date', 'fig', 'guava', 'kumquat', 'mandarin', 'nectarine', 'olive', 
        'pomegranate', 'tangerine', 'quince', 'persimmon', 'jackfruit', 'lychee', 'durian', 'rhubarb', 'passionfruit', 'cantaloupe'
    ],
    Sara: [
        'keyboard', 'pencil', 'laptop', 'notebook', 'backpack', 'calculator', 'textbook', 'crayons', 'dictionary', 'ruler',
        'sharpener', 'stapler', 'marker', 'glue', 'eraser', 'scissors', 'pen', 'paperclip', 'highlighter', 'compass',
        'protractor', 'whiteboard', 'blackboard', 'globe', 'projector', 'headphones', 'printer', 'tablet', 'binder', 'divider',
        'clipboard', 'tape', 'paintbrush', 'folder', 'chalk', 'calendar', 'microscope', 'telescope', 'thermometer', 'beaker'
    ]
};

let currentPlayer;
let words;
let currentWordIndex = 0;
let currentWord;
let guessedLetters = [];
let displayWord;
let remainingGuesses = 10;
let punchesEarned = 0;
let correctWords = 0;

const wordDisplay = document.getElementById('wordDisplay');
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const message = document.getElementById('message');
const playerElement = document.getElementById('player');
const spellingPrompt = document.getElementById('spellingPrompt');
const spellInput = document.getElementById('spellInput');
const spellBtn = document.getElementById('spellBtn');
const resultMessage = document.getElementById('resultMessage');
const guessedLettersDisplay = document.getElementById('guessedLettersDisplay');
const punchCardDisplay = document.getElementById('punchCardDisplay');
const hangmanCanvas = document.getElementById('hangmanCanvas');
const ctx = hangmanCanvas.getContext('2d');

const playerSelectionScreen = document.getElementById('playerSelection');
const gameScreen = document.getElementById('gameScreen');
const benButton = document.getElementById('benButton');
const saraButton = document.getElementById('saraButton');

// Player selection
benButton.addEventListener('click', () => {
    currentPlayer = 'Ben';
    words = shuffleArray(players[currentPlayer]);
    startGame();
});

saraButton.addEventListener('click', () => {
    currentPlayer = 'Sara';
    words = shuffleArray(players[currentPlayer]);
    startGame();
});

function startGame() {
    currentWordIndex = 0;
    correctWords = 0;
    punchesEarned = 0;
    loadNextWord();
}

function loadNextWord() {
    currentWord = words[currentWordIndex].toLowerCase();
    guessedLetters = [];
    displayWord = '_ '.repeat(currentWord.length).trim();
    remainingGuesses = 10;
    
    playerSelectionScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    playerElement.textContent = `${currentPlayer}'s Turn`;
    wordDisplay.textContent = displayWord;
    message.textContent = '';
    resultMessage.textContent = '';
    guessedLettersDisplay.textContent = '';
    punchCardDisplay.textContent = `Punches Earned: ${punchesEarned}`;
    guessBtn.disabled = false;
    spellingPrompt.style.display = 'none';
    spellInput.value = '';
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);  // Clear hangman
}

function drawHangman(wrongGuesses) {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);  // Clear the canvas
    ctx.strokeStyle = '#00ffff';  // Set the color to blue

    // Draw base
    if (wrongGuesses > 0) ctx.fillRect(20, 180, 100, 10); // base
    if (wrongGuesses > 1) ctx.fillRect(40, 20, 10, 160);  // pole
    if (wrongGuesses > 2) ctx.fillRect(40, 20, 70, 10);   // top bar
    if (wrongGuesses > 3) ctx.fillRect(110, 20, 2, 30);   // rope
    if (wrongGuesses > 4) {  // head
        ctx.beginPath();
        ctx.arc(111, 60, 15, 0, Math.PI * 2, true);
        ctx.stroke();
    }
    if (wrongGuesses > 5) {  // body
        ctx.fillRect(110, 75, 2, 40);
    }
    if (wrongGuesses > 6) {  // left arm
        ctx.beginPath();
        ctx.moveTo(110, 90);
        ctx.lineTo(90, 110);
        ctx.stroke();
    }
    if (wrongGuesses > 7) {  // right arm
        ctx.beginPath();
        ctx.moveTo(112, 90);
        ctx.lineTo(132, 110);
        ctx.stroke();
    }
    if (wrongGuesses > 8) {  // left leg
        ctx.beginPath();
        ctx.moveTo(110, 115);
        ctx.lineTo(95, 140);
        ctx.stroke();
    }
    if (wrongGuesses > 9) {  // right leg
        ctx.beginPath();
        ctx.moveTo(112, 115);
        ctx.lineTo(127, 140);
        ctx.stroke();
    }

    if (wrongGuesses >= 10) {
        message.textContent = "Game Over! You've been hanged.";
        guessBtn.disabled = true; // Disable further guesses
    }
}

function updateDisplayWord() {
    displayWord = currentWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordDisplay.textContent = displayWord;
}

guessBtn.addEventListener('click', () => {
    const guessedLetter = guessInput.value.toLowerCase();
    guessInput.value = '';
    if (!guessedLetter || guessedLetters.includes(guessedLetter)) {
        message.textContent = 'Invalid or repeated guess. Try again!';
        return;
    }

    guessedLetters.push(guessedLetter);
    guessedLettersDisplay.textContent = `Guessed Letters: ${guessedLetters.join(', ')}`;

    if (currentWord.includes(guessedLetter)) {
        message.textContent = 'Good guess!';
        updateDisplayWord();
    } else {
        remainingGuesses--;
        message.textContent = `Wrong guess! You have ${remainingGuesses} guesses left.`;
        drawHangman(10 - remainingGuesses);  // Draw hangman piece by piece
    }

    if (!displayWord.includes('_')) {
        message.textContent = 'Word guessed! Now spell it!';
        spellingPrompt.style.display = 'block';
        guessBtn.disabled = true;
    }

    if (remainingGuesses <= 0) {
        message.textContent = 'Game Over! Try again.';
        guessBtn.disabled = true;
        drawHangman(10);  // Complete hangman when losing
    }
});

spellBtn.addEventListener('click', () => {
    const spelledWord = spellInput.value.toLowerCase();
    if (spelledWord === currentWord) {
        resultMessage.textContent = `Correct! You've earned a punch!`;
        correctWords++;

        if (correctWords % 10 === 0) {
            punchesEarned++;
            punchCardDisplay.textContent = `Punches Earned: ${punchesEarned}`;
        }

        currentWordIndex++;
        if (currentWordIndex < words.length) {
            loadNextWord();
        } else {
            resultMessage.textContent = 'Congratulations! You’ve completed all words!';
        }
    } else {
        resultMessage.textContent = 'Incorrect spelling, try again!';
    }
});

// Utility function to shuffle words
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
