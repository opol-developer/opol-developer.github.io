let score = 0;
const targetScore = 5;

const gameContainer = document.getElementById('game-container');
const progressFill = document.getElementById('progress');
const scoreText = document.getElementById('score-text');
const rewardScreen = document.getElementById('reward-screen');
const bgMusic = document.getElementById('bg-music');

let isMusicStarted = false;

// KHỞI TẠO GAME VÀ LOGIC CHẠM HỘP QUÀ
function spawnTarget() {
    if (score >= targetScore) return;

    const target = document.createElement('div');
    target.classList.add('target');
    target.innerText = '🎁';

    const x = Math.random() * (window.innerWidth - 70);
    const y = Math.random() * (window.innerHeight - 200) + 120;

    target.style.left = x + 'px';
    target.style.top = y + 'px';

    target.addEventListener('click', function() {
        // Phát nhạc ngay từ click đầu tiên của người dùng
        if (!isMusicStarted && bgMusic) {
            bgMusic.play().catch(error => {
                console.log("Trình duyệt chặn phát âm thanh tự động:", error);
            });
            isMusicStarted = true;
        }

        score++;
        updateHUD();
        createPopEffect(x, y);
        target.remove();

        if (score >= targetScore) {
            endGame();
        } else {
            setTimeout(spawnTarget, 200);
        }
    });

    gameContainer.appendChild(target);
}

function updateHUD() {
    const percentage = (score / targetScore) * 100;
    progressFill.style.width = percentage + '%';
    scoreText.innerText = `Đã thu thập: ${score}/${targetScore}`;
}

function createPopEffect(x, y) {
    for(let i = 0; i < 5; i++) {
        const p = document.createElement('div');
        p.innerText = '❤️';
        p.style.position = 'absolute';
        p.style.left = (x + 20) + 'px';
        p.style.top = (y + 20) + 'px';
        p.style.transition = 'all 0.5s ease-out';
        p.style.zIndex = '6';
        p.style.fontSize = '20px';
        p.style.pointerEvents = 'none';
        document.body.appendChild(p);

        setTimeout(() => {
            const moveX = (Math.random() - 0.5) * 120;
            const moveY = (Math.random() - 0.5) * 120;
            p.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.5)`;
            p.style.opacity = '0';
        }, 10);

        setTimeout(() => p.remove(), 500);
    }
}

function endGame() {
    gameContainer.style.display = 'none';
    rewardScreen.style.display = 'block';
    startFireworks();
}

function resetGame() {
    score = 0;
    updateHUD();
    rewardScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    spawnTarget();
}

// Chạy game
spawnTarget();

// --- HỆ THỐNG HIỆU ỨNG PHÁO HOA NỀN ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let fireworkInterval;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function startFireworks() {
    if (!fireworkInterval) {
        fireworkInterval = setInterval(() => {
            if(rewardScreen.style.display === 'block') {
                createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.4);
            }
        }, 400);
        animate();
    }
}

function createFirework(x, y) {
    const colors = ['#ff416c', '#ff4b2b', '#ffeb3b', '#00f2fe', '#4facfe', '#00ff87', '#b5179e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for(let i = 0; i < 35; i++) {
        fireworks.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7,
            alpha: 1,
            color: color
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((f, i) => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.05;
        f.alpha -= 0.012;
        if (f.alpha <= 0) {
            fireworks.splice(i, 1);
        } else {
            ctx.globalAlpha = f.alpha;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    requestAnimationFrame(animate);
}
