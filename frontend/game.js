
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

const jackImage = new Image();
jackImage.src = 'images/jack.svg';

const candlestickImage = new Image();
candlestickImage.src = 'images/candlestick.svg';

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
    const response = await fetch('https://jacks-candlestick-backend.onrender.com/leaderboard');
    const data = await response.json();

    leaderboardList.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const li = document.createElement('li');
        li.textContent = entry.name + ' - ' + entry.score;
        leaderboardList.appendChild(li);
    }
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 18, y - 8, 18, 0, Math.PI * 2);
    ctx.arc(x + 36, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
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

    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#4a90d9');
    skyGradient.addColorStop(1, '#bcdffb');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(700, 50, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdb4b';
    ctx.fill();

    drawCloud(100, 60); 
    drawCloud(400, 400);

    ctx.fillStyle = '#3a2417';
    ctx.fillRect(0, groundY + 60, canvas.width, canvas.height - (groundY + 60));

    score += 1;
    scoreDisplay.textContent = 'Score: ' + Math.floor(score / 10);


    ctx.drawImage(jackImage, jack.x, jack.y, jack.width, jack.height);
    
    candlestick.x -= candlestick.speed;

    if (candlestick.x + candlestick.width < 0) {
        candlestick.x = 800;
    }

   ctx.drawImage(candlestickImage, candlestick.x, candlestick.y, candlestick.width, candlestick.height);

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
  await fetch('https://jacks-candlestick-backend.onrender.com/scores', {
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