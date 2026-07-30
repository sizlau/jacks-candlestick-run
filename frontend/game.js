
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 1.5;
const groundY = 200;
const jumpStrength = -20;
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const playerNameInput = document.getElementById('playerName');
const restartBtn = document.getElementById('restartBtn');
let score = 0;

const jack = {
    x: 50,
    y: 200,
    width: 40,
    height: 60,
    velocityY: 0,
    isJumping: false
};

const candlestick = {
    x: 800,
    y: 200,
    width: 20,
    height: 60,
    speed: 5
};

let gameOver = false;

function gameLoop() {
    if (gameOver) {
        return;
    }
    jack.velocityY += gravity;
    jack.y += jack.velocityY;

    if (jack.y >= groundY) {
        jack.y = groundY;
        jack.velocityY = 0;
        jack.isJumping = false;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score += 1;
    scoreDisplay.textContent = 'Score: ' + Math.floor(score / 10);


    ctx.fillStyle = 'black';
    ctx.fillRect(jack.x, jack.y, jack.width, jack.height);
    
    candlestick.x -= candlestick.speed;

    if (candlestick.x + candlestick.width < 0) {
        candlestick.x = 800;
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(candlestick.x, candlestick.y, candlestick.width, candlestick.height);

if (
    jack.x < candlestick.x + candlestick.width &&
    jack.x + jack.width > candlestick.x &&
    jack.y < candlestick.y + candlestick.height &&
    jack.y + jack.height > candlestick.y
) {
    gameOver = true;
    gameOverScreen.style.display = 'flex';
}
    requestAnimationFrame(gameLoop);
}

gameLoop();

restartBtn.addEventListener('click', function() {
  jack.y = groundY;
  jack.velocityY = 0;
  candlestick.x = 800;
  score = 0;
  gameOver = false;
  gameOverScreen.style.display = 'none';
  gameLoop();
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !jack.isJumping && !gameOver) {
        jack.velocityY = jumpStrength;
        jack.isJumping = true;
    }
});