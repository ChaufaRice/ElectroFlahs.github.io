document.addEventListener('DOMContentLoaded', () => {
    // Hero Background Slider
    const heroBg = document.getElementById('hero-bg');
    const heroImages = [
        'img/works/WhatsApp Image 2026-09-04 at 7.24.35 PM.jpeg',
        'img/works/WhatsApp Image 2026-09-04 at 7.24.34 PM.jpeg',
        'img/works/WhatsApp Image 2026-09-04 at 5.38.54 PM.jpeg',
        'img/works/WhatsApp Image 2026-09-03 at 3.16.38 PM.jpeg',
        'img/works/WhatsApp Image 2026-09-02 at 9.54.35 AM.jpeg',
        'img/works/WhatsApp Image 2026-09-02 at 7.59.25 PM.jpeg',
        'img/works/WhatsApp Image 2026-09-01 at 10.08.23 AM.jpeg',
        'img/works/2.jpeg',
        'img/works/1.jpeg'
    ];
    let currentImageIndex = 0;

    const changeHeroImage = () => {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        // Efecto de transición simple: desvanecer y cambiar
        heroBg.style.opacity = '0.4';
        setTimeout(() => {
            heroBg.style.backgroundImage = `url("${heroImages[currentImageIndex]}")`;
            heroBg.style.opacity = '0.8';
        }, 500);
    };

    if (heroBg) {
        setInterval(changeHeroImage, 5000); // Cambia cada 5 segundos
    }

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('#mobile-menu-btn');

    const closeMenu = document.querySelector('#close-menu');
    const mobileMenu = document.querySelector('#mobile-menu');

    const toggleMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple Animation on Scroll using Intersection Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });

    // Handle File Selection Display
    const attachmentsInput = document.getElementById('attachments');
    if (attachmentsInput) {
        attachmentsInput.addEventListener('change', function(e) {
            const fileList = document.getElementById('file-list');
            const files = e.target.files;
            if (files && files.length > 0) {
                const names = Array.from(files).map(f => f.name).join(', ');
                if (fileList) fileList.innerHTML = `Archivos seleccionados: ${names}`;
            } else if (fileList) {
                fileList.innerHTML = '';
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Se elimina e.preventDefault() para permitir el envío al archivo enviar.php
        });
    }
});
