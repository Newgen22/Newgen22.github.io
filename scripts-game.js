// FlappyBird Game JavaScript - ปรับปรุงความยากแบบเพิ่มระดับ
// สำหรับเว็บไซต์พรรคนิวเจน (New Gen)

class FlappyBirdGame {
    constructor() {
        // รอให้ DOM พร้อม
        if (document.readyState !== 'loading') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
    }
    
    init() {
        // ดึง DOM elements
        this.gameContainer = document.getElementById('gameContainer');
        this.bird = document.getElementById('bird');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');
        this.instructionsElement = document.getElementById('instructions');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // ตรวจสอบว่า elements ทั้งหมดพร้อมแล้ว
        if (!this.gameContainer || !this.bird || !this.scoreElement) {
            console.error('Required game elements not found');
            return;
        }
        
        // การตั้งค่าเกม (ค่าเริ่มต้น)
        this.gameWidth = this.gameContainer.offsetWidth;
        this.gameHeight = this.gameContainer.offsetHeight;
        this.birdStartY = this.gameHeight / 2 - 11;
        
        // ค่าเริ่มต้นของความยาก
        this.baseGravity = 0.4;           // แรงโน้มถ่วงเริ่มต้น
        this.baseJumpForce = -8.5;        // แรงกระโดดเริ่มต้น
        this.basePipeWidth = 65;          // ความกว้างเสาเริ่มต้น
        this.basePipeGap = 160;           // ช่องว่างเสาเริ่มต้น
        this.basePipeSpeed = 1.8;         // ความเร็วเสาเริ่มต้น
        this.basePipeInterval = 2800;     // ระยะห่างเสาเริ่มต้น (ms)
        
        // ค่าปัจจุบันของความยาก
        this.gravity = this.baseGravity;
        this.jumpForce = this.baseJumpForce;
        this.pipeWidth = this.basePipeWidth;
        this.pipeGap = this.basePipeGap;
        this.pipeSpeed = this.basePipeSpeed;
        this.pipeInterval = this.basePipeInterval;
        
        this.bestScore = 0;
        this.currentLevel = 1;
        
        // เริ่มต้นเกม
        this.reset();
        this.setupEventListeners();
        this.createClouds();
        this.setupResponsive();
        
        console.log('FlappyBird game with progressive difficulty initialized');
    }
    
    // คำนวณระดับความยากตามคะแนน
    calculateDifficulty() {
        // คำนวณระดับปัจจุบัน
        const newLevel = Math.floor(this.score / 10) + 1;
        
        // อัพเดทระดับและแสดงข้อความ
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            this.showLevelUp();
        }
        
        // คำนวณค่าความยากใหม่
        const difficultyFactor = Math.min(this.currentLevel * 0.15, 2.0); // จำกัดความยากสูงสุด
        
        // เพิ่มแรงโน้มถ่วง
        this.gravity = this.baseGravity + (difficultyFactor * 0.1);
        
        // เพิ่มความเร็วเสา
        this.pipeSpeed = this.basePipeSpeed + (difficultyFactor * 0.4);
        
        // ลดช่องว่างเสา (แต่ไม่ให้น้อยเกินไป)
        this.pipeGap = Math.max(this.basePipeGap - (difficultyFactor * 8), 120);
        
        // ลดระยะห่างเสา (ทำให้เสาออกมาเร็วขึ้น)
        this.pipeInterval = Math.max(this.basePipeInterval - (difficultyFactor * 200), 1800);
        
        // ลดความกว้างเสา (ทำให้ยากขึ้นเล็กน้อย)
        this.pipeWidth = Math.max(this.basePipeWidth - (difficultyFactor * 2), 50);
        
        // ปรับแรงกระโดด (ทำให้ยากขึ้นเล็กน้อย)
        this.jumpForce = Math.max(this.baseJumpForce - (difficultyFactor * 0.3), -12);
    }
    
    // แสดงข้อความขึ้นระดับ
    showLevelUp() {
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'level-up-message';
        levelUpMsg.innerHTML = `
            <div>🎉 ระดับ ${this.currentLevel} 🎉</div>
            <div>ความยากเพิ่มขึ้น!</div>
        `;
        levelUpMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #ffd93d);
            color: white;
            padding: 20px;
            border-radius: 15px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 100;
            animation: levelUpPulse 2s ease-in-out;
            border: 3px solid #fff;
        `;
        
        this.gameContainer.appendChild(levelUpMsg);
        
        // ลบข้อความหลัง 2 วินาที
        setTimeout(() => {
            if (levelUpMsg.parentNode) {
                levelUpMsg.remove();
            }
        }, 2000);
    }
    
    // รีเซ็ตเกม
    reset() {
        this.birdY = this.birdStartY;
        this.birdVelocity = 0;
        this.score = 0;
        this.gameRunning = false;
        this.pipes = [];
        this.gameStarted = false;
        this.lastPipeTime = 0;
        this.animationId = null;
        this.currentLevel = 1;
        
        // รีเซ็ตค่าความยากกลับเป็นค่าเริ่มต้น
        this.gravity = this.baseGravity;
        this.jumpForce = this.baseJumpForce;
        this.pipeWidth = this.basePipeWidth;
        this.pipeGap = this.basePipeGap;
        this.pipeSpeed = this.basePipeSpeed;
        this.pipeInterval = this.basePipeInterval;
        
        // รีเซ็ตตำแหน่งนก
        this.bird.style.top = this.birdY + 'px';
        this.bird.style.left = '80px';
        this.bird.style.transform = 'rotate(0deg)';
        
        // ลบเสาทั้งหมด
        this.clearPipes();
        
        // อัพเดทคะแนน
        this.updateScore();
        
        // ซ่อน/แสดงองค์ประกอบ UI
        if (this.gameOverElement) {
            this.gameOverElement.style.display = 'none';
        }
        if (this.instructionsElement) {
            this.instructionsElement.style.display = 'block';
        }
        
        // ลบคลาสเอฟเฟกต์
        this.gameContainer.classList.remove('hit-animation');
        this.bird.classList.remove('flap-animation');
        
        // ลบข้อความขึ้นระดับที่เหลือ
        const levelUpMessages = this.gameContainer.querySelectorAll('.level-up-message');
        levelUpMessages.forEach(msg => msg.remove());
    }
    
    // ตั้งค่า Event Listeners
    setupEventListeners() {
        // ปุ่มเริ่มเกม
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        // ปุ่มเล่นใหม่
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.reset();
            });
        }
        
        // คลิกหน้าจอ
        this.gameContainer.addEventListener('click', (e) => {
            // ป้องกันไม่ให้กระโดดเมื่อคลิกปุ่ม
            if (e.target.tagName === 'BUTTON') return;
            this.jump();
        });
        
        // แตะหน้าจอ (สำหรับมือถือ)
        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.target.tagName === 'BUTTON') return;
            this.jump();
        });
        
        // กดปุ่ม space
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
        });
    }
    
    // ตั้งค่า Responsive
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.gameWidth = this.gameContainer.offsetWidth;
            this.gameHeight = this.gameContainer.offsetHeight;
            
            // ปรับตำแหน่งนกใหม่
            if (this.birdY > this.gameHeight - 22) {
                this.birdY = this.gameHeight - 22;
            }
        });
    }
    
    // เริ่มเกม
    startGame() {
        this.gameRunning = true;
        this.gameStarted = true;
        
        if (this.instructionsElement) {
            this.instructionsElement.style.display = 'none';
        }
        
        this.lastPipeTime = performance.now();
        this.gameLoop();
    }
    
    // การกระโดดของนก
    jump() {
        if (!this.gameStarted) {
            this.startGame();
            return;
        }
        
        if (this.gameRunning) {
            this.birdVelocity = this.jumpForce;
            
            // เอฟเฟกต์การบิน
            this.bird.style.transform = 'rotate(-15deg)';
            setTimeout(() => {
                if (this.gameRunning) {
                    this.bird.style.transform = 'rotate(0deg)';
                }
            }, 200);
        }
    }
    
    // ลูปหลักของเกม
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.updateBird();
        this.updatePipes();
        this.checkCollisions();
        this.calculateDifficulty(); // คำนวณความยากใหม่
        this.updateScore();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // อัพเดทการเคลื่อนไหวของนก
    updateBird() {
        // คำนวณแรงโน้มถ่วง
        this.birdVelocity += this.gravity;
        this.birdY += this.birdVelocity;
        
        // จำกัดการเคลื่อนไหวของนก
        if (this.birdY < 0) {
            this.birdY = 0;
            this.birdVelocity = 0;
        }
        
        // ตรวจสอบการชนพื้น
        if (this.birdY > this.gameHeight - 22) {
            this.birdY = this.gameHeight - 22;
            this.gameOver();
            return;
        }
        
        // อัพเดทตำแหน่งนก
        this.bird.style.top = this.birdY + 'px';
        
        // หมุนนกตามทิศทางการเคลื่อนไหว
        const rotation = Math.min(Math.max(this.birdVelocity * 3, -30), 30);
        this.bird.style.transform = `rotate(${rotation}deg)`;
    }
    
    // อัพเดทเสา
    updatePipes() {
        const currentTime = performance.now();
        
        // สร้างเสาใหม่ตามระยะเวลาที่คำนวณใหม่
        if (currentTime - this.lastPipeTime > this.pipeInterval) {
            this.createPipe();
            this.lastPipeTime = currentTime;
        }
        
        // อัพเดทตำแหน่งเสา
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // อัพเดทตำแหน่งใน DOM
            if (pipe.topElement && pipe.bottomElement) {
                pipe.topElement.style.left = pipe.x + 'px';
                pipe.bottomElement.style.left = pipe.x + 'px';
            }
            
            // เพิ่มคะแนนเมื่อผ่านเสา
            if (!pipe.passed && pipe.x + this.pipeWidth < 80) {
                pipe.passed = true;
                this.score++;
            }
            
            // ลบเสาที่ออกจากหน้าจอ
            if (pipe.x + this.pipeWidth < 0) {
                this.removePipe(i);
            }
        }
    }
    
    // สร้างเสาใหม่
    createPipe() {
        const minHeight = 80;
        const maxHeight = this.gameHeight - this.pipeGap - 80;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        const bottomHeight = this.gameHeight - topHeight - this.pipeGap;
        
        // สร้างเสาบน
        const pipeTop = document.createElement('div');
        pipeTop.className = 'pipe pipe-top';
        pipeTop.style.height = topHeight + 'px';
        pipeTop.style.left = this.gameWidth + 'px';
        pipeTop.style.position = 'absolute';
        pipeTop.style.width = this.pipeWidth + 'px';
        pipeTop.style.background = '#228B22';
        pipeTop.style.border = '2px solid #006400';
        pipeTop.style.borderRadius = '5px';
        pipeTop.style.top = '0';
        
        // สร้างเสาล่าง
        const pipeBottom = document.createElement('div');
        pipeBottom.className = 'pipe pipe-bottom';
        pipeBottom.style.height = bottomHeight + 'px';
        pipeBottom.style.left = this.gameWidth + 'px';
        pipeBottom.style.position = 'absolute';
        pipeBottom.style.width = this.pipeWidth + 'px';
        pipeBottom.style.background = '#228B22';
        pipeBottom.style.border = '2px solid #006400';
        pipeBottom.style.borderRadius = '5px';
        pipeBottom.style.bottom = '0';
        
        // เพิ่มเสาลงใน DOM
        this.gameContainer.appendChild(pipeTop);
        this.gameContainer.appendChild(pipeBottom);
        
        // เพิ่มเสาลงใน array
        this.pipes.push({
            x: this.gameWidth,
            topHeight: topHeight,
            bottomHeight: bottomHeight,
            topElement: pipeTop,
            bottomElement: pipeBottom,
            passed: false
        });
    }
    
    // ลบเสา
    removePipe(index) {
        if (index < 0 || index >= this.pipes.length) {
            console.warn('Invalid pipe index:', index);
            return;
        }
        
        const pipe = this.pipes[index];
        if (pipe) {
            // ตรวจสอบว่า element ยังอยู่ใน DOM หรือไม่
            if (pipe.topElement && pipe.topElement.parentNode === this.gameContainer) {
                try {
                    this.gameContainer.removeChild(pipe.topElement);
                } catch (e) {
                    console.warn('Error removing top pipe:', e);
                }
            }
            
            if (pipe.bottomElement && pipe.bottomElement.parentNode === this.gameContainer) {
                try {
                    this.gameContainer.removeChild(pipe.bottomElement);
                } catch (e) {
                    console.warn('Error removing bottom pipe:', e);
                }
            }
            
            // ลบจาก array
            this.pipes.splice(index, 1);
        }
    }
    
    // ลบเสาทั้งหมด
    clearPipes() {
        // วิธีที่ 1: ลบทีละตัวแบบปลอดภัย
        this.pipes.forEach((pipe, index) => {
            if (pipe.topElement && pipe.topElement.parentNode) {
                try {
                    this.gameContainer.removeChild(pipe.topElement);
                } catch (e) {
                    console.warn('Error removing top pipe:', e);
                }
            }
            if (pipe.bottomElement && pipe.bottomElement.parentNode) {
                try {
                    this.gameContainer.removeChild(pipe.bottomElement);
                } catch (e) {
                    console.warn('Error removing bottom pipe:', e);
                }
            }
        });
        
        // วิธีที่ 2: ลบด้วย querySelectorAll (เป็นทางเลือก)
        const remainingPipes = this.gameContainer.querySelectorAll('.pipe');
        remainingPipes.forEach(pipe => {
            try {
                pipe.remove();
            } catch (e) {
                console.warn('Error removing remaining pipe:', e);
            }
        });
        
        // ล้าง array
        this.pipes = [];
    }
    
    // เพิ่มฟังก์ชัน forceCleanup() สำหรับทำความสะอาดแบบบังคับ
    forceCleanup() {
        // ยกเลิก animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // ลบเสาทั้งหมดด้วย querySelector
        const allPipes = this.gameContainer.querySelectorAll('.pipe');
        allPipes.forEach(pipe => {
            try {
                pipe.remove();
            } catch (e) {
                console.warn('Force cleanup error:', e);
            }
        });
        
        // ล้าง array
        this.pipes = [];
        
        // ลบข้อความขึ้นระดับ
        const levelUpMessages = this.gameContainer.querySelectorAll('.level-up-message');
        levelUpMessages.forEach(msg => msg.remove());
        
        // ล้างเมฆถ้ามี
        const clouds = this.gameContainer.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            try {
                cloud.remove();
            } catch (e) {
                console.warn('Error removing cloud:', e);
            }
        });
    }
    
    // ตรวจสอบการชน
    checkCollisions() {
        const birdRect = {
            x: 80,
            y: this.birdY,
            width: 30,
            height: 22
        };
        
        // ตรวจสอบการชนกับเสาแต่ละต้น
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            
            // เสาบน
            const topPipeRect = {
                x: pipe.x,
                y: 0,
                width: this.pipeWidth,
                height: pipe.topHeight
            };
            
            // เสาล่าง
            const bottomPipeRect = {
                x: pipe.x,
                y: this.gameHeight - pipe.bottomHeight,
                width: this.pipeWidth,
                height: pipe.bottomHeight
            };
            
            // ตรวจสอบการชน
            if (this.isColliding(birdRect, topPipeRect) || 
                this.isColliding(birdRect, bottomPipeRect)) {
                this.gameOver();
                return;
            }
        }
    }
    
    // ตรวจสอบการชนระหว่าง 2 สี่เหลี่ยม
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // อัพเดทคะแนน
    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = `คะแนน: ${this.score} | ระดับ: ${this.currentLevel}`;
        }
    }
    
    // จบเกม
    gameOver() {
        this.gameRunning = false;
        
        // ยกเลิก animation loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // เอฟเฟกต์การสั่นสะเทือน
        this.gameContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.gameContainer.style.animation = '';
        }, 500);
        
        // อัพเดทคะแนนสูงสุด
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
        }
        
        // แสดงข้อมูลคะแนน
        if (this.finalScoreElement) {
            this.finalScoreElement.innerHTML = `
                <div>คะแนนของคุณ: ${this.score}</div>
                <div>ระดับสูงสุด: ${this.currentLevel}</div>
                <div>คะแนนสูงสุด: ${this.bestScore}</div>
            `;
        }
        
        // แสดงหน้าจอเกมโอเวอร์
        setTimeout(() => {
            if (this.gameOverElement) {
                this.gameOverElement.style.display = 'block';
            }
        }, 500);
    }
    
    // สร้างเมฆ
    createClouds() {
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.position = 'absolute';
            cloud.style.width = Math.random() * 60 + 30 + 'px';
            cloud.style.height = Math.random() * 20 + 15 + 'px';
            cloud.style.top = Math.random() * 100 + 20 + 'px';
            cloud.style.left = Math.random() * this.gameWidth + 'px';
            cloud.style.background = 'white';
            cloud.style.borderRadius = '50px';
            cloud.style.opacity = '0.8';
            cloud.style.pointerEvents = 'none';
            this.gameContainer.appendChild(cloud);
        }
    }
    
    // ฟังก์ชัน debug สำหรับตรวจสอบสถานะ
    debugGameState() {
        console.log('=== Game Debug Info ===');
        console.log('Score:', this.score);
        console.log('Level:', this.currentLevel);
        console.log('Difficulty Settings:', {
            gravity: this.gravity,
            pipeSpeed: this.pipeSpeed,
            pipeGap: this.pipeGap,
            pipeInterval: this.pipeInterval,
            pipeWidth: this.pipeWidth
        });
        console.log('Pipes in array:', this.pipes.length);
        console.log('Pipes in DOM:', this.gameContainer.querySelectorAll('.pipe').length);
        console.log('Game running:', this.gameRunning);
        console.log('Animation ID:', this.animationId);
    }
}

// เริ่มเกมเมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบว่ามีองค์ประกอบเกมอยู่หรือไม่
    if (document.getElementById('gameContainer')) {
        new FlappyBirdGame();
    }
});

// เพิ่มสไตล์ CSS สำหรับเอฟเฟกต์เสริม
const additionalStyles = `
    .pipe {
        z-index: 5;
        transition: width 0.3s ease;
    }
    
    .cloud {
        animation: float 20s infinite linear;
    }
    
    @keyframes float {
        0% { transform: translateX(-100px); }
        100% { transform: translateX(calc(100vw + 100px)); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes levelUpPulse {
        0% { 
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    .level-up-message {
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        font-family: 'Arial', sans-serif;
        pointer-events: none;
    }
    
    .level-up-message div:first-child {
        font-size: 24px;
        margin-bottom: 5px;
    }
    
    .level-up-message div:last-child {
        font-size: 16px;
        opacity: 0.9;
    }
`;

// เพิ่มสไตล์ลงใน head
if (document.head) {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}