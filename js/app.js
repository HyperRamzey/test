const APP_VERSION = '2.0.0';

let frameCount = 0;
let lastFrameTime = performance.now();
let fps = 60;

const isGPUSupported = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl !== null;
};

const getRefreshRate = () => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrames = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        resolve(fps);
        return;
      }
      requestAnimationFrame(countFrames);
    };
    
    requestAnimationFrame(countFrames);
  });
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const copyScript = (scriptType) => {
  const scripts = {
    'infinite-yield': 'loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()',
    'dex-explorer': 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/master/Universal/BypassedDarkDexV3.lua"))()',
    'remote-spy': 'loadstring(game:HttpGet("https://raw.githubusercontent.com/78n/SimpleSpy/master/SimpleSpySource.lua"))()'
  };
  
  const script = scripts[scriptType];
  if (script) {
    navigator.clipboard.writeText(script).then(() => {
      showNotification('Script copied to clipboard!');
    }).catch(() => {
      showNotification('Failed to copy script');
    });
  }
};

const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const toggleTheme = () => {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    themeIcon.textContent = 'Moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    themeIcon.textContent = 'Sun';
    localStorage.setItem('theme', 'dark');
  }
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('.theme-icon').textContent = 'Sun';
  }
};

let deferredPrompt;

const enableNotifications = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showNotification('Notifications enabled!');
        dismissPrompt('notification-prompt');
      }
    });
  }
};

const dismissPrompt = (promptId) => {
  const prompt = document.getElementById(promptId);
  if (prompt) {
    prompt.style.display = 'none';
  }
};

const updatePerformanceMetrics = () => {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastFrameTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
    frameCount = 0;
    lastFrameTime = currentTime;
    
    const fpsDisplay = document.getElementById('fps-display');
    if (fpsDisplay) {
      fpsDisplay.textContent = `${fps} FPS`;
    }
  }
  
  requestAnimationFrame(updatePerformanceMetrics);
};

const initApp = () => {
  console.log(`xlam HUB v${APP_VERSION} initializing...`);
  
  loadTheme();
  
  if (isGPUSupported()) {
    console.log('GPU acceleration supported');
    document.body.classList.add('gpu-accelerated');
  } else {
    console.log('GPU acceleration not supported');
  }
  
  getRefreshRate().then(rate => {
    console.log(`Detected refresh rate: ${rate}Hz`);
    fps = rate;
  });
  
  updatePerformanceMetrics();
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installButton = document.getElementById('install-pwa');
    if (installButton) {
      installButton.style.display = 'block';
    }
  });
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  const menuBtn = document.getElementById('menu-btn');
  const flyoutMenu = document.getElementById('flyout-menu');
  
  if (menuBtn && flyoutMenu) {
    menuBtn.addEventListener('click', () => {
      flyoutMenu.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
      if (!flyoutMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        flyoutMenu.classList.remove('open');
      }
    });
  }
  
  const installButton = document.getElementById('install-pwa');
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
        installButton.style.display = 'none';
        dismissPrompt('install-prompt');
      }
    });
  }
  
  setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const notificationPrompt = document.getElementById('notification-prompt');
      if (notificationPrompt) {
        notificationPrompt.style.display = 'flex';
      }
    }
    
    if ('serviceWorker' in navigator) {
      const installPrompt = document.getElementById('install-prompt');
      if (installPrompt) {
        installPrompt.style.display = 'flex';
      }
    }
  }, 2000);
  
  console.log('xlam HUB initialized successfully');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.scrollToSection = scrollToSection;
window.copyScript = copyScript;
window.enableNotifications = enableNotifications;
window.dismissPrompt = dismissPrompt;

// Copy buttons functionality with loading bar and emoji
const copyButtons = document.querySelectorAll('.copy-btn');
const emojis = ['❤️', '💖', '💗', '💓', '💕', '💞'];

copyButtons.forEach(copyBtn => {
  let isLoading = false;
  let isCopied = false;
  const originalButtonHTML = copyBtn.innerHTML;
  copyBtn.addEventListener('click', async (event) => {
    if (isLoading) return;
    if (isCopied) {
      copyBtn.innerHTML = originalButtonHTML;
      copyBtn.classList.remove('copied');
      isCopied = false;
      return;
    }
    const button = event.currentTarget;
    const scriptCard = button.closest('.script-card');
    const preElement = scriptCard.querySelector('pre');
    let scriptText = preElement.dataset.script === 'RANDOM' ? 'loadstring(game:HttpGet(\'https://example.com/script\'))()' : preElement.dataset.script;
    isLoading = true;
    const originalPreText = preElement.innerText;
    preElement.innerText = '';
    preElement.style.position = 'relative';
    const loaderHTML = `
      <div class="loader-container">
        <div class="loader-bar"></div>
        <div class="loader-text">
          <span>Generating Script for you</span>
          <span class="emoji">${emojis[Math.floor(Math.random() * emojis.length)]}</span>
        </div>
      </div>
    `;
    preElement.insertAdjacentHTML('beforeend', loaderHTML);
    const loaderBar = preElement.querySelector('.loader-bar');
    loaderBar.style.width = '0%';
    setTimeout(() => {
      loaderBar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
      loaderBar.style.width = '100%';
    }, 50);
    setTimeout(async () => {
      preElement.innerText = scriptText;
      try {
        await navigator.clipboard.writeText(scriptText);
        copyBtn.innerHTML = '✓ Copied!';
        copyBtn.classList.add('copied');
        isCopied = true;
      } catch (e) {
        copyBtn.innerHTML = 'Failed!';
      }
      isLoading = false;
      setTimeout(() => {
        copyBtn.innerHTML = originalButtonHTML;
        copyBtn.classList.remove('copied');
        isCopied = false;
        preElement.innerText = originalPreText;
      }, 2000);
    }, 1400);
  });
}); 