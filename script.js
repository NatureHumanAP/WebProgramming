// 게임 변수
let score = 0;
let lives = 3;

// 게임 상수
const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;
const CELL_WIDTH = GAME_WIDTH / 10; // Width of each cell

// 플레이어 변수
const player = document.getElementById('player');
let playerCell = 4; // Starting cell for the player
let playerX = playerCell * CELL_WIDTH; // Initial X position based on cell
player.style.left = playerX + 'px';

// 적 생성
const enemiesContainer = document.getElementById('enemies-container');
let enemies = [];

// 플레이어 조작
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === 'ArrowLeft' && playerCell > 0) {
    playerCell--; // Move left one cell
    playerX = playerCell * CELL_WIDTH;
    player.style.left = playerX + 'px';
  } else if (key === 'ArrowRight' && playerCell < 9) {
    playerCell++; // Move right one cell
    playerX = playerCell * CELL_WIDTH;
    player.style.left = playerX + 'px';
  } else if (key === ' ') {
    // Shoot bullet
    spawnBullet();
  }
});

// 총알 발사
let bullets = [];

function spawnBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  const bulletX = playerX + 22.5; // X position of the bullet relative to the player
  const bulletY = 650; // Y position of the bullet
  bullet.style.left = bulletX + 'px';
  bullet.style.top = bulletY + 'px';
  bullets.push(bullet);
  document.getElementById('game-container').appendChild(bullet);
}

// 게임 루프
function gameLoop() {
  // Move bullets
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    const bulletY = parseInt(bullet.style.top);
    if (bulletY > 0) {
      bullet.style.top = (bulletY - 10) + 'px';
    } else {
      bullets.splice(i, 1);
      bullet.remove();
      i--;
    }
  }

  // Spawn enemies
  if (Math.random() < 0.02) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    const enemyCell = Math.floor(Math.random() * 10); // Random cell for enemy spawn
    const enemyX = enemyCell * CELL_WIDTH;
    const enemyY = 0;
    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
    enemies.push(enemy);
    enemiesContainer.appendChild(enemy);
  }

  // Move enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyY = parseInt(enemy.style.top);
    if (enemyY < GAME_HEIGHT) {
      enemy.style.top = (enemyY + 2.5) + 'px';

      // Check collision with bullets
      for (let j = 0; j < bullets.length; j++) {
        const bullet = bullets[j];
        if (collisionDetection(enemy, bullet)) {
          bullets.splice(j, 1);
          bullet.remove();
          j--;
          score += 10;
          updateScore();

          // Power-up chance
          if (Math.random() < 0.1) {
            spawnAdditionalLife(parseInt(enemy.style.left), parseInt(enemy.style.top));
          }

          enemies.splice(i, 1);
          enemy.remove();
          i--;
          break;
        }
      }

      // Check collision with player
      if (collisionDetection(enemy, player)) {
        enemies.splice(i, 1);
        enemy.remove();
        i--;
        lives--;
        updateLives();
        if (lives === 0) {
          gameOver();
          break;
        }
      }
    } else {
      enemies.splice(i, 1);
      enemy.remove();
      i--;
      score -= 50;
      updateScore();
    }
  }

  requestAnimationFrame(gameLoop);
}

// 충돌 검사
function collisionDetection(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

// 점수 업데이트
function updateScore() {
  document.getElementById('score').textContent = 'Score: ' + score;
}

// 생명력 업데이트
function updateLives() {
  document.getElementById('lives').textContent = 'Life: ' + lives;
}

// 추가 생명력 생성
function spawnAdditionalLife(x, y) {
  if (Math.random() < 0.05) {
    const additionalLife = document.createElement('div');
    additionalLife.className = 'additional-life';
    additionalLife.style.left = x + 'px';
    additionalLife.style.top = y + 'px';
    enemiesContainer.appendChild(additionalLife);
  }
}

// 게임 오버
function gameOver() {
  alert('Game Over!');
  score = 0;
  lives = 3;
  updateScore();
  updateLives();
  bullets.forEach(function(bullet) {
    bullet.remove();
  });
  bullets = [];
  enemies.forEach(function(enemy) {
    enemy.remove();
  });
  enemies = [];
}

// 게임 루프 시작
gameLoop();
