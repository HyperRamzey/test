'use strict';

class ScriptHub {
  constructor() {
    this.scripts = [];
    this.modals = new Map();
    this.currentModal = null;
    this.searchTimeout = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeModals();
    this.setupSearch();
    this.setupScrollEffects();
    this.setupImageGallery();
    this.setupVersionHistory();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMenuToggle();
      this.setupCopyButtons();
      this.setupModalTriggers();
      this.setupBackToTop();
    });

    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
  }

  setupMenuToggle() {
    const menuBtn = document.getElementById('menu-btn');
    const flyoutMenu = document.getElementById('flyout-menu');

    if (menuBtn && flyoutMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = flyoutMenu.classList.contains('open');
        flyoutMenu.classList.toggle('open');
        flyoutMenu.setAttribute('aria-hidden', isOpen.toString());
        menuBtn.setAttribute('aria-expanded', (!isOpen).toString());
      });

      document.addEventListener('click', (e) => {
        if (!flyoutMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          flyoutMenu.classList.remove('open');
          flyoutMenu.setAttribute('aria-hidden', 'true');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const scriptId = button.getAttribute('data-script');
        const scriptElement = document.getElementById(scriptId);
        
        if (scriptElement) {
          try {
            await navigator.clipboard.writeText(scriptElement.textContent);
            this.showCopySuccess(button);
          } catch (err) {
            this.fallbackCopyTextToClipboard(scriptElement.textContent);
            this.showCopySuccess(button);
          }
        }
      });
    });
  }

  async showCopySuccess(button) {
    const originalText = button.textContent;
    button.classList.add('copied');
    button.textContent = 'Copied!';
    
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = originalText;
    }, 2000);
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  initializeModals() {
    const modals = [
      { id: 'executor-modal', trigger: 'executor-info-btn' },
      { id: 'changelog-modal', trigger: 'changelog-btn' },
      { id: 'pet-modal', trigger: 'pet-info-btn' }
    ];

    modals.forEach(({ id, trigger }) => {
      const modal = document.getElementById(id);
      const triggerBtn = document.getElementById(trigger);
      
      if (modal && triggerBtn) {
        this.modals.set(id, modal);
        
        triggerBtn.addEventListener('click', () => {
          this.openModal(id);
        });

        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            this.closeModal(id);
          });
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeCurrentModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCurrentModal();
      }
    });
  }

  openModal(modalId) {
    const modal = this.modals.get(modalId);
    if (modal) {
      this.currentModal = modalId;
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  closeModal(modalId) {
    const modal = this.modals.get(modalId);
    if (modal) {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.currentModal = null;
    }
  }

  closeCurrentModal() {
    if (this.currentModal) {
      this.closeModal(this.currentModal);
    }
  }

  setupModalTriggers() {
    const petInfoBtn = document.querySelector('#pet-info-btn');
    if (petInfoBtn) {
      petInfoBtn.addEventListener('click', () => {
        this.openModal('pet-modal');
      });
    }
  }

  setupSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
      searchBar.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }
  }

  performSearch(query) {
    const scriptCards = document.querySelectorAll('.script-card');
    const normalizedQuery = query.toLowerCase().trim();

    scriptCards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
      const categories = card.getAttribute('data-category')?.toLowerCase() || '';
      
      const matches = title.includes(normalizedQuery) ||
                     tags.some(tag => tag.includes(normalizedQuery)) ||
                     categories.includes(normalizedQuery);

      if (matches || !normalizedQuery) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0.3';
        card.style.transform = 'scale(0.95)';
      }
    });
  }

  setupScrollEffects() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  handleScroll() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  handleResize() {
    const flyoutMenu = document.getElementById('flyout-menu');
    if (flyoutMenu && window.innerWidth > 768) {
      flyoutMenu.classList.remove('open');
      flyoutMenu.setAttribute('aria-hidden', 'true');
    }
  }

  setupImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const imageOverlay = document.getElementById('image-overlay');
    const enlargedImage = document.getElementById('enlarged-image');
    const closeOverlay = document.querySelector('.close-overlay');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        if (imageOverlay && enlargedImage) {
          enlargedImage.src = img.src;
          enlargedImage.alt = img.alt;
          imageOverlay.classList.add('active');
          imageOverlay.setAttribute('aria-hidden', 'false');
        }
      });
    });

    if (closeOverlay && imageOverlay) {
      closeOverlay.addEventListener('click', () => {
        imageOverlay.classList.remove('active');
        imageOverlay.setAttribute('aria-hidden', 'true');
      });

      imageOverlay.addEventListener('click', (e) => {
        if (e.target === imageOverlay) {
          imageOverlay.classList.remove('active');
          imageOverlay.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  setupVersionHistory() {
    const versionHistory = [
      {
        date: '2025-01-15',
        version: 'v2.1.0',
        changes: [
          'Added new pet spawner functionality',
          'Improved visual effects performance',
          'Fixed compatibility issues with latest executors'
        ]
      },
      {
        date: '2025-01-10',
        version: 'v2.0.5',
        changes: [
          'Enhanced UI responsiveness',
          'Added dark mode optimizations',
          'Bug fixes and stability improvements'
        ]
      },
      {
        date: '2025-01-05',
        version: 'v2.0.0',
        changes: [
          'Complete UI redesign',
          'Added TypeScript support',
          'Improved accessibility features',
          'Enhanced mobile experience'
        ]
      }
    ];

    const versionHistoryContent = document.getElementById('version-history-content');
    if (versionHistoryContent) {
      versionHistory.forEach(version => {
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item';
        versionItem.innerHTML = `
          <div class="version-date">${version.date} - ${version.version}</div>
          <div class="version-changes">
            <ul>
              ${version.changes.map(change => `<li>${change}</li>`).join('')}
            </ul>
          </div>
        `;
        versionHistoryContent.appendChild(versionItem);
      });
    }
  }

  setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
    };
    this.init();
  }

  init() {
    this.measureLoadTime();
    this.observePerformance();
  }

  measureLoadTime() {
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      console.log(`Page load time: ${this.metrics.loadTime.toFixed(2)}ms`);
    });
  }

  observePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            console.log(`FCP: ${this.metrics.firstContentfulPaint.toFixed(2)}ms`);
          }
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.largestContentfulPaint = entry.startTime;
            console.log(`LCP: ${this.metrics.largestContentfulPaint.toFixed(2)}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }
  }
}

class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupFocusManagement() {
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }

  setupScreenReaderSupport() {
    const scriptCards = document.querySelectorAll('.script-card');
    
    scriptCards.forEach((card, index) => {
      const title = card.querySelector('h2').textContent;
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
      
      card.setAttribute('aria-label', `Script ${index + 1}: ${title}. Tags: ${tags}`);
    });
  }
}

class CacheManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupServiceWorker();
    this.setupCacheHeaders();
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    }
  }

  setupCacheHeaders() {
    const metaTags = [
      { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.httpEquiv = tag.httpEquiv;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }
}

// Initialize the application
const app = new ScriptHub();
const performanceMonitor = new PerformanceMonitor();
const accessibilityManager = new AccessibilityManager();
const cacheManager = new CacheManager(); 