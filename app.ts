interface ScriptData {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

interface PerformanceMetrics {
  gpuAcceleration: {
    supported: boolean;
    active: boolean;
    features: {
      webgl: boolean;
      transform3d: boolean;
      backfaceVisibility: boolean;
      willChange: boolean;
      contain: boolean;
      backdropFilter: boolean;
    };
  };
  compositeLayerCount: number;
  renderingStats: Record<string, number>;
}

class ScriptHub {
  private scripts: ScriptData[] = [];
  private currentScreen: string = 'bios';
  private searchBar!: HTMLInputElement;
  private scriptCards!: NodeListOf<Element>;

  constructor() {
    this.initializeScripts();
    this.setupEventListeners();
    this.startScreenSequence();
  }

  private initializeScripts(): void {
    this.scripts = [
      {
        id: 'auto-farm',
        title: 'Eclipse Hub - Adopt Me Autofarm',
        description: 'This script for Adopt Me will automatically farm for you, collecting cash and helping you get your dream pets faster than ever before. It\'s safe, efficient, and easy to use.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/EclipseHub/Scripts/main/AutoFarm.lua"))()',
        tags: ['updated', 'working', 'verified']
      },
      {
        id: 'pet-spawner-visual',
        title: 'Adopt Me - Pet Spawner {FIXED, VISUAL ONLY}',
        description: 'Spawn and customise pets visually – no serverside.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/PetSpawner/Scripts/main/VisualSpawner.lua"))()',
        tags: ['fixed', 'visual', 'verified']
      },
      {
        id: 'trade-checker',
        title: 'Adopt Me - Trade Value Checker',
        description: 'Check trade values instantly to avoid bad trades.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/TradeChecker/Scripts/main/ValueChecker.lua"))()',
        tags: ['updated', 'working', 'verified']
      },
      {
        id: 'trade-bypass',
        title: 'Adopt Me - Trade Bypass',
        description: 'Bypass trade restrictions effortlessly.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/TradeBypass/Scripts/main/Bypass.lua"))()',
        tags: ['updated', 'working', 'verified']
      },
      {
        id: 'food-money',
        title: 'Adopt Me - Food Money Exploit',
        description: 'Exploit food mechanics to earn cash quickly.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/FoodMoney/Scripts/main/Exploit.lua"))()',
        tags: ['updated', 'working', 'verified']
      },
      {
        id: 'fps-boost',
        title: 'Adopt Me - FPS Boost & Unlock, Better Graphics, Shaders',
        description: 'Boost your FPS, unlock better graphics and add beautiful shaders to enhance your Adopt Me gaming experience.',
        content: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/FPSBoost/Scripts/main/Graphics.lua"))()',
        tags: ['updated', 'working', 'premium', 'verified']
      }
    ];
  }

  private setupEventListeners(): void {
    this.searchBar = document.getElementById('search-bar') as HTMLInputElement;
    this.scriptCards = document.querySelectorAll('.script-card');

    if (this.searchBar) {
      this.searchBar.addEventListener('input', this.handleSearch.bind(this));
    }

    this.scriptCards?.forEach(card => {
      card.addEventListener('click', this.handleScriptCardClick.bind(this));
    });

    document.addEventListener('click', this.handleGlobalClick.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private startScreenSequence(): void {
    setTimeout(() => {
      this.showScreen('xp-login');
    }, 4000);

    setTimeout(() => {
      this.showScreen('entry');
    }, 8000);
  }

  private showScreen(screenName: string): void {
    const screens = ['bios-screen', 'xp-login-screen', 'entry-screen', 'main-content'];
    
    screens.forEach(screen => {
      const element = document.getElementById(screen);
      if (element) {
        element.style.display = screen.includes(screenName) ? 'flex' : 'none';
      }
    });

    this.currentScreen = screenName;

    if (screenName === 'main') {
      this.initializeMainContent();
    }
  }

  private initializeMainContent(): void {
    this.setupWebGL();
    this.setupStarConstellation();
    this.setupWaveBackground();
    this.setupCustomCursor();
    this.setupPrompts();
    this.setupMenu();
    this.setupModals();
  }

  private setupWebGL(): void {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
    if (!gl) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      void main() {
        vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0);
        vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0,2,4));
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = this.createProgram(gl, vertexShader, fragmentShader);

    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const render = (time: number) => {
      if (timeUniformLocation) {
        gl.uniform1f(timeUniformLocation, time * 0.001);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  private setupStarConstellation(): void {
    const constellation = document.getElementById('star-constellation');
    if (!constellation) return;

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = Math.random() * 3 + 'px';
      star.style.height = star.style.width;
      star.style.background = 'white';
      star.style.borderRadius = '50%';
      star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
      constellation.appendChild(star);
    }
  }

  private setupWaveBackground(): void {
    const wave = document.getElementById('wave-background');
    if (!wave) return;

    const paths = wave.querySelectorAll('path');
    paths.forEach((path, index) => {
      path.style.animationDelay = `${index * 0.5}s`;
    });
  }

  private setupCustomCursor(): void {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  private setupPrompts(): void {
    setTimeout(() => {
      this.showPrompt('notification-prompt');
    }, 5000);

    setTimeout(() => {
      this.showPrompt('install-prompt');
    }, 10000);
  }

  private showPrompt(promptId: string): void {
    const prompt = document.getElementById(promptId);
    if (prompt) {
      prompt.classList.add('show');
    }
  }

  private setupMenu(): void {
    const menuBtn = document.getElementById('menu-btn');
    const flyoutMenu = document.getElementById('flyout-menu');

    menuBtn?.addEventListener('click', () => {
      flyoutMenu?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!menuBtn?.contains(e.target as Node) && !flyoutMenu?.contains(e.target as Node)) {
        flyoutMenu?.classList.remove('open');
      }
    });
  }

  private setupModals(): void {
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.close-modal');

    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay');
        modal?.classList.remove('show');
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
  }

  private handleSearch(e: Event): void {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase();

    this.scriptCards?.forEach(card => {
      const title = card.querySelector('h2')?.textContent?.toLowerCase() || '';
      const description = card.getAttribute('data-description')?.toLowerCase() || '';
      
      if (title.includes(query) || description.includes(query)) {
        (card as HTMLElement).style.display = 'block';
      } else {
        (card as HTMLElement).style.display = 'none';
      }
    });
  }

  private handleScriptCardClick(e: Event): void {
    const card = e.currentTarget as HTMLElement;
    const scriptId = card.getAttribute('data-script-id');
    const script = this.scripts.find(s => s.id === scriptId);

    if (script) {
      this.showScriptModal(script);
    }
  }

  private showScriptModal(script: ScriptData): void {
    const modal = document.getElementById('script-detail-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const copyBtn = document.getElementById('modal-copy-btn');

    if (modal && title && description && copyBtn) {
      title.textContent = script.title;
      description.textContent = script.description;
      
      copyBtn.onclick = () => {
        this.copyToClipboard(script.content);
        this.showScriptPreviewModal(script.content);
      };

      modal.classList.add('show');
    }
  }

  private showScriptPreviewModal(scriptContent: string): void {
    const modal = document.getElementById('script-preview-modal');
    const display = document.getElementById('script-link-display');
    const copyBtn = document.getElementById('manual-copy-btn');

    if (modal && display && copyBtn) {
      display.textContent = scriptContent;
      
      copyBtn.onclick = () => {
        this.copyToClipboard(scriptContent);
      };

      modal.classList.add('show');
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Script copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy script:', err);
    });
  }

  private handleGlobalClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.id === 'free-pet-placard') {
      this.showPetModal();
    }

    if (target.id === 'back-to-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (target.closest('#entry-screen')) {
      this.showScreen('main');
    }
  }

  private showPetModal(): void {
    const modal = document.getElementById('pet-modal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  private handleScroll(): void {
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }

  private handleResize(): void {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
}

class GPUPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    gpuAcceleration: {
      supported: false,
      active: false,
      features: {
        webgl: false,
        transform3d: false,
        backfaceVisibility: false,
        willChange: false,
        contain: false,
        backdropFilter: false
      }
    },
    compositeLayerCount: 0,
    renderingStats: {}
  };

  constructor() {
    this.detectGPUFeatures();
    this.optimizeAnimations();
    this.setupPerformanceObserver();
    this.createDebugPanel();
    this.startRealTimeMonitoring();
  }

  private detectGPUFeatures(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    this.metrics.gpuAcceleration = {
      supported: !!gl,
      active: !!gl,
      features: {
        webgl: !!gl,
        transform3d: this.supportsTransform3D(),
        backfaceVisibility: this.supportsBackfaceVisibility(),
        willChange: this.supportsWillChange(),
        contain: this.supportsContainment(),
        backdropFilter: this.supportsBackdropFilter()
      }
    };
    
    if (!this.metrics.gpuAcceleration.supported) {
      this.applyFallbackOptimizations();
    }
  }

  private supportsTransform3D(): boolean {
    const el = document.createElement('div');
    el.style.transform = 'translateZ(0)';
    return el.style.transform !== '';
  }

  private supportsBackfaceVisibility(): boolean {
    const prefixes = ['', '-webkit-', '-moz-', '-ms-'];
    const el = document.createElement('div');
    
    return prefixes.some(prefix => {
      el.style.cssText = `${prefix}backface-visibility: hidden;`;
      return el.style.length > 0;
    });
  }

  private supportsWillChange(): boolean {
    return 'willChange' in document.documentElement.style;
  }

  private supportsContainment(): boolean {
    return 'contain' in document.documentElement.style;
  }

  private supportsBackdropFilter(): boolean {
    const prefixes = ['backdropFilter', 'webkitBackdropFilter'];
    return prefixes.some(prop => prop in document.documentElement.style);
  }

  private optimizeAnimations(): void {
    const animatedElements = document.querySelectorAll(`
      .floating, .x-logo, .x-logo-svg, .dancing-text span,
      .script-card, .btn, .tag, .loader-bar, .bios-cursor
    `);
    
    animatedElements.forEach(el => {
      this.optimizeElement(el as HTMLElement);
    });
  }

  private optimizeElement(element: HTMLElement): void {
    const transforms = ['translateZ(0)', 'translate3d(0, 0, 0)'];
    const prefixes = ['-webkit-', '-moz-', '-ms-', ''];
    
    prefixes.forEach(prefix => {
      element.style.setProperty(`${prefix}transform`, 'translateZ(0)', 'important');
      element.style.setProperty(`${prefix}backface-visibility`, 'hidden', 'important');
    });
    
    if (this.metrics.gpuAcceleration.features.contain) {
      element.style.contain = 'layout style paint';
    }
    
    if (this.metrics.gpuAcceleration.features.willChange) {
      element.style.willChange = 'transform';
    }
    
    element.style.isolation = 'isolate';
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            this.metrics.renderingStats[entry.name] = entry.startTime;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint', 'navigation'] });
    }
  }

  private createDebugPanel(): void {
    if (new URLSearchParams(window.location.search).get('debug') !== 'true') {
      return;
    }

    const debugPanel = document.createElement('div');
    debugPanel.className = 'perf-debug';
    debugPanel.innerHTML = `
      <div><strong>GPU Acceleration Debug</strong></div>
      <div>GPU Support: ${this.metrics.gpuAcceleration.supported ? '✓' : '✗'}</div>
      <div>Composite Layers: <span id="layer-count">${this.metrics.compositeLayerCount}</span></div>
      <div>Transform3D: ${this.metrics.gpuAcceleration.features.transform3d ? '✓' : '✗'}</div>
      <div>Will-Change: ${this.metrics.gpuAcceleration.features.willChange ? '✓' : '✗'}</div>
      <div>Containment: ${this.metrics.gpuAcceleration.features.contain ? '✓' : '✗'}</div>
      <div>Backdrop Filter: ${this.metrics.gpuAcceleration.features.backdropFilter ? '✓' : '✗'}</div>
      <div>FCP: <span id="fcp-time">-</span>ms</div>
      <div>LCP: <span id="lcp-time">-</span>ms</div>
    `;
    
    document.body.appendChild(debugPanel);
  }

  private startRealTimeMonitoring(): void {
    setInterval(() => {
      this.updateDebugPanel();
      this.monitorCompositeLayers();
    }, 1000);
  }

  private updateDebugPanel(): void {
    const layerCountEl = document.getElementById('layer-count');
    const fcpTimeEl = document.getElementById('fcp-time');
    const lcpTimeEl = document.getElementById('lcp-time');
    
    if (layerCountEl) {
      layerCountEl.textContent = this.metrics.compositeLayerCount.toString();
    }
    
    if (fcpTimeEl && this.metrics.renderingStats['first-contentful-paint']) {
      fcpTimeEl.textContent = Math.round(this.metrics.renderingStats['first-contentful-paint']).toString();
    }
    
    if (lcpTimeEl && this.metrics.renderingStats['largest-contentful-paint']) {
      lcpTimeEl.textContent = Math.round(this.metrics.renderingStats['largest-contentful-paint']).toString();
    }
  }

  private monitorCompositeLayers(): void {
    const layerElements = document.querySelectorAll(`
      [style*="translateZ"], [style*="translate3d"], 
      [style*="will-change"], [style*="isolation"]
    `);
    
    this.metrics.compositeLayerCount = layerElements.length;
  }

  private applyFallbackOptimizations(): void {
    const elements = document.querySelectorAll('.script-card, .btn, .tag');
    
    elements.forEach(el => {
      const element = el as HTMLElement;
      element.style.animation = 'none';
      element.style.transition = 'opacity 0.3s ease';
      
      element.addEventListener('mouseenter', () => {
        element.style.opacity = '0.8';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.opacity = '1';
      });
    });
  }
}

class IntersectionOptimizer {
  constructor() {
    this.init();
  }

  private init(): void {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    }
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.willChange = 'transform, opacity';
          
          if (entry.target.classList.contains('script-card')) {
            (entry.target as HTMLElement).style.animationPlayState = 'running';
          }
        } else {
          (entry.target as HTMLElement).style.willChange = 'auto';
          
          if (entry.target.classList.contains('script-card')) {
            (entry.target as HTMLElement).style.animationPlayState = 'paused';
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    const elements = document.querySelectorAll('.script-card, .btn, .tag, .floating');
    elements.forEach(el => observer.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  (window as any).gpuMonitor = new GPUPerformanceMonitor();
  (window as any).intersectionOptimizer = new IntersectionOptimizer();
  
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const handleMobileOptimization = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.body.classList.add('mobile-optimized');
      
      const complexAnimations = document.querySelectorAll('.floating, .x-logo, .dancing-text span');
      complexAnimations.forEach(el => {
        (el as HTMLElement).style.animationDuration = '4s';
        (el as HTMLElement).style.animationTimingFunction = 'ease-in-out';
      });
    } else {
      document.body.classList.remove('mobile-optimized');
    }
  };
  
  mediaQuery.addListener(handleMobileOptimization);
  handleMobileOptimization(mediaQuery as any);
  
  window.addEventListener('beforeunload', () => {
    const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
    elementsWithWillChange.forEach(el => {
      (el as HTMLElement).style.willChange = 'auto';
    });
    
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
    });
  });
  
  console.log('GPU Acceleration System Initialized');
  console.log('Performance Monitor Active');
  console.log('Cross-Browser Optimizations Applied');
  console.log('Mobile Optimizations Ready');
  console.log('Add ?debug=true to URL for performance panel');
});

(window as any).GPU_ACCELERATION_INFO = {
  version: '2.0.0',
  features: 'Cross-browser GPU acceleration with comprehensive performance monitoring',
  usage: 'Add ?debug=true to URL to see performance metrics'
};

const app = new ScriptHub(); 