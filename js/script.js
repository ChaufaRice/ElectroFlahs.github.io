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
        heroBg.style.opacity = '0.4';
        setTimeout(() => {
            heroBg.style.backgroundImage = `url("${heroImages[currentImageIndex]}")`;
            heroBg.style.opacity = '0.8';
        }, 500);
    };

    if (heroBg) {
        setInterval(changeHeroImage, 5000);
    }

    // Advanced File Selection Handling with Previews
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
            fileListContainer.innerHTML = '<p class="mb-3 font-bold text-on-surface">Archivos adjuntos:</p>';
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';

            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'flex items-center gap-3 bg-surface-container-low p-2 rounded border border-outline-variant/30 text-on-surface-variant shadow-sm';

                // Crear vista previa si es imagen
                let previewHtml = `<span class="material-symbols-outlined text-xl">insert_drive_file</span>`;
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    // Nota: FileReader es asíncrono, para la vista previa inmediata usaremos URL.createObjectURL
                    const url = URL.createObjectURL(file);
                    previewHtml = `<img src="${url}" class="w-12 h-12 object-cover rounded border border-outline-variant/50">`;
                }

                item.innerHTML = `
                    ${previewHtml}
                    <div class="flex-1 overflow-hidden">
                        <p class="truncate text-xs font-medium">${file.name}</p>
                        <p class="text-[10px] opacity-60">${(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button type="button" class="text-error hover:text-red-700 transition-colors p-1" data-index="${index}">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                `;
                grid.appendChild(item);
            });
            fileListContainer.appendChild(grid);
            grid.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = this.getAttribute('data-index');
                    selectedFiles.splice(idx, 1);
                    updateFileDisplay();
                });
            });
        }

        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                if (selectedFiles.length > 0) {
                    e.preventDefault();
                    const formData = new FormData(contactForm);
                    formData.delete('attachments[]');
                    selectedFiles.forEach(file => formData.append('attachments[]', file));
                    try {
                        const response = await fetch('enviar.php', { method: 'POST', body: formData });
                        if (response.ok) {
                            alert('Solicitud enviada con éxito.');
                            contactForm.reset();
                            selectedFiles = [];
                            updateFileDisplay();
                        } else {
                            alert('Hubo un error al enviar el formulario.');
                        }
                    } catch (error) {
                        alert('Error de conexión al enviar el formulario.');
                    }
                }
            });
        }
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
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    const observerOptions = { threshold: 0.1 };
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
});
