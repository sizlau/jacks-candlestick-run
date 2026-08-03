
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 1.5;
const groundY = 200;
const jumpStrength = -20;
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const playerNameInput = document.getElementById('playerName');
const restartBtn = document.getElementById('restartBtn');
const leaderboardList = document.getElementById('leaderboardList');

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

async function loadLeaderboard() {
    const response = await fetch('http://127.0.0.1:5000/leaderboard');
    const data = await response.json();

    leaderboardList.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const li = document.createElement('li');
        li.textContent = entry.name + ' - ' + entry.score;
        leaderboardList.appendChild(li);
    }
}

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
loadLeaderboard();

restartBtn.addEventListener('click', async function() {
  await fetch('http://127.0.0.1:5000/scores', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: playerNameInput.value, score: score})
  });

  loadLeaderboard();

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