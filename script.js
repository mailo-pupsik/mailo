// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Плавный скролл к основному контенту
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", function () {
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
            });
        });
    }

    // Скролл по колесику мыши
    window.addEventListener("wheel", function (e) {
        if (window.scrollY === 0 && e.deltaY > 0) {
            // Если вверху страницы и скроллим вниз - плавный переход
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
            });
        }
    });

    // Анимация при загрузке страницы
    const title = document.querySelector(".title");
    const subtitle = document.querySelector(".subtitle");
    const motto = document.querySelector(".motto");
    
    title.style.opacity = "0";
    subtitle.style.opacity = "0";
    motto.style.opacity = "0";
    
    setTimeout(() => {
        title.style.transition = "opacity 1s ease";
        title.style.opacity = "1";
    }, 200);
    
    setTimeout(() => {
        subtitle.style.transition = "opacity 1s ease";
        subtitle.style.opacity = "1";
    }, 600);
    
    setTimeout(() => {
        motto.style.transition = "opacity 1s ease";
        motto.style.opacity = "1";
    }, 1000);

    // Функция создания частиц для карточек
    function createCardParticles(clientX, clientY) {
        const particleCount = 20;
        const sizeRange = [3, 8];

        // Цветовая палитра для частиц
        const colorPalette = [
            "rgba(106, 17, 203, 0.9)", // Основной фиолетовый
            "rgba(37, 117, 252, 0.9)", // Основной синий
            "rgba(147, 51, 234, 0.9)", // Яркий фиолетовый
            "rgba(59, 130, 246, 0.9)", // Яркий синий
            "rgba(168, 85, 247, 0.9)", // Светлый фиолетовый
        ];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";

            // Случайный размер частицы
            const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Случайное направление и расстояние
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty("--tx", `${tx}px`);
            particle.style.setProperty("--ty", `${ty}px`);

            // Позиционирование
            particle.style.left = `${clientX - size / 2}px`;
            particle.style.top = `${clientY - size / 2}px`;

            // Случайный цвет
            const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            particle.style.background = randomColor;

            // Разная форма
            if (Math.random() > 0.7) {
                particle.style.borderRadius = "30%";
            }

            // Случайная задержка и продолжительность анимации
            const delay = Math.random() * 0.4;
            const duration = 1 + Math.random() * 0.5;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;

            document.body.appendChild(particle);

            // Удаляем частицу после анимации
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }
    }

    // Добавляем обработчики для карточек
    const glassCards = document.querySelectorAll(".glass-card");
    glassCards.forEach((card) => {
        card.addEventListener("click", function (e) {
            createCardParticles(e.clientX, e.clientY);
        });
    });

    // Добавляем обработчики для фактов
    const factCards = document.querySelectorAll(".fact-card");
    factCards.forEach((card) => {
        card.addEventListener("click", function (e) {
            createCardParticles(e.clientX, e.clientY);
        });
    });

    // Добавляем обработчики для feature items
    const featureItems = document.querySelectorAll(".feature-item");
    featureItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            createCardParticles(e.clientX, e.clientY);
        });
    });

    // Добавляем CSS для частиц
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: fixed;
            pointer-events: none;
            border-radius: 50%;
            animation: particle-float 1.5s ease-out forwards;
            z-index: 10000;
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
        }
        
        @keyframes particle-float {
            0% {
                transform: translate(0, 0) scale(1) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});