// Sistema completo de rastreamento - AddaraFlor
document.addEventListener('DOMContentLoaded', function() {
    
    // IDENTIFICAÇÃO DA PÁGINA ATUAL
    const currentPage = window.location.pathname.split('/').pop();
    let pageType = 'outra';
    let pageName = 'desconhecida';
    
    // Mapeamento das páginas
    const pageMap = {
        'index.html': { type: 'tela_inicial', name: 'Página Inicial' },
        '': { type: 'tela_inicial', name: 'Página Inicial' },
        'licencas.html': { type: 'tela_licencas', name: 'Licenças' },
        'podcasts.html': { type: 'tela_podcasts', name: 'Podcasts' },
        'aulas.html': { type: 'tela_aulas', name: 'Aulas' },
        'Historia.html': { type: 'tela_historia', name: 'História' }
    };
    
    if (pageMap[currentPage]) {
        pageType = pageMap[currentPage].type;
        pageName = pageMap[currentPage].name;
    }
    
    console.log('🔍 Analytics: Rastreando página:', pageName, pageType);
    
    // ENVIO DE EVENTO DE PÁGINA VISUALIZADA
    gtag('event', 'page_view_custom', {
        'page_type': pageType,
        'page_name': pageName,
        'page_path': window.location.pathname
    });
    
    // RASTREAMENTO DE CLICKS
    document.addEventListener('click', function(e) {
        const element = e.target;
        const elementType = element.tagName.toLowerCase();
        let elementCategory = 'outro';
        let elementLabel = '';
        
        // Categorização dos cliques
        if (elementType === 'a') {
            elementCategory = 'link';
            elementLabel = element.getAttribute('href') || element.textContent.substring(0, 30);
        } else if (elementType === 'button') {
            elementCategory = 'botao';
            elementLabel = element.textContent.substring(0, 30) || element.id || 'botao_sem_texto';
        } else if (elementType === 'img') {
            elementCategory = 'imagem';
            elementLabel = element.alt || element.getAttribute('src') || 'imagem_sem_nome';
        } else if (elementType === 'input' && element.type === 'submit') {
            elementCategory = 'formulario';
            elementLabel = element.value || 'enviar_formulario';
        }
        
        // Envio do evento de clique
        if (elementCategory !== 'outro') {
            gtag('event', 'click_detalhado', {
                'event_category': elementCategory,
                'event_label': elementLabel,
                'page_type': pageType,
                'page_name': pageName,
                'value': 1
            });
            
            console.log('🖱️ Analytics: Clique registrado:', elementCategory, elementLabel);
        }
    });
    
    // RASTREAMENTO DE TEMPO NA PÁGINA
    let startTime = Date.now();
    let maxTimeReported = 0;
    
    function reportTimeSpent() {
        const currentTime = Math.round((Date.now() - startTime) / 1000);
        
        // Reporta a cada 30 segundos ou na saída
        if (currentTime > maxTimeReported && (currentTime % 30 === 0 || currentTime > maxTimeReported)) {
            gtag('event', 'time_spent', {
                'event_category': 'engajamento',
                'event_label': pageType,
                'value': currentTime,
                'page_name': pageName
            });
            
            maxTimeReported = currentTime;
            console.log('⏱️ Analytics: Tempo registrado:', currentTime + 's');
        }
    }
    
    // Atualiza tempo a cada 30 segundos
    setInterval(reportTimeSpent, 30000);
    
    // Reporta tempo ao sair da página
    window.addEventListener('beforeunload', function() {
        const finalTime = Math.round((Date.now() - startTime) / 1000);
        gtag('event', 'page_exit', {
            'event_category': 'engajamento',
            'event_label': pageType,
            'value': finalTime,
            'page_name': pageName
        });
    });
    
    // RASTREAMENTO DE SCROLL
    let maxScroll = 0;
    let scrollReported = [];
    
    window.addEventListener('scroll', function() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercent = scrollable > 0 ? Math.round((scrolled / scrollable) * 100) : 0;
        
        // Reporta marcos de scroll (25%, 50%, 75%, 100%)
        const milestones = [25, 50, 75, 90, 100];
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !scrollReported.includes(milestone) && scrollPercent > maxScroll) {
                gtag('event', 'scroll_progress', {
                    'event_category': 'engajamento',
                    'event_label': `${pageType}_${milestone}%`,
                    'value': milestone,
                    'page_name': pageName
                });
                
                scrollReported.push(milestone);
                maxScroll = scrollPercent;
                console.log('📜 Analytics: Scroll registrado:', milestone + '%');
            }
        });
    });
    
    // RASTREAMENTO ESPECIAL PARA PODCASTS
    if (pageType === 'tela_podcasts') {
        const audioElements = document.querySelectorAll('audio');
        
        audioElements.forEach((audio, index) => {
            // Play
            audio.addEventListener('play', function() {
                gtag('event', 'audio_play', {
                    'event_category': 'podcast',
                    'event_label': this.currentSrc || `podcast_${index + 1}`,
                    'page_name': pageName
                });
                console.log('🎧 Analytics: Áudio play:', this.currentSrc);
            });
            
            // Pause
            audio.addEventListener('pause', function() {
                const timeListened = Math.round(this.currentTime);
                gtag('event', 'audio_pause', {
                    'event_category': 'podcast',
                    'event_label': this.currentSrc || `podcast_${index + 1}`,
                    'value': timeListened,
                    'page_name': pageName
                });
            });
            
            // Finalizado
            audio.addEventListener('ended', function() {
                gtag('event', 'audio_completed', {
                    'event_category': 'podcast',
                    'event_label': this.currentSrc || `podcast_${index + 1}`,
                    'page_name': pageName
                });
                console.log('✅ Analytics: Áudio completo');
            });
        });
    }
    
    // RASTREAMENTO DE LINKS EXTERNOS
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                gtag('event', 'external_link_click', {
                    'event_category': 'link_externo',
                    'event_label': this.href,
                    'page_type': pageType,
                    'page_name': pageName
                });
                console.log('🔗 Analytics: Link externo:', this.href);
            });
        }
    });
    
    // RASTREAMENTO DE FORMULÁRIOS
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
        form.addEventListener('submit', function(e) {
            gtag('event', 'form_submit', {
                'event_category': 'formulario',
                'event_label': `form_${index + 1}_${pageType}`,
                'page_name': pageName
            });
            console.log('📝 Analytics: Formulário enviado');
        });
    });
    
    console.log('🚀 Analytics: Configuração completa para', pageName);
});