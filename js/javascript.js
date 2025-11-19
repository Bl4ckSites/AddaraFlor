/*
 * javascript.js — Script principal de interatividade
 * Desenvolvido por Roger (© 2025)
 * Funções: Som, Vibração, Interatividade, Animações Suaves e Menu Lateral
 * Última atualização: ${new Date().toLocaleDateString()}
 */

class SensualInteractiveSite {
    constructor() {
        this.audioContext = null;
        this.clickSound = null;
        this.lastClickTime = 0;
        this.clickCooldown = 100;
        this.isAudioEnabled = false;
        this.isVibrationEnabled = false;
        
        this.init();
    }

    init() {
        console.log("🌸 Site carregado com sucesso — desenvolvido por Roger.");
        
        this.setupAudioSystem();
        this.setupVibrationSystem();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupProtectionSystems();
        
        // Inicializar componentes
        this.expandableSections = new ExpandableSections(this);
        this.privacyMenu = new PrivacyMenu();
        this.sideMenu = new SideMenu(this);
        
        // ✅ CARREGAR ESTADO PERSISTENTE DO RGB
        this.loadPersistentRGBState();
        
        console.log("✨ Todas as interações vinculadas!");
    }

    // ✅ NOVO MÉTODO: CARREGAR ESTADO PERSISTENTE DO RGB
    loadPersistentRGBState() {
        const savedRGBState = localStorage.getItem('rgbEffectEnabled');
        const isRGBEnabled = savedRGBState === 'true';
        
        if (isRGBEnabled && this.sideMenu && this.sideMenu.rgbToggle) {
            // Ativar o toggle visualmente
            this.sideMenu.rgbToggle.checked = true;
            // Ativar o efeito RGB
            this.sideMenu.activateRgbEffect();
            console.log("🌈 Efeito RGB restaurado do estado persistente");
        }
    }

    // 🔊 SISTEMA DE ÁUDIO
    setupAudioSystem() {
        this.clickSound = this.createAudioElement();
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isAudioEnabled = true;
            console.log("🔊 Áudio pronto!");
        } catch (error) {
            console.log("🔇 AudioContext não suportado, usando fallback HTML5 Audio");
            this.isAudioEnabled = false;
        }

        this.setupAudioResume();
    }

    createAudioElement() {
        const audio = new Audio();
        
        // Som de clique suave e sensual
        const sources = [
            { type: 'audio/mpeg', src: 'sounds/click.mp3' },
            { type: 'audio/ogg', src: 'sounds/click.ogg' },
            { type: 'audio/wav', src: 'sounds/click.wav' }
        ];

        sources.forEach(source => {
            const sourceElement = document.createElement('source');
            sourceElement.type = source.type;
            sourceElement.src = source.src;
            audio.appendChild(sourceElement);
        });

        audio.volume = 0.3;
        audio.preload = 'auto';
        
        return audio;
    }

    playClickSound() {
        const now = Date.now();
        if (now - this.lastClickTime < this.clickCooldown) return;
        this.lastClickTime = now;

        if (this.audioContext && this.isAudioEnabled) {
            this.playSyntheticClick();
            return;
        }

        if (this.clickSound && this.isAudioEnabled) {
            this.playHTML5Click();
        }
    }

    playSyntheticClick() {
        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (error) {
            this.isAudioEnabled = false;
        }
    }

    playHTML5Click() {
        try {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(() => {
                this.isAudioEnabled = false;
            });
        } catch (error) {
            this.isAudioEnabled = false;
        }
    }

    setupAudioResume() {
        const resumeAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.isAudioEnabled = true;
                });
            }
        };

        document.addEventListener('click', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);
    }

    // 📳 SISTEMA DE VIBRAÇÃO
    setupVibrationSystem() {
        this.isVibrationEnabled = this.testVibrationSupport();
        
        if (this.isVibrationEnabled) {
            console.log("📳 Vibração habilitada!");
        }
    }

    testVibrationSupport() {
        if (navigator.vibrate) return true;
        if (navigator.webkitVibrate) return true;
        return false;
    }

    triggerVibration() {
        if (!this.isVibrationEnabled) {
            this.visualVibrationFallback();
            return;
        }

        const patterns = [
            [10],
            [20, 10],
            [15, 5, 15],
            [8]
        ];

        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        try {
            if (navigator.vibrate) {
                navigator.vibrate(selectedPattern);
            } else if (navigator.webkitVibrate) {
                navigator.webkitVibrate(selectedPattern);
            } else {
                this.visualVibrationFallback();
            }
        } catch (error) {
            this.isVibrationEnabled = false;
            this.visualVibrationFallback();
        }
    }

    visualVibrationFallback() {
        const elements = document.querySelectorAll('.link-card, .circle, .carousel-arrow, button, a');
        
        elements.forEach(element => {
            element.style.transition = 'all 0.1s ease';
            element.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                element.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 50);
            }, 50);
        });
    }

    // ✨ EFEITOS VISUAIS
    addSensualHighlight(element) {
        if (!element) return;
        
        element.classList.add('sensual-highlight');
        
        setTimeout(() => {
            element.classList.remove('sensual-highlight');
        }, 300);
    }

    // 🎯 EVENT LISTENERS
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const interactiveSelectors = [
                'button', 'a', '.link-card', '.circle', 
                '.carousel-arrow', '.carousel-dot', 
                '.section-header', '.podcast-item'
            ];

            const isInteractive = interactiveSelectors.some(selector => 
                target.matches(selector) || target.closest(selector)
            );

            if (isInteractive) {
                this.handleInteractiveClick(e, target);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.matches('button, a, [role="button"]')) {
                    this.handleInteractiveClick(e, target);
                }
            }
        });
    }

    handleInteractiveClick(event, element) {
        if (element.tagName === 'A' && element.getAttribute('href') === '#') {
            event.preventDefault();
        }

        this.playClickSound();
        this.triggerVibration();
        this.addSensualHighlight(element);
    }

    // 👀 INTERSECTION OBSERVER
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('sensual-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.sensual-animate').forEach(el => {
            observer.observe(el);
        });
    }

    // 🛡️ PROTEÇÕES
    setupProtectionSystems() {
        this.setupCopyProtection();
        this.setupContextMenuProtection();
        this.setupInspectProtection();
    }

    setupCopyProtection() {
        document.addEventListener('copy', (e) => {
            if (!confirm('💋 Adoramos seu interesse! Entre em contato para usar nosso conteúdo.')) {
                e.preventDefault();
            }
        });

        document.addEventListener('cut', (e) => {
            e.preventDefault();
        });
    }

    setupContextMenuProtection() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    setupInspectProtection() {
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
                return false;
            }
        });
    }
}

// 📁 SEÇÕES EXPANSÍVEIS
class ExpandableSections {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.sections = document.querySelectorAll('.expandable-section');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCarousel();
        this.setupPodcastItems();
    }

    setupEventListeners() {
        this.sections.forEach(section => {
            const header = section.querySelector('.section-header');
            if (!header) return;

            header.addEventListener('click', () => {
                this.toggleSection(section);
            });

            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSection(section);
                }
            });
        });
    }

    setupPodcastItems() {
        const podcastItems = document.querySelectorAll('.podcast-item');
        podcastItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.main.handleInteractiveClick(e, item);
                
                setTimeout(() => {
                    const onclick = item.getAttribute('onclick');
                    if (onclick) {
                        try {
                            eval(onclick);
                        } catch (error) {
                            console.warn('Erro ao executar onclick:', error);
                        }
                    }
                }, 200);
            });
        });
    }

    toggleSection(section) {
        const isExpanded = section.classList.contains('expanded');
        
        this.sections.forEach(s => {
            if (s !== section) {
                this.collapseSection(s);
            }
        });

        if (isExpanded) {
            this.collapseSection(section);
        } else {
            this.expandSection(section);
        }
    }

    expandSection(section) {
        const content = section.querySelector('.section-content');
        if (!content) return;

        section.classList.add('expanded');
        content.setAttribute('aria-hidden', 'false');
        this.animateExpand(content);
    }

    collapseSection(section) {
        const content = section.querySelector('.section-content');
        if (!content) return;

        section.classList.remove('expanded');
        content.setAttribute('aria-hidden', 'true');
        this.animateCollapse(content);
    }

    animateExpand(content) {
        content.style.display = 'block';
        const height = content.scrollHeight;
        
        content.style.height = '0px';
        content.style.overflow = 'hidden';
        content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            content.style.height = `${height}px`;
            
            setTimeout(() => {
                content.style.height = 'auto';
                content.style.overflow = 'visible';
            }, 400);
        });
    }

    animateCollapse(content) {
        const height = content.scrollHeight;
        
        content.style.height = `${height}px`;
        content.style.overflow = 'hidden';
        content.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            content.style.height = '0px';
            
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        });
    }

    setupCarousel() {
        const carousels = document.querySelectorAll('.carousel');
        if (!carousels.length) return;

        carousels.forEach(carousel => {
            let images = this.getCarouselImages(carousel);
            let currentIndex = 0;
            
            const imageElement = carousel.querySelector('.carousel-image');
            const dots = carousel.querySelectorAll('.carousel-dot');
            const prevBtn = carousel.querySelector('.carousel-arrow.prev');
            const nextBtn = carousel.querySelector('.carousel-arrow.next');

            const updateCarousel = () => {
                if (imageElement && images[currentIndex]) {
                    imageElement.src = images[currentIndex];
                    imageElement.alt = `Prévia sensual ${currentIndex + 1}`;
                }
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            };

            const carouselHandler = (direction) => {
                const target = direction === 'next' ? nextBtn : prevBtn;
                this.main.handleInteractiveClick(new Event('click'), target);
                
                if (direction === 'next') {
                    currentIndex = (currentIndex + 1) % images.length;
                } else {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }
                
                updateCarousel();
            };

            if (prevBtn) prevBtn.addEventListener('click', () => carouselHandler('prev'));
            if (nextBtn) nextBtn.addEventListener('click', () => carouselHandler('next'));

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.main.handleInteractiveClick(new Event('click'), dot);
                    currentIndex = index;
                    updateCarousel();
                });
            });

            // Auto-rotate
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateCarousel();
            }, 5000);

            updateCarousel();
        });
    }

    getCarouselImages(carousel) {
        if (carousel.closest('#previewsCasalSection')) {
            return [
                'imgs/preview-casal1.jpg',
                'imgs/preview-casal2.jpg',
                'imgs/preview-casal3.jpg',
                'imgs/preview-casal4.jpg',
                'imgs/preview-casal5.jpg'
            ];
        }
        
        return [
            'imgs/preview-solo1.jpg',
            'imgs/preview-solo2.jpg',
            'imgs/preview-solo3.jpg',
            'imgs/preview-solo4.jpg',
            'imgs/preview-solo5.jpg'
        ];
    }
}

// 🔒 MENU DE PRIVACIDADE
class PrivacyMenu {
    constructor() {
        this.privacyMain = document.querySelector('.privacy-main');
        this.privacySubmenu = document.querySelector('.privacy-submenu');
        this.linksContainer = document.querySelector('.links');
        this.arrowIcon = this.privacyMain ? this.privacyMain.querySelector('.link-right') : null;
        
        this.init();
    }

    init() {
        if (this.privacyMain && this.privacySubmenu) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.privacyMain.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSubmenu();
        });
        
        document.addEventListener('click', () => {
            this.closeSubmenu();
        });
        
        this.privacySubmenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleSubmenu() {
        const isShowing = this.privacySubmenu.classList.contains('show');
        
        this.privacySubmenu.classList.toggle('show', !isShowing);
        this.privacyMain.classList.toggle('active', !isShowing);
        
        if (this.arrowIcon) {
            this.arrowIcon.textContent = isShowing ? '↓' : '↑';
        }
        
        if (!isShowing) {
            document.body.classList.add('privacy-open');
            if (this.linksContainer) this.linksContainer.classList.add('privacy-open');
        } else {
            this.closeSubmenu();
        }
    }

    closeSubmenu() {
        this.privacySubmenu.classList.remove('show');
        this.privacyMain.classList.remove('active');
        document.body.classList.remove('privacy-open');
        if (this.linksContainer) this.linksContainer.classList.remove('privacy-open');
        if (this.arrowIcon) this.arrowIcon.textContent = '↓';
    }
}

// ===== SISTEMA DO MENU LATERAL =====
class SideMenu {
    constructor(mainInstance) {
        this.main = mainInstance;
        this.menuToggle = document.getElementById('menuToggle');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.sideMenu = document.getElementById('sideMenu');
        this.menuClose = document.getElementById('menuClose');
        this.effectsToggle = document.getElementById('effectsToggle');
        this.effectsContent = document.getElementById('effectsContent');
        this.rgbToggle = document.getElementById('rgbToggle');
        
        this.isMenuOpen = false;
        this.isEffectsOpen = false;
        this.isRgbActive = false;
        
        this.init();
    }

    init() {
        // Verificar se os elementos existem antes de configurar os event listeners
        if (!this.menuToggle || !this.sideMenu) {
            console.warn("⚠️ Elementos do menu lateral não encontrados");
            return;
        }
        
        this.setupEventListeners();
        console.log("🌸 Menu lateral inicializado!");
    }

    setupEventListeners() {
        // Abrir menu
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Fechar menu
        if (this.menuClose) {
            this.menuClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
            });
        }

        // Fechar menu ao clicar no overlay
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Fechar menu com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Fechar menu ao scrollar
        window.addEventListener('scroll', () => {
            if (this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Toggle submenu de efeitos
        if (this.effectsToggle && this.effectsContent) {
            this.effectsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleEffects();
            });
        }

        // ✅ MODIFICADO: Toggle RGB com persistência
        if (this.rgbToggle) {
            this.rgbToggle.addEventListener('change', () => {
                this.toggleRgbEffect();
            });
        }

        // Prevenir propagação de clique no menu
        this.sideMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.sideMenu.classList.add('active');
        if (this.menuOverlay) this.menuOverlay.classList.add('active');
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.sideMenu.setAttribute('aria-hidden', 'false');
        
        // Adicionar interação sensual
        if (this.main) {
            this.main.playClickSound();
            this.main.triggerVibration();
        }
        
        // Desabilitar scroll do body
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.sideMenu.classList.remove('active');
        if (this.menuOverlay) this.menuOverlay.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.sideMenu.setAttribute('aria-hidden', 'true');
        
        // Fechar submenu de efeitos também
        this.closeEffects();
        
        // Reabilitar scroll do body
        document.body.style.overflow = '';
        
        // Adicionar interação sensual
        if (this.main) {
            this.main.playClickSound();
        }
    }

    toggleEffects() {
        if (this.isEffectsOpen) {
            this.closeEffects();
        } else {
            this.openEffects();
        }
    }

    openEffects() {
        this.isEffectsOpen = true;
        this.effectsToggle.setAttribute('aria-expanded', 'true');
        this.effectsContent.style.maxHeight = this.effectsContent.scrollHeight + 'px';
        
        if (this.main) {
            this.main.playClickSound();
        }
    }

    closeEffects() {
        this.isEffectsOpen = false;
        this.effectsToggle.setAttribute('aria-expanded', 'false');
        this.effectsContent.style.maxHeight = '0';
    }

    // ✅ MODIFICADO: Toggle RGB com persistência
    toggleRgbEffect() {
        this.isRgbActive = this.rgbToggle.checked;
        
        if (this.isRgbActive) {
            this.activateRgbEffect();
            // ✅ SALVAR NO LOCALSTORAGE
            localStorage.setItem('rgbEffectEnabled', 'true');
            console.log("🌈 Efeito RGB ativado e salvo");
        } else {
            this.deactivateRgbEffect();
            // ✅ REMOVER DO LOCALSTORAGE
            localStorage.setItem('rgbEffectEnabled', 'false');
            console.log("🌙 Efeito RGB desativado e salvo");
        }
        
        if (this.main) {
            this.main.playClickSound();
            this.main.triggerVibration();
        }
    }

    activateRgbEffect() {
        document.body.classList.add('rgb-effect');
        this.isRgbActive = true;
        
        // Adicionar classe neon-border para elementos que devem ter o efeito
        document.querySelectorAll('.link-card, .circle, .side-menu, .menu-toggle, .menu-item, .menu-accordion-header').forEach(el => {
            el.classList.add('neon-border');
        });
    }

    deactivateRgbEffect() {
        document.body.classList.remove('rgb-effect');
        this.isRgbActive = false;
        
        // Remover classe neon-border
        document.querySelectorAll('.neon-border').forEach(el => {
            el.classList.remove('neon-border');
        });
    }
}

// =============================================
// CARROSSEL PARA AS IMAGENS DE 2015-2016
// =============================================

class TimelineCarousel {
    constructor() {
        this.images = [
            '../imgs/historia/2015.png',
            '../imgs/historia/2015_1.png', 
            '../imgs/historia/2016.png',
            '../imgs/historia/2016_1.png'
        ];
        this.currentIndex = 0;
        this.carouselContainer = null;
        this.interval = null;
        this.init();
    }

    init() {
        // Encontrar o item da timeline de 2015-2016
        const timelineItems = document.querySelectorAll('.timeline-item');
        let targetItem = null;

        timelineItems.forEach(item => {
            const yearElement = item.querySelector('.timeline-year');
            if (yearElement && yearElement.textContent.includes('2015-2016')) {
                targetItem = item;
            }
        });

        if (!targetItem) return;

        this.createCarousel(targetItem);
        this.startRotation();
        this.setupHoverEvents();
    }

    createCarousel(timelineItem) {
        const timelineImage = timelineItem.querySelector('.timeline-image');
        if (!timelineImage) return;

        // Remover completamente a imagem estática existente
        timelineImage.innerHTML = '';

        // Criar container do carrossel
        this.carouselContainer = document.createElement('div');
        this.carouselContainer.className = 'timeline-carousel-container';

        // Adicionar todas as imagens ao carrossel
        this.images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Addara Flor - ${2015 + Math.floor(index/2)}`; // 2015, 2015, 2016, 2016
            img.className = `carousel-image ${index === 0 ? 'active' : ''}`;
            
            // Fallback específico para imagens do carrossel
            img.onerror = function() {
                console.warn(`Imagem do carrossel não carregada: ${src}`);
                // Tentar carregar alternativa
                if (src.includes('2015') && src.includes('_1')) {
                    this.src = '../imgs/historia/2015.png';
                } else if (src.includes('2016') && src.includes('_1')) {
                    this.src = '../imgs/historia/2016.png';
                } else {
                    this.src = '../imgs/avatar.png';
                }
            };
            
            this.carouselContainer.appendChild(img);
        });

        timelineImage.appendChild(this.carouselContainer);
    }

    startRotation() {
        this.interval = setInterval(() => {
            this.nextImage();
        }, 3000); // Mudar a cada 3 segundos
    }

    nextImage() {
        const images = this.carouselContainer.querySelectorAll('.carousel-image');
        
        // Remover classe active da imagem atual
        images[this.currentIndex].classList.remove('active');
        
        // Avançar para próxima imagem
        this.currentIndex = (this.currentIndex + 1) % images.length;
        
        // Adicionar classe active à nova imagem
        images[this.currentIndex].classList.add('active');
    }

    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    setupHoverEvents() {
        if (!this.carouselContainer) return;

        this.carouselContainer.addEventListener('mouseenter', () => {
            this.stopRotation();
        });

        this.carouselContainer.addEventListener('mouseleave', () => {
            this.startRotation();
        });
    }
}

// =============================================
// FUNCIONALIDADES ESPECÍFICAS DA PÁGINA HISTÓRIA
// =============================================

/**
 * Inicializa as funcionalidades específicas da página História
 */
function initHistoriaPage() {
    // Verifica se estamos na página História
    if (!document.querySelector('.about-section-expanded')) {
        return;
    }
    
    console.log('Inicializando página História...');
    
    // Configurar fallback para imagens da timeline - VERSÃO CORRIGIDA
    setupTimelineImagesFallback();
    
    // Inicializar animações da timeline
    initTimelineAnimations();
    
    // Configurar efeitos de hover nas imagens
    setupTimelineHoverEffects();
    
    // ✅ INICIALIZAR CARROSSEL DE 2015-2016
    new TimelineCarousel();
}

/**
 * Configura fallback para imagens da timeline - VERSÃO CORRIGIDA
 */
function setupTimelineImagesFallback() {
    const timelineImages = document.querySelectorAll('.timeline-image img');
    
    timelineImages.forEach(img => {
        // Verificar se a imagem NÃO pertence ao carrossel de 2015-2016
        if (!img.classList.contains('carousel-image')) {
            const imageUrl = img.getAttribute('src');
            
            // Adicionar evento de erro para fallback apenas para imagens que não são do carrossel
            img.addEventListener('error', function() {
                console.warn(`Imagem não encontrada: ${imageUrl}. Usando fallback.`);
                
                // Tentar carregar versão .png se era .jpg
                if (imageUrl.includes('.jpg')) {
                    const pngUrl = imageUrl.replace('.jpg', '.png');
                    this.src = pngUrl;
                    console.log(`Tentando fallback PNG: ${pngUrl}`);
                } else {
                    // Se já era PNG ou outro formato, usar avatar como último recurso
                    this.src = '../imgs/avatar.png';
                    this.alt = 'Addara Flor';
                    this.style.opacity = '0.7';
                }
            });
            
            // Pré-carregar e verificar imagens (apenas para não-carrossel)
            preloadImage(imageUrl).then(success => {
                if (!success) {
                    console.warn(`Imagem não carregada: ${imageUrl}`);
                    // Tentar fallback para PNG
                    if (imageUrl.includes('.jpg')) {
                        const pngUrl = imageUrl.replace('.jpg', '.png');
                        preloadImage(pngUrl).then(pngSuccess => {
                            if (pngSuccess) {
                                img.src = pngUrl;
                            } else {
                                img.src = '../imgs/avatar.png';
                                img.alt = 'Addara Flor';
                                img.style.opacity = '0.7';
                            }
                        });
                    } else {
                        img.src = '../imgs/avatar.png';
                        img.alt = 'Addara Flor';
                        img.style.opacity = '0.7';
                    }
                }
            });
        }
    });
}

/**
 * Pré-carrega uma imagem e retorna uma promise
 */
function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

/**
 * Inicializa animações da timeline
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Observer para animar itens quando entrarem na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        // Pausar animações inicialmente
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });
}

/**
 * Configura efeitos de hover nas imagens da timeline
 */
function setupTimelineHoverEffects() {
    const timelineImages = document.querySelectorAll('.timeline-image');
    
    timelineImages.forEach(image => {
        // Efeito de pulso sutil ao passar o mouse
        image.addEventListener('mouseenter', function() {
            this.style.animation = 'pulseGlow 2s infinite';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
}

/**
 * Efeito de conexão dinâmica entre imagem e linha
 */
function enhanceTimelineConnections() {
    const timeline = document.querySelector('.about-timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timeline || timelineItems.length === 0) return;
    
    // Apenas para desktop
    if (window.innerWidth < 1024) return;
    
    // Atualizar posições das conexões
    function updateConnections() {
        const timelineRect = timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top + window.scrollY;
        const timelineBottom = timelineRect.bottom + window.scrollY;
        
        timelineItems.forEach((item, index) => {
            const image = item.querySelector('.timeline-image');
            if (!image) return;
            
            const imageRect = image.getBoundingClientRect();
            const imageCenterY = imageRect.top + window.scrollY + (imageRect.height / 2);
            
            // Ajustar visualmente a conexão baseado na posição
            const isTop = imageCenterY < timelineTop + 100;
            const isBottom = imageCenterY > timelineBottom - 100;
            
            if (isTop) {
                image.style.alignSelf = 'flex-start';
            } else if (isBottom) {
                image.style.alignSelf = 'flex-end';
            } else {
                image.style.alignSelf = 'center';
            }
        });
    }
    
    // Atualizar na inicialização e no resize
    updateConnections();
    window.addEventListener('resize', updateConnections);
    window.addEventListener('scroll', updateConnections);
}

// =============================================
// INICIALIZAÇÃO
// =============================================

// 🚀 INICIALIZAÇÃO ÚNICA E CONSOLIDADA
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando carregamento do site...");
    
    // Inicializar funcionalidades específicas da página História
    initHistoriaPage();
    
    // Inicializar conexões da timeline após um pequeno delay
    setTimeout(enhanceTimelineConnections, 100);
    
    // Simular carregamento da página
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.setAttribute('aria-hidden', 'false');
        }
        
        // Inicializar a aplicação principal APENAS UMA VEZ
        window.sensualSite = new SensualInteractiveSite();
        
        console.log("✅ Site totalmente carregado e inicializado!");
    }, 1500);
});

// 🎵 CONTEXTO DE ÁUDIO GLOBAL (para compatibilidade)
let audioCtx;

// Função global para resumir áudio - apenas se necessário
function resumeAudioOnClick() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log("🔇 Não foi possível criar AudioContext global");
            return;
        }
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Adicionar event listener apenas se não houver conflito
document.addEventListener('click', resumeAudioOnClick);

// Carregamento otimizado do CSS secundário
setTimeout(function() {
    var stylesLoaded = false;
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.includes('styles2.css')) {
            stylesLoaded = true;
            break;
        }
    }
    
    if (!stylesLoaded) {
        // Fallback - carregar styles2.css de forma síncrona se falhou
        var fallbackStyles = document.createElement('link');
        fallbackStyles.rel = 'stylesheet';
        fallbackStyles.href = 'css/styles2.css';
        document.head.appendChild(fallbackStyles);
    }
}, 3000);

// Adicionar estilos dinâmicos para as animações
const dynamicStyles = `
@keyframes pulseGlow {
  0% { box-shadow: 0 5px 15px rgba(169, 0, 255, 0.3), 0 0 0 8px rgba(169, 0, 255, 0.1), 0 0 0 12px rgba(255, 0, 255, 0.05); }
  50% { box-shadow: 0 5px 20px rgba(255, 0, 255, 0.5), 0 0 0 10px rgba(255, 0, 255, 0.15), 0 0 0 14px rgba(169, 0, 255, 0.1); }
  100% { box-shadow: 0 5px 15px rgba(169, 0, 255, 0.3), 0 0 0 8px rgba(169, 0, 255, 0.1), 0 0 0 12px rgba(255, 0, 255, 0.05); }
}

.timeline-image.connected::before {
  background: linear-gradient(90deg, #ff00ff, #a900ff) !important;
}

.timeline-image.connected::after {
  background: #ff00ff !important;
  box-shadow: 0 0 15px #ff00ff, 0 0 30px #a900ff !important;
}
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);



