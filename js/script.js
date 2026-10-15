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

    // Contact Form Handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const fullName = document.getElementById('fullName').value;
            const company = document.getElementById('company').value || 'No especificada';
            const docType = document.getElementById('docType').value;
            const docNumber = document.getElementById('docNumber').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const serviceType = document.getElementById('serviceType').value;
            const details = document.getElementById('details').value;

            // Construct WhatsApp message
            const message = `*Nueva Solicitud de Cotización Técnica* ⚡%0A%0A` +
                            `*Cliente:* ${encodeURIComponent(fullName)}%0A` +
                            `*Empresa:* ${encodeURIComponent(company)}%0A` +
                            `*Documento:* ${encodeURIComponent(docType)} ${encodeURIComponent(docNumber)}%0A` +
                            `*Teléfono:* ${encodeURIComponent(phone)}%0A` +
                            `*Correo:* ${encodeURIComponent(email)}%0A` +
                            `*Servicio:* ${encodeURIComponent(serviceType)}%0A%0A` +
                            `*Detalles del requerimiento:*%0A${encodeURIComponent(details)}`;

            // WhatsApp API link (Number: 51935808480)
            const whatsappUrl = `https://wa.me/51935808480?text=${message}`;

            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');

            // Optional: Reset form
            contactForm.reset();
        });
    }
});
