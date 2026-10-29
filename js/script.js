/**
 * ElectroFlash-Perú | Apple / iOS Interactive Experience Script
 */
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. Hero Background Slider with Smooth Fade
    // =========================================================================
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
        if (!heroBg) return;
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        heroBg.style.opacity = '0.3';
        setTimeout(() => {
            heroBg.style.backgroundImage = `url("${heroImages[currentImageIndex]}")`;
            heroBg.style.opacity = '1';
        }, 400);
    };

    if (heroBg) {
        setInterval(changeHeroImage, 5500);
    }

    // =========================================================================
    // 2. iOS Segmented Control for Service Filtering
    // =========================================================================
    const segmentedButtons = document.querySelectorAll('.segmented-control-item');
    const serviceCards = document.querySelectorAll('.service-card');

    if (segmentedButtons.length > 0 && serviceCards.length > 0) {
        segmentedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                segmentedButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // =========================================================================
    // 3. Apple Lightbox Modal for Portfolio Showcase
    // =========================================================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClient = document.getElementById('lightbox-client');
    const lightboxCategory = document.getElementById('lightbox-category');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    if (lightbox) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.getAttribute('data-img');
                const title = item.getAttribute('data-title');
                const client = item.getAttribute('data-client');
                const cat = item.getAttribute('data-category');

                if (lightboxImg) lightboxImg.src = img;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxClient) lightboxClient.textContent = `Cliente: ${client}`;
                if (lightboxCategory) lightboxCategory.textContent = cat;

                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

    // =========================================================================
    // 4. File Selection with iOS Style Previews
    // =========================================================================
    const attachmentsInput = document.getElementById('attachments');
    const fileListContainer = document.getElementById('file-list');
    let selectedFiles = [];

    if (attachmentsInput && fileListContainer) {
        attachmentsInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    selectedFiles.push(file);
                }
            });
            updateFileDisplay();
            this.value = '';
        });

        function updateFileDisplay() {
            if (selectedFiles.length === 0) {
                fileListContainer.innerHTML = '';
                return;
            }

            fileListContainer.innerHTML = '<p class="text-xs font-bold text-on-surface mb-2">Archivos listos para enviar:</p>';
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2.5';

            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'flex items-center gap-3 bg-white p-2.5 rounded-xl border border-black/10 shadow-sm';

                let previewHtml = `<div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><span class="material-symbols-outlined text-lg">insert_drive_file</span></div>`;
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    previewHtml = `<img src="${url}" class="w-10 h-10 object-cover rounded-lg border border-black/10 shrink-0">`;
                }

                item.innerHTML = `
                    ${previewHtml}
                    <div class="flex-1 min-w-0">
                        <p class="truncate text-xs font-semibold text-on-surface">${file.name}</p>
                        <p class="text-[10px] text-secondary">${(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button type="button" class="w-7 h-7 rounded-full bg-black/5 hover:bg-error/10 hover:text-error text-secondary flex items-center justify-center transition-colors" data-index="${index}" title="Eliminar archivo">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                `;
                grid.appendChild(item);
            });

            fileListContainer.appendChild(grid);

            grid.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-index'), 10);
                    selectedFiles.splice(idx, 1);
                    updateFileDisplay();
                });
            });
        }

        // Form Submission with FormData
        const contactForm = document.getElementById('form-cotizacion');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                if (selectedFiles.length > 0) {
                    e.preventDefault();
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = `
                            <span class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                            <span>Enviando información...</span>
                        `;
                    }

                    const formData = new FormData(contactForm);
                    formData.delete('attachments[]');
                    selectedFiles.forEach(file => formData.append('attachments[]', file));

                    try {
                        const response = await fetch('enviar.php', { method: 'POST', body: formData });
                        if (response.ok) {
                            alert('Solicitud enviada con éxito. Nuestro equipo técnico colegiado se pondrá en contacto a la brevedad.');
                            contactForm.reset();
                            selectedFiles = [];
                            updateFileDisplay();
                        } else {
                            alert('Hubo un error al procesar el formulario en el servidor. Por favor intente más tarde.');
                        }
                    } catch (error) {
                        alert('Error de conexión al enviar el formulario. Verifique su conexión a internet.');
                    } finally {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnContent;
                        }
                    }
                }
            });
        }
    }

    // =========================================================================
    // 5. Mobile Navigation Menu Toggle (Apple Sheet Style)
    // =========================================================================
    const menuBtn = document.querySelector('#mobile-menu-btn');
    const closeMenu = document.querySelector('#close-menu');
    const mobileMenu = document.querySelector('#mobile-menu');

    const toggleMenu = () => {
        if (!mobileMenu) return;
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) toggleMenu();
        });
    }

    // =========================================================================
    // 6. Smooth Scroll with Floating Nav Offset
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // 7. Navbar Shrink / Elevation on Scroll (Apple Glass Dynamics)
    // =========================================================================
    const navBar = document.querySelector('.apple-glass-nav');
    window.addEventListener('scroll', () => {
        if (!navBar) return;
        if (window.scrollY > 40) {
            navBar.classList.add('shadow-lg');
            navBar.style.paddingTop = '0.5rem';
            navBar.style.paddingBottom = '0.5rem';
        } else {
            navBar.classList.remove('shadow-lg');
            navBar.style.paddingTop = '';
            navBar.style.paddingBottom = '';
        }
    });
});
