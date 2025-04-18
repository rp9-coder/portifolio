(function() {
  /**
   * Controlador da página About
   */
  class AboutController {
    constructor() {
      // Referências aos elementos DOM
      this.langToggle = document.getElementById('langToggle');
      this.aboutTitle = document.querySelector('.about-title');
      this.aboutText = document.querySelector('.about-text');
      this.navButtons = document.querySelectorAll('.nav-button');
      this.aboutContent = document.querySelector('.about-content'); // Nova referência
      
      // Estado da aplicação
      this.currentLang = this.determineCurrentLanguage();
      
      // Inicializar
      this.init();
    }
    
    /**
     * Determina o idioma atual com base no texto do botão de idioma
     */
    determineCurrentLanguage() {
      if (window.pageManager) {
        return window.pageManager.getSavedLanguage();
      }
      return this.langToggle && this.langToggle.textContent === 'Português' ? 'en' : 'pt';
    }
    
    /**
     * Inicializa o controlador
     */
    init() {
      this.updateTextsForLanguage(this.currentLang);
      this.setupEventListeners();
    }
    
    /**
     * Configura os event listeners
     */
    setupEventListeners() {
      if (this.langToggle) {
        this.langToggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleLanguage();
        });
      }

      // --- NOVO BLOCO ADICIONADO ---
      this.navButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
          e.preventDefault();
          const target = button.getAttribute('href');
          
          // Aplica animação de saída
          this.aboutContent.classList.add('fade-out-down');
          
          // Aguarda a animação terminar
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Navegação
          window.location.href = target;
        });
      });
    }
    
    /**
     * Alterna entre idiomas
     */
    toggleLanguage() {
      this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
      if (window.pageManager) {
        window.pageManager.saveCurrentLanguage(this.currentLang);
      }
      this.updateTextsForLanguage(this.currentLang);
    }
    
    /**
     * Atualiza os textos com base no idioma
     * @param {string} lang - Código do idioma (pt/en)
     */
    updateTextsForLanguage(lang) {
      const paragraphs = this.aboutText.querySelectorAll('p');
      if (lang === 'en') {
        this.aboutTitle.textContent = 'About Me';
        if (paragraphs.length >= 2) {
          paragraphs[0].textContent = 'Hello! I\'m Gabriel Rocha, a developer passionate about creating amazing digital experiences.';
          paragraphs[1].textContent = 'This is the "About Me" section of my portfolio, where you can learn more about my journey, skills, and projects.';
        }
        this.navButtons.forEach(button => {
          if (button.getAttribute('href') === '#home') button.textContent = 'Back';
          else if (button.getAttribute('href') === '#projects') button.textContent = 'Projects';
        });
        this.langToggle.textContent = 'Português';
      } else {
        this.aboutTitle.textContent = 'Sobre Mim';
        if (paragraphs.length >= 2) {
          paragraphs[0].textContent = 'Olá! Sou Gabriel Rocha, um desenvolvedor apaixonado por criar experiências digitais incríveis.';
          paragraphs[1].textContent = 'Esta é a seção "Sobre Mim" do meu portfólio, onde você pode conhecer mais sobre minha jornada, habilidades e projetos.';
        }
        this.navButtons.forEach(button => {
          if (button.getAttribute('href') === '#home') button.textContent = 'Voltar';
          else if (button.getAttribute('href') === '#projects') button.textContent = 'Projetos';
        });
        this.langToggle.textContent = 'English';
      }
    }
  }

  new AboutController();
})();