// Инициализация canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorEffect = document.querySelector('.cursor-effect');

// Установка размеров canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Переменные для хранения позиции мыши
let mouseX = 0;
let mouseY = 0;

// Класс для частиц
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500 + 500; // Глубина для 3D эффекта
        this.size = Math.random() * 1.5 + 0.5; // Уменьшил размер для мобильных
        this.speedX = Math.random() * 0.4 - 0.2; // Уменьшил скорость
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }
    
    update() {
        // Движение частиц
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Отскок от границ
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // Влияние мыши на частицы (только на десктопе)
        if (!isMobileDevice()) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x += dx / distance * 2;
                this.y += dy / distance * 2;
            }
        }
    }
    
    draw() {
        // Рисование частицы с учётом глубины
        const scale = 1000 / (this.z + 500);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = this.size * scale;
        
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Сохранение 2D координат для соединения линиями
        this.x2d = x2d;
        this.y2d = y2d;
    }
}

// Функция для проверки мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Создание массива частиц (меньше частиц для мобильных)
const particleCount = isMobileDevice() ? 80 : 150;
const particles = [];
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Функция для соединения частиц линиями
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x2d - particles[j].x2d;
            const dy = particles[i].y2d - particles[j].y2d;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                // Прозрачность линии зависит от расстояния
                const opacity = 1 - distance / 100;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`; // Уменьшил прозрачность
                ctx.lineWidth = 0.5; // Уменьшил толщину
                ctx.moveTo(particles[i].x2d, particles[i].y2d);
                ctx.lineTo(particles[j].x2d, particles[j].y2d);
                ctx.stroke();
            }
        }
    }
}

// Анимация
function animate() {
    // Очистка canvas с добавлением эффекта размытия
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновление и отрисовка частиц
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Соединение частиц линиями
    connectParticles();
    
    requestAnimationFrame(animate);
}

// Обработчики событий мыши (только для десктопа)
if (!isMobileDevice()) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Обновление позиции эффекта курсора
        if (cursorEffect) {
            cursorEffect.style.left = `${mouseX}px`;
            cursorEffect.style.top = `${mouseY}px`;
        }
    });
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Запуск анимации
animate();

// Добавление случайных вспышек (только для десктопа)
if (!isMobileDevice()) {
    setInterval(() => {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.width = Math.random() * 80 + 40 + 'px';
        flash.style.height = Math.random() * 80 + 40 + 'px';
        flash.style.borderRadius = '50%';
        flash.style.background = 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)';
        flash.style.left = Math.random() * window.innerWidth + 'px';
        flash.style.top = Math.random() * window.innerHeight + 'px';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '0';
        flash.style.animation = 'flash 1s ease-out forwards';
        
        document.body.appendChild(flash);
        
        // Удаление вспышки после анимации
        setTimeout(() => {
            if (flash.parentNode) {
                document.body.removeChild(flash);
            }
        }, 1000);
    }, 1500); // Увеличил интервал между вспышками
}