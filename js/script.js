document.addEventListener('DOMContentLoaded', () => {
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
