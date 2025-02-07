const cardsArray = [
    "Images/aloy.jpg", "Images/blastoise.jpg", "Images/charizard.png", "Images/chloe.png",
    "Images/chun_li.jpg", "Images/Cpt_Price.jpg", "Images/DVA.png", "Images/endermen.png",
    "Images/ezi.png", "Images/geralt.avif", "Images/greenMario.webp", "Images/jillValentine.png",
    "Images/Kirby.png", "Images/lara croft.png", "Images/mario.png", "Images/MasterChief.png",
    "Images/Nathan_drake.webp", "Images/samus.avif", "Images/shadowheart.jfif", "Images/Steve.png",
    "Images/tails.png", "Images/xcom.webp", "Images/Yennefer.webp", "Images/yoshi.webp","Images/1UP.webp", 
    "Images/blueShell.webp", "Images/bomb.webp", "Images/smashBall.webp", "Images/star (2).webp", 
];

const cardBackground = "Images/background.webp";
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 6;
let gameStarted = false;

let timerInterval;
let timeElapsed = 0;
let timerStarted = false;

function startTimer() {
    if (!timerStarted) {
        timerStarted = true; // Mark timer as started
        timeElapsed = 0;
        $(".timer").text(timeElapsed); // Reset timer display

        timerInterval = setInterval(() => {
            timeElapsed++;
            $(".timer").text(timeElapsed);
        }, 1000);
    }
}
function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}
function pointsAdd() {
    let scoreElement = $("#scoreValue"); // Select the number inside the scoreboard
    let currentPoints = parseInt(scoreElement.text()) || 0; // Get the current score

    if (currentPoints < 100) { // Prevent going above 100
        scoreElement.text(currentPoints + 1); // Update only the number
    }
}



// Function to get 6 pairs (12 shuffled cards)
function getRandomCombination(numberOfPairs) {
    const selectedImages = [];

    while (selectedImages.length < numberOfPairs) {
        const randomImage = cardsArray[Math.floor(Math.random() * cardsArray.length)];
        if (!selectedImages.includes(randomImage)) {
            selectedImages.push(randomImage);
        }
    }

    const pairedCards = [...selectedImages, ...selectedImages];
    return shuffleArray(pairedCards);
}

// Shuffle function
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Function to reset and populate the game board
function setupGame() {
    matchedPairs = 0;
    flippedCards = [];

    
    const randomCombination = getRandomCombination(totalPairs);
    
    randomCombination.forEach((image, index) => {
        const cardElement = document.querySelector(`#card${index + 1}`);
        if (cardElement) {
            cardElement.style.backgroundImage = `url("${cardBackground}")`;
            cardElement.dataset.cardImage = image;
            cardElement.classList.remove("flipped", "hop"); // Reset animations
        }
        
    });

    console.log("New game setup:", randomCombination);
}

// Handle card flip
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener("click", () => {
        playFlipSound();
    });
    
    card.addEventListener("click", function() {
        if (!timerStarted) {
            startTimer(); // Start timer on first click
        }

        if (!this.classList.contains("flipped") && flippedCards.length < 2) {
            this.classList.add("flipped");
            this.style.backgroundImage = `url("${this.dataset.cardImage}")`;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    });
});


// Check if flipped cards match
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.cardImage === secondCard.dataset.cardImage) {
        playMatchSound();
        matchedPairs++;
        flippedCards = [];
       

        pointsAdd();

        if (matchedPairs === totalPairs) {
            handleGameWon();
            pointsAdd();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.style.backgroundImage = `url("${cardBackground}")`;
            secondCard.style.backgroundImage = `url("${cardBackground}")`;
            flippedCards = [];
        }, 1000);
    }
}

// Function to handle win state and animation
function handleGameWon() {
   
    // 1. Get all card elements
    const allCards = document.querySelectorAll(".card");

    // 2. Apply the hop animation to each card
    allCards.forEach(card => {
        card.classList.add("hop");
    });

    // 3. Create the winning message
    const winningMessage = document.createElement("div");
    winningMessage.textContent = "You Win!";
    winningMessage.style.textAlign = "center";
    winningMessage.style.fontSize = "2em";
    winningMessage.style.color = "green";
    winningMessage.id = "winMessage";  // Add an ID to the message to easily target it
    document.body.appendChild(winningMessage);

    // 4. Optionally, stop the hop animation after a few seconds
    setTimeout(() => {
        allCards.forEach(card => {
            card.classList.remove("hop");
        });
    }, 80000); 

    // After 8 seconds, remove the winning message
    setTimeout(() => {
        winningMessage.remove();
    }, 80000);

    // Set gameStarted flag to true after the game is won
    gameStarted = true;
}

// Reset button logic
document.getElementById("resetButton").addEventListener("click", function () {
    if (gameStarted) {
        // Reset all cards
        document.querySelectorAll(".card").forEach(card => {
            card.classList.remove("flipped", "hop"); // Remove flip and hop states
            card.style.backgroundImage = `url("${cardBackground}")`; // Reset to default background image
        });

        // Remove the win message
        const winMessage = document.getElementById("winMessage");
        if (winMessage) {
            winMessage.remove();
        }

        // Reset matchedPairs and flippedCards
        matchedPairs = 0;
        flippedCards = [];

        // Regenerate and shuffle the cards to get a new set
        setupGame(); // Reset the game with new shuffled cards

        // Reset the score on the scoreboard
        //document.querySelector(".scoreBoard").textContent = "Points: 0";

        console.log("Game Reset!");

    } else {
        console.log("Game hasn't started yet. Background image not affected.");
    }
});

// Inject CSS for animation dynamically
function injectCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes hopAround {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .hop {
        animation: hopAround 0.5s ease-in-out infinite;
    }
    `;
    document.head.appendChild(style);
}
const bgMusic = document.getElementById("bg-music");

function playMusic() {
    bgMusic.play();
}

function pauseMusic() {
    bgMusic.pause();
}

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

const flipSound = new Audio("Sounds/Flip Card SOUND Effect.mp3");
const matchSound = new Audio("Sounds/Game Show Winner Bell Sound Effect (The Price is Right).mp3");
const winSound = new Audio("Sounds/Victory Sound Effect.mp3");

function playFlipSound() {
    flipSound.play();
}

function playMatchSound() {
    matchSound.currentTime = 0; // Restart from the beginning
    matchSound.play();
}


function playWinSound() {
    winSound.play();
}


// Initialize the game on load
injectCSS();
setupGame();
