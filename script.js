// script.js
// Script principal do portfólio
// Gerencia navegação, sistema de partículas e carregamento de páginas

class ParticleSystem {
  constructor(containerSelector = '.container',) {
    this.particles = [];
    this.particlePool = [];
    this.maximumNumberOfParticles = 120;
    this.containerElement = document.querySelector(containerSelector);
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.activeGlowParticleCount = 0;
    this.maximumNumberOfGlowParticles = Math.floor(this.maximumNumberOfParticles * 0.1);

    if (!this.containerElement) {
      console.error(`Container '${containerSelector}' não encontrado`);
      return;
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.lastFrameTime = performance.now();
      }
    });

    this.initialize();
  }

  initialize() {
    this.createParticlePool();
    for (let i = 0; i < this.maximumNumberOfParticles; i++) {
      setTimeout(() => this.activateParticle(), i * 50);
    }
    requestAnimationFrame(this.animateFrame.bind(this));
  }

  createParticlePool() {
    for (let i = 0; i < this.maximumNumberOfParticles; i++) {
      const element = document.createElement('div');
      element.className = 'particle';
      element.style.opacity = '0';
      element.style.display = 'none';
      this.containerElement.appendChild(element);
      this.particlePool.push({ element: element, active: false });
    }
  }

  getParticleFromPool() {
    for (let i = 0; i < this.particlePool.length; i++) {
      if (!this.particlePool[i].active) {
        this.particlePool[i].active = true;
        return this.particlePool[i];
      }
    }
    return null;
  }

  activateParticle() {
    const pooledParticle = this.getParticleFromPool();
    if (!pooledParticle) return;

    const size = Math.random() * 4 + 2;
    const startX = Math.random() * this.containerElement.offsetWidth;
    const startY = Math.random() * this.containerElement.offsetHeight;

    const element = pooledParticle.element;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
    element.style.opacity = '0.8';
    element.style.display = 'block';

    const speed = Math.random() * 0.2 + 0.05;
    const angle = Math.random() * Math.PI * 2;
    const lifeSpan = Math.random() * 30000 + 15000;

    this.particles.push({
      element: element,
      poolIndex: this.particlePool.indexOf(pooledParticle),
      x: startX,
      y: startY,
      size: size,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      lifeSpan: lifeSpan,
      age: Math.random() * lifeSpan,
      isOffScreen: false
    });

    if (Math.random() < 0.2 && this.activeGlowParticleCount < this.maximumNumberOfGlowParticles) {
      this.activateGlowEffect(element);
    }
  }

  activateGlowEffect(element) {
    if (this.activeGlowParticleCount >= this.maximumNumberOfGlowParticles) return;

    this.activeGlowParticleCount++;
    const animate = () => {
      element.classList.add('glow');
      setTimeout(() => {
        element.classList.remove('glow');
        this.activeGlowParticleCount--;
        if (Math.random() < 0.3 && element.style.opacity !== '0') {
          setTimeout(() => {
            if (this.activeGlowParticleCount < this.maximumNumberOfGlowParticles) {
              this.activeGlowParticleCount++;
              animate();
            }
          }, Math.random() * 3000 + 2000);
        }
      }, 1500);
    };
    animate();
  }

  updateParticle(particle, deltaTime) {
    particle.x += particle.velocityX * deltaTime;
    particle.y += particle.velocityY * deltaTime;

    if (Math.random() < 0.002) {
      particle.velocityX += (Math.random() - 0.5) * 0.02;
      particle.velocityY += (Math.random() - 0.5) * 0.02;
    }

    const width = this.containerElement.offsetWidth;
    const height = this.containerElement.offsetHeight;

    if (particle.x < 0 || particle.x > width) {
      particle.velocityX *= -1;
      particle.x = Math.max(0, Math.min(particle.x, width));
    }

    if (particle.y < 0 || particle.y > height) {
      particle.velocityY *= -1;
      particle.y = Math.max(0, Math.min(particle.y, height));
    }

    const buffer = particle.size * 2;
    const isOffScreen = (
      particle.x < -buffer || particle.x > width + buffer ||
      particle.y < -buffer || particle.y > height + buffer
    );

    if (particle.isOffScreen !== isOffScreen) {
      particle.isOffScreen = isOffScreen;
      particle.element.style.display = isOffScreen ? 'none' : 'block';
    }

    if (!particle.isOffScreen) {
      particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
    }

    particle.age += deltaTime;
    if (particle.age > particle.lifeSpan) {
      this.resetSingleParticle(particle);
    }
  }

  resetSingleParticle(particle) {
    particle.x = Math.random() * this.containerElement.offsetWidth;
    particle.y = Math.random() * this.containerElement.offsetHeight;
    particle.age = 0;

    if (!particle.isOffScreen) {
      particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
    }

    const speed = Math.random() * 0.2 + 0.05;
    const angle = Math.random() * Math.PI * 2;
    particle.velocityX = Math.cos(angle) * speed;
    particle.velocityY = Math.sin(angle) * speed;
  }

  animateFrame(currentTime) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = currentTime;
    }
    const elapsedTime = currentTime - this.lastFrameTime;
    if (elapsedTime > 16) {
      this.lastFrameTime = currentTime;
      const deltaTime = Math.min(elapsedTime, 50);
      this.particles.forEach(particle => this.updateParticle(particle, deltaTime));
      this.frameCount++;
    }
    requestAnimationFrame(this.animateFrame.bind(this));
  }

  repositionParticles() {
    const width = this.containerElement.offsetWidth;
    const height = this.containerElement.offsetHeight;
    this.particles.forEach(particle => {
      if (particle.x > width) particle.x = width - particle.size * 2;
      if (particle.y > height) particle.y = height - particle.size * 2;
      if (!particle.isOffScreen) {
        particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
      }
    });
  }

  dispose() {
    this.particles.forEach(p => {
      if (p.element && p.element.parentNode) {
        p.element.parentNode.removeChild(p.element);
      }
    });
    this.particles = [];
    this.particlePool = [];
  }
}

class PageManager {
  constructor() {
    this.pageContentContainer = document.getElementById('page-content');
    this.currentPageName = null;
    this.particleSystemInstance = null;
    this.routes = {
      '': 'home',
      '#home': 'home',
      '#projects': 'projects',
      '#about': 'about'
    };
    this.initializeEventListeners();
    this.handleHashChange();
  }

  initializeEventListeners() {
    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  async handleHashChange() {
    const hashValue = window.location.hash || '';
    const targetPageName = this.routes[hashValue] || this.routes[''];
    await this.loadPage(targetPageName);
  }

  async loadPage(targetPageName) {
    // 1) Se houver sistema de partículas ativo, destrua-o
    if (this.particleSystemInstance) {
      this.particleSystemInstance.dispose();
      this.particleSystemInstance = null;
    }
  
    // 2) Esconde o conteúdo enquanto carrega estilos
    this.pageContentContainer.style.visibility = 'hidden';
  
    // 3) Carrega a nova folha de estilo e aguarda
    this.loadPageStyles(targetPageName);
    await new Promise(resolve => {
      const link = document.getElementById('page-styles');
      if (link.sheet) return resolve();
      link.addEventListener('load', resolve, { once: true });
    });
  
    // 4) Busca e injeta o HTML da página só após o CSS estar pronto
    const fetchResponse = await fetch(`pages/${targetPageName}/${targetPageName}.html`);
    const pageHtml      = await fetchResponse.text();
    this.pageContentContainer.innerHTML = pageHtml;
  
    // 5) Mostra o conteúdo
    this.pageContentContainer.style.visibility = '';
  
    // 6) Carrega e executa o script específico da página
    await this.loadPageScript(targetPageName);
  
    // 7) Sempre inicializa o sistema de partículas na nova página
    this.initializeParticles();
  
    // 8) Atualiza a rota atual
    this.currentPageName = targetPageName;
  }
  
  
  
  
  

  loadPageStyles(targetPageName) {
    const existingStylesLink = document.getElementById('page-styles');
    if (existingStylesLink) {
      existingStylesLink.remove();
    }
    const newStylesLink = document.createElement('link');
    newStylesLink.id = 'page-styles';
    newStylesLink.rel = 'stylesheet';
    newStylesLink.href = `pages/${targetPageName}/${targetPageName}.css`;
    document.head.appendChild(newStylesLink);
  }

  async loadPageScript(targetPageName) {
    const existingScript = document.getElementById('page-script');
    if (existingScript) {
      existingScript.remove();
    }
    window.isReturningToPage = this.isReturningToPage(targetPageName);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'page-script';
      script.src = `pages/${targetPageName}/${targetPageName}.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
  initializeParticles() {
    const containerElement = document.querySelector('.container');
    if (containerElement) {
      this.particleSystemInstance = new ParticleSystem('.container');
      this.initializeResizeListener();
    }
  }

  initializeResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.particleSystemInstance) {
          this.particleSystemInstance.repositionParticles();
        }
      }, 250);
    });
  }

  cleanupCurrentPage(shouldCleanParticles = true) {
    if (shouldCleanParticles && this.particleSystemInstance) {
      this.particleSystemInstance.dispose();
      this.particleSystemInstance = null;
    }
  }

  saveCurrentLanguage(languageCode) {
    sessionStorage.setItem('currentLanguage', languageCode);
  }

  getSavedLanguage() {
    return sessionStorage.getItem('currentLanguage') || 'pt';
  }

  isReturningToPage(targetPageName) {
    const visitedPagesString = sessionStorage.getItem('visitedPages') || '';
    const visitedPagesArray = visitedPagesString ? visitedPagesString.split(',') : [];

    const hasVisitedPageBefore = visitedPagesArray.includes(targetPageName);

    if (!hasVisitedPageBefore) {
      visitedPagesArray.push(targetPageName);
      sessionStorage.setItem('visitedPages', visitedPagesArray.join(','));
    }

    return hasVisitedPageBefore;
  }
}

// Inicializa o gerenciador de páginas quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.pageManager = new PageManager();
});
