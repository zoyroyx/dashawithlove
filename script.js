gsap.registerPlugin(ScrollTrigger);

// 1. Кастомный курсор, плавно следующий за мышью
const cursor = document.querySelector('.cursor-follower');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    gsap.set(cursor, { x: cursorX, y: cursorY });
});

// 2. Анимация появления главного экрана
const heroTl = gsap.timeline();

heroTl.to('.title', {
    y: 0,
    opacity: 1,
    duration: 2,
    ease: "power4.out",
    delay: 0.5
})
.to('.subtitle', {
    opacity: 1,
    y: -15,
    duration: 1.5,
    ease: "power2.out"
}, "-=1.5")
.to('.scroll-indicator', {
    opacity: 1,
    duration: 1.5
}, "-=1");

// Прыгающая стрелочка вниз
gsap.to('.arrow', {
    y: 15,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    duration: 1.2
});

// 3. Плавающие сердечки на фоне
const heartsContainer = document.getElementById('hearts-container');
const colors = ['#ff2a55', '#ff8fa3', '#ff4d6d', '#c9184a', '#ff003c'];

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Случайный цвет из палитры
    const color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.setProperty('--heart-color', color);
    
    // Старт внизу экрана
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    heart.style.top = `${window.innerHeight + 50}px`;
    
    heartsContainer.appendChild(heart);

    // Случайный размер
    const scale = Math.random() * 0.6 + 0.2;

    // Анимация полета вверх с покачиванием
    gsap.to(heart, {
        y: -window.innerHeight - 150,
        x: startX + (Math.random() - 0.5) * 300,
        rotation: (Math.random() - 0.5) * 180 - 45,
        opacity: Math.random() * 0.5 + 0.2,
        scale: scale,
        duration: Math.random() * 6 + 6,
        ease: "none",
        onComplete: () => {
            heart.remove();
        }
    });
}

// Запускаем появление сердечек каждые 400мс
setInterval(createFloatingHeart, 400);

// 4. Интерактив: взрыв сердечек по клику
document.addEventListener('click', (e) => {
    // Создаем от 5 до 10 сердечек при клике
    const count = Math.floor(Math.random() * 6) + 5;
    
    for(let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.setProperty('--heart-color', color);
        
        // Позиция клика
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heartsContainer.appendChild(heart);

        // Начальное состояние для взрыва
        gsap.set(heart, { scale: 0, opacity: 1, xPercent: -50, yPercent: -50 });
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 50;

        gsap.to(heart, {
            x: `+=${Math.cos(angle) * velocity}`,
            y: `+=${Math.sin(angle) * velocity - 100}`, // Слегка направляем вверх
            scale: Math.random() * 0.8 + 0.4,
            opacity: 0,
            rotation: Math.random() * 360,
            duration: Math.random() * 1.5 + 0.5,
            ease: "power3.out",
            onComplete: () => heart.remove()
        });
    }
});

// 5. ScrollTrigger: Эффект параллакса для первого экрана
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    y: 250,
    opacity: 0,
    scale: 0.9
});

// 6. ScrollTrigger: Появление текста по строкам во втором блоке
const texts = gsap.utils.toArray('.reveal-text');

texts.forEach((text, i) => {
    gsap.to(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 1, // Привязка к скроллу для плавности
        },
        opacity: 1,
        y: 0,
        ease: "power2.out"
    });
});

// 7. Infinite Scroll - Бесконечная генерация признаний
const phrases = [
    "Каждая секунда с тобой — это счастье.",
    "Твои глаза — океан, в котором я готов утонуть.",
    "Ты делаешь меня лучше каждый день.",
    "Без тебя этот мир был бы таким тусклым.",
    "Моя любовь к тебе не имеет границ.",
    "Я хочу провести с тобой всю свою жизнь.",
    "Ты моя муза, мое вдохновение.",
    "С тобой даже простые вещи становятся волшебными.",
    "Ты — самый яркий свет в моей жизни.",
    "Я не устану повторять: я люблю тебя.",
    "Твой голос звучит как самая красивая мелодия.",
    "Мое сердце бьется чаще, когда ты рядом.",
    "Ты — та, о ком я всегда мечтал.",
    "Моя нежность к тебе бесконечна.",
    "Ты — мой дом, где бы мы ни были."
];

const messageContainer = document.getElementById('message-container');
let isGenerating = false;

// Эдлибы по бокам
const adlibWords = ["всегда", "постоянно", "ежесекундно", "бесконечно", "вечно", "каждый миг", "навсегда", "безгранично", "искренне", "безумно"];

function createAdlib(yPosition) {
    const adlib = document.createElement('div');
    adlib.classList.add('adlib');
    adlib.textContent = adlibWords[Math.floor(Math.random() * adlibWords.length)];
    
    // Слева или справа
    if (Math.random() > 0.5) {
        adlib.style.left = `${Math.random() * 15 + 2}%`; // от 2% до 17%
    } else {
        adlib.style.right = `${Math.random() * 15 + 2}%`;
    }

    adlib.style.top = `${yPosition}px`;
    adlib.style.fontSize = `${Math.random() * 2 + 1}rem`; // 1rem - 3rem
    adlib.style.opacity = Math.random() * 0.4 + 0.1; // 0.1 - 0.5
    
    document.querySelector('.message-section').appendChild(adlib);

    // Параллакс эффект для эдлиба
    gsap.fromTo(adlib, 
        { y: 50 },
        {
            scrollTrigger: {
                trigger: adlib,
                start: "top 100%",
                end: "bottom 0%",
                scrub: 1
            },
            y: -200 * (Math.random() + 0.5),
            rotation: (Math.random() - 0.5) * 40,
            ease: "none"
        }
    );
}

// Создаем стартовые эдлибы для первого контента
setTimeout(() => {
    const sectionHeight = document.querySelector('.message-section').offsetHeight;
    for(let i = 0; i < 8; i++) {
        createAdlib(300 + Math.random() * (sectionHeight - 500));
    }
}, 500);

function generateNewConfession() {
    const p = document.createElement('p');
    p.classList.add('reveal-text');
    p.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Иногда делаем текст акцентным
    if (Math.random() > 0.8) {
        p.classList.add('highlight');
    }

    messageContainer.appendChild(p);

    // Создаем эдлибы рядом с новым текстом
    const currentHeight = document.querySelector('.message-section').offsetHeight;
    createAdlib(currentHeight - 200 + Math.random() * 300);
    if (Math.random() > 0.4) {
        createAdlib(currentHeight - 100 + Math.random() * 300);
    }

    // Создаем ScrollTrigger для нового элемента
    gsap.fromTo(p, 
        { opacity: 0.1, y: 40 },
        {
            scrollTrigger: {
                trigger: p,
                start: "top 85%",
                end: "bottom 40%",
                scrub: 1,
            },
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }
    );
}

// Генерируем новые признания при приближении к концу страницы
window.addEventListener('scroll', () => {
    // Если до конца документа осталось меньше 1000px
    if (!isGenerating && window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        isGenerating = true;
        
        // Генерируем несколько новых фраз
        for(let i=0; i<3; i++) {
            generateNewConfession();
        }
        
        // Небольшая задержка перед следующей генерацией
        setTimeout(() => {
            isGenerating = false;
        }, 100);
    }
});
