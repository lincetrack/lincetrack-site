// ================================
// NAVEGAÇÃO E SCROLL
// ================================

// Elementos
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

// Menu mobile toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animação do hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Fechar menu ao clicar em link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        // Reset hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        backToTop.classList.add('show');
    } else {
        header.classList.remove('scrolled');
        backToTop.classList.remove('show');
    }

    // Active nav link
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= (sectionTop - header.offsetHeight - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Back to top
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ================================
// FORMULÁRIO DE CONTATO
// ================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Pegar valores do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;

    // Criar mensagem para WhatsApp
    const whatsappMessage = `
*Nova mensagem do site Lince Track*

*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}
*Assunto:* ${assunto}

*Mensagem:*
${mensagem}
    `.trim();

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Redirecionar para WhatsApp
    window.open(`https://wa.me/5544997003426?text=${encodedMessage}`, '_blank');

    // Limpar formulário
    contactForm.reset();

    // Mostrar confirmação
    showNotification('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
});

// ================================
// ANIMAÇÕES AO SCROLL
// ================================

// Observador de interseção para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos para animar
const animateElements = document.querySelectorAll(`
    .servico-card,
    .plano-card,
    .feature-item,
    .info-card,
    .app-feature
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ================================
// CONTADOR DE NÚMEROS (STATS)
// ================================

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

// Observador para contadores
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, 0, target, 2000);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ================================
// VALIDAÇÃO DE FORMULÁRIO
// ================================

// Validação em tempo real
const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateInput(input);
        }
    });
});

function validateInput(input) {
    const value = input.value.trim();

    // Remover classes anteriores
    input.classList.remove('valid', 'invalid');

    // Validação básica
    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        return false;
    }

    // Validação de e-mail
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }

    // Validação de telefone
    if (input.type === 'tel') {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (value.length < 10 || !phoneRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }

    input.classList.add('valid');
    return true;
}

// ================================
// MÁSCARAS DE ENTRADA
// ================================

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            }
        }

        e.target.value = value;
    });
}

// ================================
// SISTEMA DE NOTIFICAÇÕES
// ================================

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Adicionar estilos se não existirem
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                z-index: 9999;
                min-width: 300px;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .notification-success {
                border-left: 4px solid #2DD4BF;
            }

            .notification-success i {
                color: #2DD4BF;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #94A3B8;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                color: #1E3A5F;
            }
        `;
        document.head.appendChild(style);
    }

    // Adicionar ao body
    document.body.appendChild(notification);

    // Fechar ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ================================
// LAZY LOADING DE IMAGENS
// ================================

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ================================
// PREVENÇÃO DE SCROLL HORIZONTAL
// ================================

function preventHorizontalScroll() {
    const body = document.body;
    const html = document.documentElement;

    const scrollBarWidth = window.innerWidth - html.clientWidth;

    if (scrollBarWidth > 0) {
        body.style.overflowX = 'hidden';
        html.style.overflowX = 'hidden';
    }
}

preventHorizontalScroll();
window.addEventListener('resize', preventHorizontalScroll);

// ================================
// PERFORMANCE: Debounce para eventos de scroll/resize
// ================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce aos eventos de scroll
const debouncedScroll = debounce(() => {
    // Código de scroll otimizado já implementado acima
}, 10);

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Lince Track - Site carregado com sucesso!');

    // Adicionar classe para animações iniciais
    document.body.classList.add('loaded');

    // Verificar se há hash na URL e fazer scroll suave
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// ================================
// EASTER EGG: Detectar Konami Code
// ================================

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        showNotification('Código Konami ativado! Você desbloqueou o modo Lince! 🐆', 'success');
        document.body.style.filter = 'hue-rotate(45deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
    }
});
