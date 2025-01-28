class Firework {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height;
        this.targetY = y;
        this.speed = 25;
        this.particles = [];
        this.colors = [
            '#ffb6c1', // 浅粉红
            '#ff69b4', // 热粉红
            '#ff91af', // 中等粉红
            '#ffc0cb', // 粉红
            '#ffffff'  // 白色
        ];
        this.trail = []; // 添加尾迹数组
        this.trailLength = 15; // 增加尾迹长度
    }

    update() {
        if (this.y > this.targetY) {
            // 添加尾迹点
            this.trail.push({
                x: this.x,
                y: this.y,
                alpha: 1
            });
            
            // 限制尾迹长度
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }
            
            this.y -= this.speed;
            
            // 增加上升过程中的火花数量
            if (Math.random() < 0.5) { // 增加到50%的概率产生火花
                for (let i = 0; i < 3; i++) { // 每次产生3个火花
                    particles.push({
                        x: this.x + (Math.random() - 0.5) * 3,
                        y: this.y + (Math.random() - 0.5) * 3,
                        vx: (Math.random() - 0.5) * 3,
                        vy: Math.random() * 3 - 1,
                        color: '#ffb6c1',
                        alpha: 1,
                        size: 1.5,
                        isTrail: true
                    });
                }
            }
        } else {
            this.explode();
            return false;
        }
        return true;
    }

    draw() {
        // 绘制尾迹
        this.trail.forEach((point, index) => {
            const alpha = index / this.trail.length;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fill();
        });

        // 绘制烟花主体
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
    }

    explode() {
        const particleCount = 120; // 减少粒子数量以提高性能
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const velocity = 6 + Math.random() * 4;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            // 改为圆形扩散
            particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: color,
                alpha: 1,
                size: 1.2 + Math.random() * 1.8
            });
        }
    }
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    // 使用 clearRect 替代 fillRect 提高性能
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'rgb(255, 192, 203)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // 限制同时存在的烟花数量
    if (fireworks.length > 5) {
        fireworks = fireworks.slice(-5);
    }

    // 限制同时存在的粒子数量
    if (particles.length > 1000) {
        particles = particles.slice(-1000);
    }

    fireworks = fireworks.filter(firework => {
        firework.draw();
        return firework.update();
    });

    particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.isTrail) {
            particle.vy += 0.05;
            particle.alpha -= 0.05;
            particle.size *= 0.96;
        } else {
            particle.vy += 0.1;
            particle.alpha -= 0.02;
            particle.vx *= 0.99; // 添加空气阻力
            particle.vy *= 0.99;
        }

        // 减少阴影计算以提高性能
        if (!particle.isTrail && particle.alpha > 0.5) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        return particle.alpha > 0;
    });

    requestAnimationFrame(animate);
}

// 添加点击冷却时间
let lastClickTime = 0;
let clickCount = 0;
const messages = [
    "2025年，我们依旧是好朋友，希望你能开心快乐又一年，一直做个可爱的小朋友！\n",
    "与旧事归于尽,来年依旧迎花开是结束,也是开始我的朋友，万事胜意\n",
    "2025，请在身体平安的基础越来越快乐吧！暴富！平安！幸运！全都属于你！\n",
    "此去经年，朝暮与岁月并往，去岁无憾，守护我们一同行至天光。\n",
    "不说新年快乐，但祝福大家在自己的入生里依然勇敢常保平安\n",
    "长路浩浩荡荡，万物皆可期待，愿我们的2025，所求皆如愿，所行皆坦途，多喜乐，长安宁。\n",
    "凡是过往皆为序章，所有未来皆有可盼，保持热爱，奔赴下一个山海。\n",
    "亲爱的好朋友，岁末已至，平安喜乐，新的一年要开始啦！多喜乐，长安宁。旧年好，新年更好。\n",
    "零点的烟花 开启下一个四季，祝我们：年复一年 年赴一年 年富一年\n",
    "元旦快乐！今年有太多太多的期许，希望我们的愿望都实现，所有美好都降临！\n",
    "但愿在新的一年里，我们能远离一切古怪的事，大家都能做个健全的人。"
].join("");

function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.style.display = 'block';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

document.getElementById('launchBtn').addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClickTime < 200) return;
    lastClickTime = now;

    clickCount++;
    
    const leftX = Math.random() * (canvas.width * 0.4);
    const rightX = canvas.width * 0.6 + Math.random() * (canvas.width * 0.4);
    const y = canvas.height * 0.3 + Math.random() * (canvas.height * 0.2);

    fireworks.push(new Firework(canvas, leftX, y));
    fireworks.push(new Firework(canvas, rightX, y));

    // 在第17次点击后显示消息
    if (clickCount === 17) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = ''; // 清空之前的内容
        typeWriter(messages, messageElement, 100); // 100ms 每个字符
    }
});

// 修改背景颜色为粉色
document.body.style.backgroundColor = '#ffd1dc';

animate(); 