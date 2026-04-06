/* scripts.js */

// ===== CURSOR PERSONALIZADO =====
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// ===== MENÚ MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger de elementos del mismo padre
            const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
            let delay = 0;
            siblings.forEach(el => {
                if (el === entry.target) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                }
            });
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach((el, i) => {
    // Agregar delays escalonados para elementos dentro de grillas
    const parent = el.parentElement;
    const siblings = Array.from(parent.querySelectorAll('.reveal'));
    const index = siblings.indexOf(el);
    el.style.transitionDelay = `${index * 0.07}s`;
    observer.observe(el);
});

// ===== CARRUSELES =====
document.querySelectorAll('.carrusel-contenedor').forEach((contenedor) => {
    const carrusel = contenedor.querySelector('.carrusel');
    const images = carrusel.querySelectorAll('img');
    const prevBtn = contenedor.querySelector('.left-btn');
    const nextBtn = contenedor.querySelector('.right-btn');
    const dotsContainer = contenedor.querySelector('.carrusel-dots');

    if (images.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    let index = 0;

    // Crear dots
    if (dotsContainer) {
        images.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carrusel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.carrusel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    function goTo(n) {
        index = (n + images.length) % images.length;
        carrusel.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    // Auto-play cada 4 segundos
    let autoPlay = setInterval(() => goTo(index + 1), 4000);
    contenedor.addEventListener('mouseenter', () => clearInterval(autoPlay));
    contenedor.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goTo(index + 1), 4000);
    });

    // Swipe táctil
    let touchStartX = 0;
    contenedor.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    contenedor.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
            goTo(diff > 0 ? index + 1 : index - 1);
        }
    }, { passive: true });
});

// ===== SMOOTH SCROLL para nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== NAV LINK ACTIVO =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.style.color = 'var(--accent)';
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
