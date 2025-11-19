// Controle de podcasts com vídeos do YouTube e áudios do Spotify
document.addEventListener('DOMContentLoaded', function() {
  const podcastCards = document.querySelectorAll('.podcast-card');
  let activeCard = null;

  // Adiciona evento de clique para cada card
  podcastCards.forEach(card => {
    // Define o aria-label com base no tipo de conteúdo
    if (card.classList.contains('youtube-card')) {
      card.setAttribute('aria-label', 'Podcast card. Clique para abrir e reproduzir o vídeo do YouTube.');
    } else if (card.classList.contains('spotify-card')) {
      card.setAttribute('aria-label', 'Podcast card. Clique para abrir e reproduzir o áudio do Spotify.');
    }

    card.addEventListener('click', function() {
      togglePodcastCard(this);
    });

    // Suporte para teclado (Enter ou Espaço)
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePodcastCard(this);
      }
    });
  });

  function togglePodcastCard(card) {
    // Se o card já está ativo, feche-o
    if (card === activeCard) {
      closePodcastCard(card);
      activeCard = null;
      return;
    }

    // Fecha o card ativo anterior, se houver
    if (activeCard) {
      closePodcastCard(activeCard);
    }

    // Abre o novo card
    openPodcastCard(card);
    activeCard = card;
  }

  function openPodcastCard(card) {
    const videoWrapper = card.querySelector('.video-wrapper');
    
    // Verifica se é um card do YouTube
    if (card.classList.contains('youtube-card')) {
      const youtubeId = card.getAttribute('data-youtube-id');
      
      // Cria o iframe do YouTube
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      
      // Limpa o wrapper e adiciona o iframe
      videoWrapper.innerHTML = '';
      videoWrapper.appendChild(iframe);
      
      // Atualiza o aria-label
      card.setAttribute('aria-label', 'Podcast card. Reproduzindo vídeo do YouTube. Clique para fechar.');
    } 
    // Verifica se é um card do Spotify
    else if (card.classList.contains('spotify-card')) {
      const spotifyId = card.getAttribute('data-spotify-id');
      
      // Cria o iframe do Spotify
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator&theme=0`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('allow', 'encrypted-media');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('style', 'width:100%; height:100%; border-radius:0;');
      
      // Limpa o wrapper e adiciona o iframe
      videoWrapper.innerHTML = '';
      videoWrapper.appendChild(iframe);
      
      // Atualiza o aria-label
      card.setAttribute('aria-label', 'Podcast card. Reproduzindo áudio do Spotify. Clique para fechar.');
    }
    
    // Ativa o card
    card.classList.add('active');
  }

  function closePodcastCard(card) {
    const videoWrapper = card.querySelector('.video-wrapper');
    
    // Remove o iframe para parar a reprodução e liberar recursos
    videoWrapper.innerHTML = '';
    
    // Desativa o card
    card.classList.remove('active');
    
    // Restaura o aria-label
    if (card.classList.contains('youtube-card')) {
      card.setAttribute('aria-label', 'Podcast card. Clique para abrir e reproduzir o vídeo do YouTube.');
    } else if (card.classList.contains('spotify-card')) {
      card.setAttribute('aria-label', 'Podcast card. Clique para abrir e reproduzir o áudio do Spotify.');
    }
  }

  // Fecha o card ativo ao clicar fora
  document.addEventListener('click', function(e) {
    if (activeCard && !activeCard.contains(e.target) && !e.target.closest('.podcast-card')) {
      closePodcastCard(activeCard);
      activeCard = null;
    }
  });

  // Fecha o card ativo ao pressionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeCard) {
      closePodcastCard(activeCard);
      activeCard = null;
    }
  });
});




// Lógica para o botão Privacy e sub-botões

document.addEventListener('DOMContentLoaded', function() {
  // Elementos do Privacy
  const privacyToggle = document.querySelector('.privacy-toggle');
  const privacySubmenu = document.querySelector('.privacy-submenu');
  const clickSound = document.getElementById('clickSound');
  
  // Verificar se os elementos existem
  if (!privacyToggle || !privacySubmenu) return;
  
  // Estado do submenu
  let isSubmenuOpen = false;
  
  // Função para tocar som de clique
  function playClickSound() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  // Função para alternar o submenu
  function toggleSubmenu() {
    playClickSound();
    
    if (isSubmenuOpen) {
      // Fechar submenu
      privacySubmenu.classList.remove('active');
      isSubmenuOpen = false;
    } else {
      // Abrir submenu
      privacySubmenu.classList.add('active');
      isSubmenuOpen = true;
    }
  }
  
  // Event listener para o botão Privacy
  privacyToggle.addEventListener('click', function(e) {
    e.preventDefault();
    toggleSubmenu();
  });
  
  // Fechar submenu ao clicar fora
  document.addEventListener('click', function(e) {
    if (isSubmenuOpen && !privacyToggle.contains(e.target) && !privacySubmenu.contains(e.target)) {
      privacySubmenu.classList.remove('active');
      isSubmenuOpen = false;
    }
  });
  
  // Fechar submenu ao pressionar Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isSubmenuOpen) {
      privacySubmenu.classList.remove('active');
      isSubmenuOpen = false;
    }
  });
  
  // Prevenir fechamento ao clicar nos sub-botões
  privacySubmenu.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});