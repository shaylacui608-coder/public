// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 获取控制按钮
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// 动画状态
let animationId;
let isRunning = false;

// 矩形边界
const rect = {
    x: 50,
    y: 50,
    width: canvas.width - 100,
    height: canvas.height - 100
};

// 球类
class Ball {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx; // x方向速度
        this.vy = vy; // y方向速度
        this.radius = radius;
        this.color = color;
    }
    
    // 更新球的位置
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // 检查与矩形边界的碰撞
        if (this.x - this.radius <= rect.x || this.x + this.radius >= rect.x + rect.width) {
            this.vx = -this.vx;
            // 确保球不会卡在边界内
            if (this.x - this.radius <= rect.x) {
                this.x = rect.x + this.radius;
            } else {
                this.x = rect.x + rect.width - this.radius;
            }
        }
        
        if (this.y - this.radius <= rect.y || this.y + this.radius >= rect.y + rect.height) {
            this.vy = -this.vy;
            // 确保球不会卡在边界内
            if (this.y - this.radius <= rect.y) {
                this.y = rect.y + this.radius;
            } else {
                this.y = rect.y + rect.height - this.radius;
            }
        }
    }
    
    // 绘制球
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加高光效果
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }
}

// 创建球数组
const balls = [
    new Ball(200, 150, 3, 2, 20, '#FF69B4'), // 亮粉色
    new Ball(300, 200, -2, 3, 18, '#00BFFF'), // 亮蓝色
    new Ball(400, 180, 2, -2, 22, '#32CD32'), // 亮绿色
    new Ball(150, 250, -3, -1, 16, '#FF69B4'), // 另一个粉色球
    new Ball(350, 120, 1, 4, 19, '#00BFFF'), // 另一个蓝色球
    new Ball(250, 300, 4, -3, 21, '#32CD32')  // 另一个绿色球
];

// 绘制矩形边界
function drawRect() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // 添加内部阴影效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

// 动画循环
function animate() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f8ff');
    gradient.addColorStop(1, '#e6f3ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制矩形
    drawRect();
    
    // 更新和绘制所有球
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    
    // 继续动画
    if (isRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

// 开始动画
function startAnimation() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        animate();
    }
}

// 暂停动画
function pauseAnimation() {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// 重置动画
function resetAnimation() {
    pauseAnimation();
    
    // 重置球的位置和速度
    balls.forEach((ball, index) => {
        ball.x = rect.x + Math.random() * rect.width;
        ball.y = rect.y + Math.random() * rect.height;
        ball.vx = (Math.random() - 0.5) * 6;
        ball.vy = (Math.random() - 0.5) * 6;
    });
    
    // 重绘一次
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f8ff');
    gradient.addColorStop(1, '#e6f3ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawRect();
    balls.forEach(ball => ball.draw());
}

// 事件监听器
startBtn.addEventListener('click', startAnimation);
pauseBtn.addEventListener('click', pauseAnimation);
resetBtn.addEventListener('click', resetAnimation);

// 初始绘制
resetAnimation();
