/**
 * ElectroFlash-Perú E.I.R.L.
 * Core Client Logic & Technical Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Mobile Menu Controller
    // -------------------------------------------------------------
    const menuBtn = document.querySelector('#mobile-menu-btn');
    const closeMenu = document.querySelector('#close-menu');
    const mobileMenu = document.querySelector('#mobile-menu');

    const toggleMenu = () => {
        if (!mobileMenu) return;
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', String(!isOpen));
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = '';
                if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Close on resize if exceeding mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = '';
        }
    });

    // -------------------------------------------------------------
    // 2. Smooth Scroll for Anchor Links (with Header Offset)
    // -------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = 72;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -------------------------------------------------------------
    // 3. Scroll Reveal via Intersection Observer
    // -------------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // -------------------------------------------------------------
    // 4. Active Navigation State on Scroll
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const updateActiveNav = () => {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('text-primary', 'font-bold');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // -------------------------------------------------------------
    // 5. Technical Quote Form Processing -> WhatsApp API
    // -------------------------------------------------------------
    const quoteForm = document.querySelector('#quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

            // Retrieve and sanitize inputs
            const fullName = document.getElementById('fullName')?.value.trim() || '';
            const company = document.getElementById('company')?.value.trim() || 'Particular / No especificada';
            const docType = document.getElementById('docType')?.value || '';
            const docNumber = document.getElementById('docNumber')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const serviceTypeSelect = document.getElementById('serviceType');
            const serviceTypeName = serviceTypeSelect ? serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text : '';
            const details = document.getElementById('details')?.value.trim() || '';

            // Formatting message for WhatsApp
            const message = 
                `*⚡ SOLICITUD DE COTIZACIÓN TÉCNICA - ELECTROFLASH*%0A` +
                `━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
                `*👤 Cliente:* ${encodeURIComponent(fullName)}%0A` +
                `*🏢 Empresa:* ${encodeURIComponent(company)}%0A` +
                `*📑 Documento:* ${encodeURIComponent(docType.toUpperCase())} ${encodeURIComponent(docNumber)}%0A` +
                `*📱 Teléfono:* ${encodeURIComponent(phone)}%0A` +
                `*✉️ Correo:* ${encodeURIComponent(email)}%0A` +
                `*🔧 Área de Servicio:* ${encodeURIComponent(serviceTypeName)}%0A` +
                `━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
                `*📝 Especificaciones del Requerimiento:*%0A` +
                `${encodeURIComponent(details)}%0A%0A` +
                `_Enviado desde portal web electroflash.pe_`;

            // Official corporate WhatsApp line (+51 935 808 480)
            const whatsappUrl = `https://wa.me/51935808480?text=${message}`;

            // Visual feedback on button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="relative z-10 font-bold flex items-center gap-2">
                        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Redirigiendo a WhatsApp...
                    </span>
                `;
            }

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
                quoteForm.reset();
            }, 600);
        });
    }
});
