// 게임 변수
let score = 0; // 점수
let lives = 3; // 생명력
let level = 1; // 게임 레벨

// 게임 상수
const GAME_WIDTH = 500; // 게임 너비
const GAME_HEIGHT = 700; // 게임 높이
const CELL_WIDTH = GAME_WIDTH / 10; // 각 셀의 너비

// 플레이어 변수
const player = document.getElementById('player'); // 플레이어 HTML 요소
let playerCell = 4; // 플레이어의 시작 셀
let playerX = playerCell * CELL_WIDTH; // 셀에 기반한 초기 X 위치
player.style.left = playerX + 'px';

// 적 생성
const enemiesContainer = document.getElementById('enemies-container'); // 적 컨테이너 HTML 요소
let enemies = []; // 적 배열

// 추가 생명력
let additionalLives = []; // 추가 생명력 배열

// 플레이어 조작
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === 'ArrowLeft' && playerCell > 0) {
    playerCell--; // 왼쪽으로 한 셀 이동
    playerX = playerCell * CELL_WIDTH;
    player.style.left = playerX + 'px';
  } else if (key === 'ArrowRight' && playerCell < 9) {
    playerCell++; // 오른쪽으로 한 셀 이동
    playerX = playerCell * CELL_WIDTH;
    player.style.left = playerX + 'px';
  } else if (key === ' ') {
    // 총알 발사
    spawnBullet();
  }
});

// 총알 발사
let bullets = []; // 총알 배열

function spawnBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  const bulletX = playerX + 22.5; // 플레이어 기준 총알의 X 위치
  const bulletY = 650; // 총알의 Y 위치
  bullet.style.left = bulletX + 'px';
  bullet.style.top = bulletY + 'px';
  bullets.push(bullet);
  document.getElementById('game-container').appendChild(bullet);
}

// 게임 루프
function gameLoop() {
  // 총알 이동
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

  // 추가 생명력 생성
  for (let i = 0; i < additionalLives.length; i++) {
    const additionalLife = additionalLives[i];
    const additionalLifeY = parseInt(additionalLife.style.top);
    if (additionalLifeY < GAME_HEIGHT) {
      const additionalLifeSpeed = 2.5; // 추가 생명력이 떨어지는 속도
      additionalLife.style.top = (additionalLifeY + additionalLifeSpeed) + 'px';

      // 플레이어와 충돌 검사
      if (collisionDetection(additionalLife, player)) {
        additionalLives.splice(i, 1);
        additionalLife.remove();
        i--;
        lives++;
        updateLives();
      }
    } else {
      additionalLives.splice(i, 1);
      additionalLife.remove();
      i--;
    }
  }

  // 적 생성
  if (Math.random() < 0.02) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    const enemyCell = Math.floor(Math.random() * 10); // 적이 생성될 랜덤한 셀
    const enemyX = enemyCell * CELL_WIDTH;
    const enemyY = 0;
    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
    enemies.push(enemy);
    enemiesContainer.appendChild(enemy);
  }

  // 적 이동
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyY = parseInt(enemy.style.top);
    if (enemyY < GAME_HEIGHT) {
      const enemySpeed = (level === 1) ? 2.5 : 2.5 * 1.5; // 게임 레벨에 따른 적의 이동 속도
      enemy.style.top = (enemyY + enemySpeed) + 'px';

      // 총알과 충돌 검사
      for (let j = 0; j < bullets.length; j++) {
        const bullet = bullets[j];
        if (collisionDetection(enemy, bullet)) {
          bullets.splice(j, 1);
          bullet.remove();
          j--;

          // 추가 생명력 생성 확률
          if (Math.random() < 0.1) {
            spawnAdditionalLife(parseInt(enemy.style.left), parseInt(enemy.style.top));
          }

          enemies.splice(i, 1);
          enemy.remove();
          i--;
          score += 10;
          updateScore();

          // 게임 레벨 진행
          if (score >= 1000 * level) {
            level++;
            increaseEnemySpeed();
            updateLevel();
          }

          break;
        }
      }

      // 플레이어와 충돌 검사
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
    document.getElementById('score').textContent = '점수: ' + score;
  }
  
  // 생명력 업데이트
  function updateLives() {
    document.getElementById('lives').textContent = '생명력: ' + lives;
  }
  
  function updateLevel() {
    document.getElementById('level').textContent = '레벨: ' + level;
  }
  
  // 추가 생명력 생성
  function spawnAdditionalLife(x, y) {
    if (Math.random() < 0.1) {
      const additionalLife = document.createElement('div');
      additionalLife.className = 'additional-life';
      additionalLife.style.left = x + 'px';
      additionalLife.style.top = y + 'px';
      additionalLives.push(additionalLife);
      enemiesContainer.appendChild(additionalLife);
    }
  }
  
  // 적 속도 증가

    function increaseEnemySpeed() {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const currentSpeed = parseFloat(getComputedStyle(enemy).getPropertyValue('transition-duration'));
            const newSpeed = currentSpeed * 1.2; // 현재 속도에 1.2를 곱하여 증가
            enemy.style.transitionDuration = newSpeed + 's';
        }
    }
   
  // 게임 오버
  function gameOver() {
    alert('게임 오버!');
    score = 0;
    lives = 3;
    level = 1;
    updateScore();
    updateLives();
    updateLevel();
    bullets.forEach(function (bullet) {
      bullet.remove();
    });
    bullets = [];
    enemies.forEach(function (enemy) {
      enemy.remove();
    });
    enemies = [];
    additionalLives.forEach(function (additionalLife) {
      additionalLife.remove();
    });
    additionalLives = [];
  }
  
  // 게임 루프 시작
  gameLoop();
  
