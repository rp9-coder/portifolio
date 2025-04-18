(function() {
  class HomeController {
    constructor() {
      // Referências aos elementos DOM
      this.langToggle = document.getElementById('langToggle');
      this.welcome = document.querySelector('.welcome');
      this.textElem = document.querySelector('.text');
      this.lineElem = document.querySelector('.line');
      this.exploreElem = document.querySelector('.explore');
      this.botao = document.querySelector('.botao');
      this.author = document.querySelector('.author');
      
      // Estado da aplicação
      this.currentLang = window.pageManager ? 
        window.pageManager.getSavedLanguage() : 'pt';
      
      this.animationSpeedFactor = 1;
      this.languageToggleDelay = 600 * this.animationSpeedFactor;
      this.isTransitioning = false; // Flag para controlar estado de transição
      
      // Inicializar
      this.init();
    }
    
    init() {
      // Resetar o estado dos elementos ao carregar a página
      this.resetElementStates();
      
      // Atualizar textos para o idioma atual
      this.updateTextsForLanguage(this.currentLang);
      
      // Iniciar animações
      this.startInitialAnimations();
      
      // Configurar event listeners
      this.setupEventListeners();
    }
    
    resetElementStates() {
      console.log("Resetando estados dos elementos");
      
      // Verificar estado inicial dos elementos
      console.log("Estado inicial - welcome:", this.welcome ? this.welcome.style.display : 'não encontrado');
      console.log("Estado inicial - text:", this.textElem ? this.textElem.classList : 'não encontrado');
      console.log("Estado inicial - line:", this.lineElem ? this.lineElem.classList : 'não encontrado');
      
      if (this.welcome) {
        this.welcome.style.display = '';
        this.welcome.classList.remove('reverse-animation');
        console.log("Welcome após reset:", this.welcome.style.display);
      }
      
      if (this.botao) {
        this.botao.style.display = '';
        this.botao.classList.remove('reverse-animation');
      }
      
      if (this.author) {
        this.author.style.display = '';
        this.author.classList.remove('fade-out');
      }
      
      if (this.textElem) {
        console.log("TextElem antes de remover classe:", this.textElem.classList.contains('animated'));
        this.textElem.classList.remove('animated');
        console.log("TextElem após remover classe:", this.textElem.classList.contains('animated'));
        void this.textElem.offsetWidth;
      }
      
      if (this.lineElem) {
        console.log("LineElem antes de remover classe:", this.lineElem.classList.contains('animated'));
        this.lineElem.classList.remove('animated');
        console.log("LineElem após remover classe:", this.lineElem.classList.contains('animated'));
        void this.lineElem.offsetWidth;
      }
      
      if (this.exploreElem) {
        this.exploreElem.classList.remove('animated');
        void this.exploreElem.offsetWidth;
      }
      
      console.log("Reset de estados concluído");
    }
    
    startInitialAnimations() {
      console.log("Iniciando animações iniciais");
      setTimeout(() => {
        console.log("Aplicando classes de animação");
        if (this.textElem) {
          this.textElem.classList.add('animated');
          console.log("Classe 'animated' adicionada ao texto:", this.textElem.classList.contains('animated'));
        }
        if (this.lineElem) {
          this.lineElem.classList.add('animated');
          console.log("Classe 'animated' adicionada à linha:", this.lineElem.classList.contains('animated'));
        }
        if (this.exploreElem) this.exploreElem.classList.add('animated');
        if (this.botao) this.botao.classList.add('animated');
      }, 100);
    }
    
    setupEventListeners() {
      this.langToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleLanguage();
      });
      
      this.exploreElem.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleExploreClick();
      });
    }
    
    handleExploreClick() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      
      this.startReverseAnimations();
      
      const totalTransitionTime = this.languageToggleDelay + 300;
      
      setTimeout(() => {
        this.hideHomeElements();
        setTimeout(() => {
          window.location.hash = '#about';
          this.isTransitioning = false;
        }, 100);
      }, totalTransitionTime);
    }
    
    startReverseAnimations() {
      this.welcome.classList.add('reverse-animation');
      this.botao.classList.add('reverse-animation');
      this.author.classList.add('fade-out');
    }
    
    hideHomeElements() {
      this.welcome.style.display = 'none';
      this.botao.style.display = 'none';
      this.author.style.display = 'none';
    }
    
    toggleLanguage() {
      if (this.welcome.classList.contains('reverse-animation') || this.isTransitioning) return;
      
      this.welcome.classList.add('reverse-animation');
      this.botao.classList.add('reverse-animation');

      setTimeout(() => {
        this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
        
        if (window.pageManager) {
          window.pageManager.saveCurrentLanguage(this.currentLang);
        }
        
        this.updateTextsForLanguage(this.currentLang);

        this.welcome.classList.remove('reverse-animation');
        this.botao.classList.remove('reverse-animation');
        
        void this.textElem.offsetWidth;
        void this.lineElem.offsetWidth;
        void this.exploreElem.offsetWidth;
        void this.botao.offsetWidth;
        
        this.textElem.classList.add('animated');
        this.lineElem.classList.add('animated');
        this.exploreElem.classList.add('animated');
        this.botao.classList.add('animated');
      }, this.languageToggleDelay);
    }
    
    updateTextsForLanguage(lang) {
      if (lang === 'en') {
        this.textElem.innerHTML = 'Get to know<br>about me';
        this.langToggle.textContent = 'Português';
        this.exploreElem.textContent = 'Explore';
      } else {
        this.textElem.innerHTML = 'Conheça um pouco<br>sobre mim';
        this.langToggle.textContent = 'English';
        this.exploreElem.textContent = 'Explorar';
      }
    }
  }

  new HomeController();
})();
document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("explore-btn");
  const container = document.querySelector(".container");

  if (exploreBtn && container) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault(); // impede mudança de página imediata

      // Adiciona a classe que reverte as animações
      container.classList.add("reverse-animation");

      // Aguarda a animação (0.5s) e troca a página
      setTimeout(() => {
        window.location.hash = "#projects";
      }, 100000); // Tempo igual à duração das animações de saída
    });
  }
});