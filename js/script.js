/* =========================
   加载屏
========================= */
var pageLoadStart = Date.now();   // 记录脚本开始执行的时刻

/* =========================
   全局变量与初始化
========================= */
const ThemeManager = {
  STORAGE_KEY: 'site-theme',
  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'auto';
  },
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateMetaThemeColor();
    if (document.querySelector('.giscus')) {
      initGiscus();
    }
    // 安全调用：若 ColorThemeManager 已定义，则重新应用颜色
    if (typeof ColorThemeManager !== 'undefined') {
      ColorThemeManager.applyColor(ColorThemeManager.getColor());
    }
  },
  updateMetaThemeColor() {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = this.getTheme();
    if (theme === 'dark' || (theme === 'auto' && isDark)) {
      meta.content = '#201418';
    } else {
      meta.content = '#FFFBFF';
    }
  },
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'auto';
    this.setTheme(saved);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.getTheme() === 'auto') {
        this.updateMetaThemeColor();
      }
    });
  }
};

/* =========================
   主题颜色管理器（含播放器适配）
========================= */
const ColorThemeManager = {
  STORAGE_KEY: 'site-color-theme',

  themes: {
    pink: {
      light: {
        // 页面全局变量
        '--color-bg': '#FFFBFF',
        '--color-pink': '#ff95bc',
        '--color-pink-soft': 'rgba(255,216,231,0.7)',
        '--color-svg': '#352f31',
        '--sidebar-bg': 'rgba(240,240,240)',
        '--sidebar-a': 'rgba(106,106,106,0.2)',
        '--sidebar-bg-mobile': 'rgba(247,236,244,0.8)',
        '--card-bg': '#F7ECF4',
        '--content-card-bg': 'rgb(250,242,248)',
        '--profile-card-bg': 'rgb(250,242,248)',
        '--about-card-bg': 'rgb(250,242,248)',
        '--home-link-card-bg': 'rgb(250,242,248)',
        '--article-card-bg': '#F7ECF4',
        '--profile-list-bg': 'rgba(255,216,231,0.3)',
        '--about-list-bg': 'rgba(255,216,231,0.3)',
        '--time-badge-bg': 'rgba(255,216,231,0.8)',
        '--li-a-bg': 'rgba(255,216,231,0.8)',
        '--li-a-hover-bg': 'rgba(253,176,210,0.626)',
        '--slogan-color': '#e91e63',
        '--slogan-text-shadow': '0 2px 8px rgba(233,30,99,0.25)',
        '--thoughts-color': '#b06a8c',
        '--thoughts-bg': 'rgba(255,235,245,0.5)',
        '--thoughts-border': '#f8bbd0',
        '--nav-time-bg': 'rgba(255,216,231,0.8)',
        // 播放器变量
        player: {
          '--playerColor-1': '#fffbff',
          '--playerColor-2': '#1f1a1c',
          '--playerColor-3': '#fdd9e7',
          '--playerColor-4': '#504348',
          '--playerColor-5': '#1C1B1F',
          '--playerColor-6': '#ae1d79',
          '--playerColor-7': '#fdd9e7',
          '--playerColor-8': '#3d0027',
          '--playerColor-9': '#f1dee4',
          '--playerColor-10': '#7f553a',
          '--playerColor-11': '#C27E94',
          '--playerColor-12': '#301401',
          '--playerColor-rgab-1': 'rgba(176,0,92,0.08)',
          '--playerColor-rgab-2': 'rgba(255,255,255,0.8)',
          '--playerShadow-1': '0px 4px 8px 3px rgba(176,0,92,0.05),0px 1px 3px 0px rgba(0,0,0,0.08)',
          '--playerShadow-2': '-4px 4px 8px 0px rgba(176,0,92,0.08),inset -4px 4px 10px 0px rgba(0,0,0,0.03)',
          '--playerTextShadow-1': '0 0 1px rgba(176,0,92,0.15)',
          '--playerTextShadow-2': '0 0 1px rgba(255,255,255,0.5)'
        }
      },
      dark: {
        // 页面全局变量
        '--color-bg': '#1F1A1C',
        '--color-pink': '#ffb3cf',
        '--color-pink-soft': 'rgba(255,179,207,0.25)',
        '--color-svg': '#fed9e6',
        '--sidebar-bg': 'rgba(30,30,30)',
        '--sidebar-a': 'rgba(106,106,106,0.6)',
        '--sidebar-bg-mobile': 'rgba(49,38,42,0.8)',
        '--card-bg': '#2A2125',
        '--content-card-bg': '#2A2125',
        '--profile-card-bg': '#2A2125',
        '--about-card-bg': '#2A2125',
        '--home-link-card-bg': '#2A2125',
        '--article-card-bg': '#2A2125',
        '--profile-list-bg': 'rgba(90,63,72,0.5)',
        '--about-list-bg': 'rgba(90,63,72,0.5)',
        '--time-badge-bg': 'rgba(255,179,207,0.2)',
        '--li-a-bg': 'rgba(255,179,207,0.25)',
        '--li-a-hover-bg': 'rgba(255,179,207,0.35)',
        '--slogan-color': '#f48fb1',
        '--slogan-text-shadow': '0 2px 12px rgba(244,143,177,0.35)',
        '--thoughts-color': '#f8bbd0',
        '--thoughts-bg': 'rgba(255,210,225,0.08)',
        '--thoughts-border': '#f06292',
        '--nav-time-bg': 'rgba(255,179,207,0.2)',
        // 播放器变量
        player: {
          '--playerColor-1': '#1f1a1c',
          '--playerColor-2': '#ebe0e2',
          '--playerColor-3': '#59404b',
          '--playerColor-4': '#d4c2c8',
          '--playerColor-5': '#FFB3C6',
          '--playerColor-6': '#ffafd5',
          '--playerColor-7': '#5C3A47',
          '--playerColor-8': '#ffd8e8',
          '--playerColor-9': '#504348',
          '--playerColor-10': '#D27B94',
          '--playerColor-11': '#F5C2D2',
          '--playerColor-12': '#FFDFED',
          '--playerColor-rgab-1': 'rgba(255,223,237,0.12)',
          '--playerColor-rgab-2': 'rgba(65,42,52,0.7)',
          '--playerShadow-1': '0px 4px 8px 3px rgba(0,0,0,0.3),0px 1px 3px 0px rgba(0,0,0,0.4)',
          '--playerShadow-2': '-4px 4px 8px 0px rgba(0,0,0,0.4),inset -4px 4px 10px 0px rgba(255,223,237,0.05)',
          '--playerTextShadow-1': '0 0 1px rgba(255,179,198,0.4)',
          '--playerTextShadow-2': '0 0 1px rgba(0,0,0,0.5)'
        }
      }
    },

    blue: {
      light: {
        '--color-bg': '#FBFCFE',
        '--color-pink': '#006689',
        '--color-pink-soft': '#C3E8FF',
        '--color-svg': '#2f4554',
        '--sidebar-bg': '#001E2C',
        '--sidebar-a': 'rgba(106,106,106,0.2)',
        '--sidebar-bg-mobile': 'rgba(231,240,245,0.8)',
        '--card-bg': '#EFF5F8',
        '--content-card-bg': '#EFF5F8',
        '--profile-card-bg': '#EFF5F8',
        '--about-card-bg': '#EFF5F8',
        '--home-link-card-bg': '#EFF5F8',
        '--article-card-bg': '#EFF5F8',
        '--profile-list-bg': '#D1E5F4',
        '--about-list-bg': '#D1E5F4',
        '--time-badge-bg': 'rgba(195,232,255,0.6)',
        '--li-a-bg': 'rgba(195,232,255,0.8)',
        '--li-a-hover-bg': 'rgba(127,180,224,1)',
        '--slogan-color': '#006689',
        '--slogan-text-shadow': '0 2px 8px rgba(59,122,191,0.2)',
        '--thoughts-color': '#006689',
        '--thoughts-bg': 'D1E5F4',
        '--thoughts-border': '#C3E8FF',
        '--nav-time-bg': 'rgba(195,232,255,0.6)',
        player: {
          '--playerColor-1': '#f4f9fd',
          '--playerColor-2': '#1a2a38',
          '--playerColor-3': '#d9eaf8',
          '--playerColor-4': '#3e5a70',
          '--playerColor-5': '#1C1B1F',
          '--playerColor-6': '#5b9bd5',
          '--playerColor-7': '#d9eaf8',
          '--playerColor-8': '#0f2a3f',
          '--playerColor-9': '#e4f0f8',
          '--playerColor-10': '#7f553a',
          '--playerColor-11': '#6c8ebf',
          '--playerColor-12': '#301401',
          '--playerColor-rgab-1': 'rgba(91,155,213,0.08)',
          '--playerColor-rgab-2': 'rgba(255,255,255,0.8)',
          '--playerShadow-1': '0px 4px 8px 3px rgba(91,155,213,0.05),0px 1px 3px 0px rgba(0,0,0,0.08)',
          '--playerShadow-2': '-4px 4px 8px 0px rgba(91,155,213,0.08),inset -4px 4px 10px 0px rgba(0,0,0,0.03)',
          '--playerTextShadow-1': '0 0 1px rgba(91,155,213,0.15)',
          '--playerTextShadow-2': '0 0 1px rgba(255,255,255,0.5)'
        }
      },
      dark: {
        '--color-bg': '#17212b',
        '--color-pink': '#91c0f0',
        '--color-pink-soft': 'rgba(145,192,240,0.25)',
        '--color-svg': '#c8ddf0',
        '--sidebar-bg': 'rgba(20,28,36)',
        '--sidebar-a': 'rgba(100,130,160,0.5)',
        '--sidebar-bg-mobile': 'rgba(25,35,45,0.85)',
        '--card-bg': '#1c2a33',
        '--content-card-bg': '#1c2a33',
        '--profile-card-bg': '#1c2a33',
        '--about-card-bg': '#1c2a33',
        '--home-link-card-bg': '#1c2a33',
        '--article-card-bg': '#1c2a33',
        '--profile-list-bg': 'rgba(30,60,90,0.5)',
        '--about-list-bg': 'rgba(30,60,90,0.5)',
        '--time-badge-bg': 'rgba(145,192,240,0.2)',
        '--li-a-bg': 'rgba(145,192,240,0.25)',
        '--li-a-hover-bg': 'rgba(145,192,240,0.35)',
        '--slogan-color': '#91c0f0',
        '--slogan-text-shadow': '0 2px 12px rgba(145,192,240,0.35)',
        '--thoughts-color': '#b8d8f8',
        '--thoughts-bg': 'rgba(30,60,90,0.15)',
        '--thoughts-border': '#4a7ca5',
        '--nav-time-bg': 'rgba(145,192,240,0.2)',
        player: {
          '--playerColor-1': '#17212b',
          '--playerColor-2': '#d4e4f5',
          '--playerColor-3': '#2e4358',
          '--playerColor-4': '#b8d4f0',
          '--playerColor-5': '#91c0f0',
          '--playerColor-6': '#91c0f0',
          '--playerColor-7': '#2e4358',
          '--playerColor-8': '#d4e4f5',
          '--playerColor-9': '#3a4a5a',
          '--playerColor-10': '#a4c2d8',
          '--playerColor-11': '#8ab8e0',
          '--playerColor-12': '#e4f0f8',
          '--playerColor-rgab-1': 'rgba(145,192,240,0.12)',
          '--playerColor-rgab-2': 'rgba(23,33,43,0.7)',
          '--playerShadow-1': '0px 4px 8px 3px rgba(0,0,0,0.3),0px 1px 3px 0px rgba(0,0,0,0.4)',
          '--playerShadow-2': '-4px 4px 8px 0px rgba(0,0,0,0.4),inset -4px 4px 10px 0px rgba(145,192,240,0.05)',
          '--playerTextShadow-1': '0 0 1px rgba(145,192,240,0.4)',
          '--playerTextShadow-2': '0 0 1px rgba(0,0,0,0.5)'
        }
      }
    }
  },

  getColor() {
    return localStorage.getItem(this.STORAGE_KEY) || 'pink';
  },

  isDarkMode() {
    const theme = ThemeManager.getTheme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  applyColor(name) {
    const mode = this.isDarkMode() ? 'dark' : 'light';
    const vars = this.themes[name]?.[mode] || this.themes.pink[mode];

    // 应用全局页面变量
    Object.entries(vars).forEach(([prop, value]) => {
      if (prop !== 'player') {
        document.documentElement.style.setProperty(prop, value);
      }
    });

    // 应用播放器变量
    const playerEl = document.querySelector('#xf-MusicPlayer .xf-girlPink');
    if (playerEl && vars.player) {
      Object.entries(vars.player).forEach(([prop, value]) => {
        playerEl.style.setProperty(prop, value);
      });
    }

    this.updateActiveButton(name);
  },

  setColor(name) {
    localStorage.setItem(this.STORAGE_KEY, name);
    this.applyColor(name);
  },

  updateActiveButton(name) {
    document.querySelectorAll('.theme-color-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.color === name) btn.classList.add('active');
    });
  },

  init() {
    const saved = this.getColor();
    this.applyColor(saved);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (ThemeManager.getTheme() === 'auto') {
        this.applyColor(this.getColor());
      }
    });
  }
};

/* =========================
   动画执行
========================= */
function playEnterAnimation(selectors) {
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // 一：清除旧类，设置内联初始状态
  elements.forEach(el => {
    el.classList.remove('fade-out', 'fade-in');
    if (el.matches('.header-container')) return;
    el.style.opacity = '0';
    if (el.matches('.logo')) {
      // 左侧滑入
      el.style.transform = 'translateX(-20px)';
    } else if (el.matches('.settings-button-m')) {
      // 右侧滑入
      el.style.transform = 'translateX(20px)';
    } else if (el.matches('.article-card, .comment-content')) {
      el.style.transform = isMobile
        ? 'translateY(15px)'
        : 'translateX(-50%) translateY(15px)';
    } else {
      el.style.transform = 'translateY(15px)';
    }
  });

  // 二：强制重排，让浏览器记录内联样式
  void document.body.offsetWidth;

  // 三：移除内联样式并添加 .fade-in，触发过渡
  elements.forEach(el => {
    if (el.matches('.header-container')) {
      el.classList.add('fade-in');
      return;
    }
    el.style.opacity = '';
    el.style.transform = '';
    el.classList.add('fade-in');
  });
}

async function loadPage(url, addToHistory = true) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    let newContent = doc.querySelector('.home-content') || doc.querySelector('.content');
    const newLogo = doc.querySelector('.logo');
    const newHeaderContainer = doc.querySelector('.header-container');
    const newHeader = doc.querySelector('.article-header');
    const newArticleCard = doc.querySelector('.article-card');
    const newFooter = doc.querySelector('.footer');
    let newCommentContent = doc.querySelector('.comment-content');
    if (newCommentContent && newContent && newContent.contains(newCommentContent)) {
      newCommentContent.remove();
    }

    const currentLogo = document.querySelector('.logo');
    let currentContent = document.querySelector('.home-content') || document.querySelector('.content');
    const currentSettingsBtn = document.querySelector('.settings-button-m');
    let currentHeaderContainer = document.querySelector('.header-container');
    let currentHeader = document.querySelector('.article-header');
    let currentArticleCard = document.querySelector('.article-card');
    let currentFooter = document.querySelector('.footer');
    let currentCommentContent = document.querySelector('.comment-content');

    // ---------- 1. 其他元素通用退场 ----------
    const outElements = [
      currentContent,
      currentLogo,
      currentSettingsBtn,
      currentHeader,
      currentArticleCard,
      currentFooter,
      currentCommentContent,
    ].filter(Boolean);

    outElements.forEach(el => {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');
    });

    // ---------- 2. 头图专属退场动画 ----------
    const heroOutPromise = new Promise(resolve => {
      if (currentHeaderContainer) {
        currentHeaderContainer.classList.remove('fade-in', 'fade-out');
        currentHeaderContainer.classList.add('hero-out');

        const onAnimationEnd = () => {
          currentHeaderContainer.removeEventListener('animationend', onAnimationEnd);
          currentHeaderContainer.classList.remove('hero-out');
          resolve();
        };
        currentHeaderContainer.addEventListener('animationend', onAnimationEnd, { once: true });

        setTimeout(resolve, 500);
      } else {
        resolve();
      }
    });

    await heroOutPromise;
    if (!currentHeaderContainer) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    // ---------- 3. DOM 替换 ----------
    window.scrollTo({ top: 0, behavior: 'auto' });

    // --- 主内容容器 ---
    if (newContent && currentContent) {
      currentContent.innerHTML = newContent.innerHTML;
      currentContent.className = newContent.className;
    } else if (newContent && !currentContent) {
      const ref = currentHeaderContainer || currentHeader || currentArticleCard || currentFooter;
      if (ref && ref.parentNode) {
        ref.parentNode.insertBefore(newContent, ref.nextSibling);
      } else {
        document.body.appendChild(newContent);
      }
      currentContent = newContent;
    } else if (!newContent && currentContent) {
      currentContent.remove();
      currentContent = null;
    }

    // --- 头图容器 ---
    if (currentHeaderContainer && !newHeaderContainer) {
      currentHeaderContainer.remove();
      currentHeaderContainer = null;
    } else if (newHeaderContainer) {
      const oldHeader = document.querySelector('.header-container');
      if (oldHeader && oldHeader !== currentHeaderContainer) {
        oldHeader.remove();
      }
      if (currentHeaderContainer) {
        currentHeaderContainer.replaceWith(newHeaderContainer);
      } else {
        document.body.insertBefore(newHeaderContainer, document.body.firstChild);
      }
      currentHeaderContainer = newHeaderContainer;
    }

    // --- 文章头图 ---
    if (newHeader) {
      if (currentHeader) {
        currentHeader.replaceWith(newHeader);
      } else {
        document.body.insertBefore(newHeader, currentContent || currentFooter);
      }
      currentHeader = newHeader;
    } else if (currentHeader) {
      currentHeader.remove();
      currentHeader = null;
    }

    // --- Logo ---
    if (newLogo && currentLogo) {
      currentLogo.innerHTML = newLogo.innerHTML;
    }

    // --- 文章卡片 ---
    if (newArticleCard) {
      if (currentArticleCard) {
        currentArticleCard.replaceWith(newArticleCard);
      } else {
        document.body.insertBefore(newArticleCard, currentContent || currentFooter);
      }
      currentArticleCard = newArticleCard;
    } else if (currentArticleCard) {
      currentArticleCard.remove();
      currentArticleCard = null;
    }

    // --- 评论区 ---
    if (currentCommentContent) {
      currentCommentContent.remove();
      currentCommentContent = null;
    }
    if (newCommentContent) {
      if (currentFooter && currentFooter.parentNode) {
        currentFooter.parentNode.insertBefore(newCommentContent, currentFooter);
      } else {
        document.body.appendChild(newCommentContent);
      }
      currentCommentContent = newCommentContent;
    }

    // --- Footer ---
    if (newFooter) {
      if (currentFooter) {
        currentFooter.replaceWith(newFooter);
      } else {
        document.body.appendChild(newFooter);
      }
      currentFooter = newFooter;
    } else if (currentFooter) {
      currentFooter.remove();
      currentFooter = null;
    }

    // ---------- 4. 初始化新页面内容 ----------
    initCodeBoxes();
    playEnterAnimation(
      '.content, .home-content, .card, .home-link-card, .about-card, ' +
      '.profile-card, .article-card, .header-container, .article-header, ' +
      '.logo, .settings-button-m, .footer, .comment-content'
    );
    initHitokoto(true);
    initImageViewer();
    bindLinks();
    addRippleEffect();
    bindSettingsTrigger();
    Calendar.init();
    initGiscus();

    if (addToHistory) {
      history.pushState(null, '', url);
    }

    // 更新侧边栏 active 状态
    const currentPath = location.pathname;
    document.querySelectorAll('.sidebar a').forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if (
        href === currentPath ||
        href === currentPath.replace(/^\//, '') ||
        (href === 'index.html' && (currentPath === '/' || currentPath === '/index.html'))
      ) {
        a.classList.add('active');
      }
    });
  } catch (err) {
    console.error('页面加载失败:', err);
  }
}

/* =========================
   链接绑定
========================= */
function bindLinks() {
  let activeTimer = null;

  // 判断两个路径是否指向同一页面
  const isSamePage = (url1, url2) => {
    const normalize = (path) => {
      if (path === '/' || path === '/index.html') return 'index.html';
      return path.replace(/^\//, '');
    };
    return normalize(url1) === normalize(url2);
  };

  document.querySelectorAll('.sidebar a, .spa-link, .spa-link-home').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      const url = link.getAttribute('href');

      if (isSamePage(url, location.pathname)) {
        return;
      }

      clearTimeout(activeTimer);
      activeTimer = setTimeout(() => {
        document.querySelectorAll('.sidebar a').forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === url) {
            a.classList.add('active');
          }
        });
      }, 300);

      loadPage(url);
    };
  });
}

/* =========================
   代码框组件
========================= */
function smartEscapeHTML(str, lang) {
  if (lang === 'html') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  let processed = str.replace(/<\/([a-zA-Z0-9]+)>/gi, '');
  processed = processed.replace(/<([a-zA-Z][a-zA-Z0-9_:.+/ -]*)([^>]*)>/gi, (match, tagName, attrs) => {
    return `&lt;${tagName}${attrs}&gt;`;
  });
  return processed;
}

function initCodeBoxes() {
  const codeBoxes = document.querySelectorAll('code-box');
  if (codeBoxes.length === 0) return;

  codeBoxes.forEach((box) => {
    if (box.getAttribute('data-initialized') === 'true') return;

    const originalCode = box.innerHTML.trim();
    const lang = box.getAttribute('data-lang') || 'plaintext';
    const escapedCode = smartEscapeHTML(originalCode, lang);

    box.innerHTML = `
      <div class="code-box-header">
        <span class="code-lang">${lang}</span>
        <button class="copy-btn" title="复制代码">复制</button>
      </div>
      <div class="code-box-content">
        <pre><code class="language-${lang}">${escapedCode}</code></pre>
      </div>
    `;

    const codeElement = box.querySelector('code');
    if (typeof hljs !== 'undefined') {
      hljs.highlightElement(codeElement);
    }

    const copyBtn = box.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
      const textToCopy = codeElement.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.textContent = '已复制';
          setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
        });
      } else {
        fallbackCopyText(textToCopy, copyBtn);
      }
    });

    box.setAttribute('data-initialized', 'true');
  });
}

function fallbackCopyText(text, copyBtn) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copyBtn.textContent = '已复制';
      setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
    }
  } catch (err) {
    copyBtn.textContent = '复制失败';
    setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
  }
  document.body.removeChild(textArea);
}

/* =========================
   Giscus
========================= */
function initGiscus() {
  const container = document.querySelector('.giscus');
  if (!container) return;

  const oldScript = document.querySelector('script[data-giscus]');
  if (oldScript) oldScript.remove();

  const isDark = (() => {
    const theme = ThemeManager.getTheme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  const themeUrl = isDark
    ? 'https://neneneko.pages.dev/styles/giscus-dark.css'
    : 'https://neneneko.pages.dev/styles/giscus-light.css';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'sagiriworld/sagiriworld.github.io');
  script.setAttribute('data-repo-id', 'R_kgDORzOqxQ');
  script.setAttribute('data-category', 'Announcements');
  script.setAttribute('data-category-id', 'DIC_kwDORzOqxc4C-uzR');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', themeUrl);
  script.setAttribute('data-lang', 'zh-CN');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  script.dataset.giscus = 'true';

  container.innerHTML = '';
  container.appendChild(script);
}

/* =========================
   涟漪效果
========================= */
function addRippleEffect() {
  const rippleElements = document.querySelectorAll(`
    .sidebar a, 
    .li-a,
    .card,
    .home-link-card,
    .settings-button-m,
    .close-button, 
    .md3-button, 
    .md3-list-item,
    .spa-link-home
  `);

  rippleElements.forEach(element => {
    if (element.dataset.rippleBound === "true") return;
    element.dataset.rippleBound = "true";

    const position = window.getComputedStyle(element).position;
    if (position === 'static') element.style.position = 'relative';
    if (window.getComputedStyle(element).overflow !== 'hidden') element.style.overflow = 'hidden';

    // 将 'click' 改为 'pointerdown'，实现按下即播
    element.addEventListener('pointerdown', function (e) {
      const rect = element.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.classList.add('ripple');
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const old = element.querySelector('.ripple');
      if (old) old.remove();

      element.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* =========================
   横向滚动支持
========================= */
function enableHorizontalScroll() {
  document.addEventListener('wheel', (e) => {
    const container = e.target.closest('.scroll-container');
    if (!container) return;
    // 只有横向可以滚动时才拦截（避免容器内容未溢出时无法纵向滚动页面）
    if (container.scrollWidth > container.clientWidth) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  }, { passive: false });   // passive: false 才能调用 preventDefault
}

/* =========================
   一言 API
========================= */
let hitokotoCache = null;
let hitokotoCacheTime = 0;
const HITOKOTO_CACHE_DURATION = 3 * 1000; //缓存

function applyHitokoto(data) {
  const mainText = document.getElementById('hitokoto_text');
  const mainFrom = document.getElementById('hitokoto_from');

  if (!mainText) return;

  const sentence = data.hitokoto;
  const source = data.from ? `—— ${data.from}` : '';

  if (mainText.dataset.current === sentence) return;
  mainText.dataset.current = sentence;

  mainText.textContent = sentence;
  mainText.href = `https://hitokoto.cn/?uuid=${data.uuid}`;

  if (mainFrom) {
    mainFrom.textContent = source;
  }

  mainText.classList.remove('loading');
  if (mainFrom) mainFrom.classList.remove('loading');
}

function applyFallback() {
  const mainText = document.getElementById('hitokoto_text');
  if (!mainText) return;

  const fallback = '愿你的每一天都独特而美好';

  if (mainText.dataset.current === fallback) return;
  mainText.dataset.current = fallback;
  mainText.textContent = fallback;

  mainText.classList.remove('loading');
  const mainFrom = document.getElementById('hitokoto_from');
  if (mainFrom) {
    mainFrom.textContent = '';
    mainFrom.classList.remove('loading');
  }
}

async function initHitokoto(delay = false) {
  const mainText = document.getElementById('hitokoto_text');
  if (!mainText) return;

  if (delay) {
    setTimeout(() => initHitokoto(false), 350);
    return;
  }

  if (hitokotoCache && (Date.now() - hitokotoCacheTime) < HITOKOTO_CACHE_DURATION) {
    applyHitokoto(hitokotoCache);
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://v1.hitokoto.cn/', {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    hitokotoCache = data;
    hitokotoCacheTime = Date.now();

    applyHitokoto(data);
  } catch (e) {
    console.warn('一言获取失败', e);
    if (hitokotoCache) {
      applyHitokoto(hitokotoCache);
    } else {
      applyFallback();
    }
  }
}

/* =========================
   设置弹窗
========================= */
function createSettingsDialog() {
  if (document.querySelector('.settings-dialog')) return;

  const dialogHTML = `
    <div class="settings-dialog" id="settingsDialog" aria-hidden="true">
      <div class="dialog-overlay"></div>
      <div class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="settings-header">
          <h2 id="settings-title">设置</h2>
          <button class="close-button" aria-label="关闭设置" id="closeSettingsBtn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="settings-content">
          <div class="md3-list-item" style="cursor: default;">
            <span>
              <div class="item-label">主题模式</div>
              <div class="item-supporting">切换浅色/深色外观</div>
            </span>
            <select id="themeSelect" class="ui-select">
              <option value="auto">跟随系统</option>
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
            </select>
          </div>
          <label class="md3-list-item">
            <span>
              <div class="item-label">动画效果（beta）</div>
              <div class="item-supporting">启用页面切换动画</div>
            </span>
            <span class="md3-switch">
              <input type="checkbox" id="animationToggle" checked>
              <span class="slider"></span>
            </span>
          </label>
          <div class="md3-list-item theme-picker-item">
  <span>
    <div class="item-label">主题颜色（beta）</div>
  </span>
  <span class="theme-color-options">
    <span class="theme-color-btn pink" data-color="pink"></span>
    <span class="theme-color-btn blue" data-color="blue"></span>
  </span>
</div>
          <div class="md3-list-item" id="clearCacheBtn">
            <span class="item-label">清除缓存</span>
          </div>
        </div>
        <div class="settings-footer-actions">
          <button class="md3-button" id="resetSettingsBtn">重置</button>
          <button class="md3-button" id="saveSettingsBtn">完成</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', dialogHTML);

  const dialog = document.getElementById('settingsDialog');
  const overlay = dialog.querySelector('.dialog-overlay');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const themeSelect = document.getElementById('themeSelect');
  const animationToggle = document.getElementById('animationToggle');
  const resetBtn = document.getElementById('resetSettingsBtn');

  themeSelect.addEventListener('click', (e) => e.stopPropagation());

  themeSelect.value = ThemeManager.getTheme();
  const animEnabled = localStorage.getItem('animations-enabled') !== 'false';
  animationToggle.checked = animEnabled;

  const closeDialog = () => {
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
  };

  overlay.addEventListener('click', closeDialog);
  closeBtn.addEventListener('click', closeDialog);

  saveBtn.addEventListener('click', () => {
    ThemeManager.setTheme(themeSelect.value);
    localStorage.setItem('animations-enabled', animationToggle.checked);
    closeDialog();
  });

  resetBtn.addEventListener('click', () => {
    themeSelect.value = 'auto';
    animationToggle.checked = true;
  });

  dialog.querySelector('.settings-panel').addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.classList.contains('open')) {
      closeDialog();
    }
  });

  document.getElementById('clearCacheBtn').addEventListener('click', () => {
    if (confirm('确定清除所有缓存数据吗？')) {
      localStorage.clear();
      ThemeManager.setTheme('auto');
      themeSelect.value = 'auto';
      animationToggle.checked = true;
      alert('缓存已清除');
    }
  });

  themeSelect.addEventListener('change', () => {
    ThemeManager.setTheme(themeSelect.value);
  });

// 绑定主题颜色按钮
document.querySelectorAll('.theme-color-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const color = btn.dataset.color;
    ColorThemeManager.setColor(color);
  });
});
   
  window.addEventListener('popstate', closeDialog);
  const originalLoadPage = window.loadPage;
  if (originalLoadPage) {
    window.loadPage = async function(url) {
      closeDialog();
      return originalLoadPage.call(this, url);
    };
  }

  addRippleEffect();
}

function openSettingsDialog() {
  createSettingsDialog();
  const dialog = document.getElementById('settingsDialog');
  dialog.classList.add('open');
  dialog.setAttribute('aria-hidden', 'false');
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) themeSelect.value = ThemeManager.getTheme();
     // 刷新颜色按钮状态
  ColorThemeManager.updateActiveButton(ColorThemeManager.getColor());
}

function bindSettingsTrigger() {
  const trigger = document.getElementById('settings-trigger');
  const nav = document.getElementById('settings-nav');
  if (trigger) {
    trigger.removeEventListener('click', openSettingsDialog);
    trigger.addEventListener('click', openSettingsDialog);
  }
  if (nav) {
    nav.removeEventListener('click', openSettingsDialog);
    nav.addEventListener('click', openSettingsDialog);
  }
}

/* =========================
   Viewer.js 图片查看器初始化
========================= */
function initImageViewer() {
  // 选择需要添加查看器的图片容器
  const containers = document.querySelectorAll('.article-card');
  containers.forEach(container => {
    if (container.dataset.viewer === 'true') return;
    container.dataset.viewer = 'true';
    new Viewer(container, {
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 1,
        play: 0,
        next: 1,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
      navbar: true,
      title: false,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        reset: true,
        prev: true,
        next: true,
        rotateLeft: true,
        rotateRight: true,
      },
      keyboard: true,
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
    });
  });
}

/* =========================
   日历组件
========================= */
const Calendar = {
  current: new Date(),

  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('calendar');
    if (!container) return;

    const year = this.current.getFullYear();
    const month = this.current.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    let html = `
      <div class="calendar-header">
        <button class="cal-prev">‹</button>
        <span>${year} 年 ${month + 1} 月</span>
        <button class="cal-next">›</button>
      </div>
      <div class="calendar-grid">
        ${['日','一','二','三','四','五','六'].map(d => `<div class="cal-day-name">${d}</div>`).join('')}
    `;

    // 空白占位
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty"></div>`;
    }

    // 日期
    for (let d = 1; d <= lastDate; d++) {
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      html += `
        <div class="cal-day ${isToday ? 'today' : ''}">
          ${d}
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  bindEvents() {
    const container = document.getElementById('calendar');
    if (!container) return;

    const prev = container.querySelector('.cal-prev');
    const next = container.querySelector('.cal-next');

    prev.onclick = () => {
      this.current.setMonth(this.current.getMonth() - 1);
      this.render();
      this.bindEvents();
    };

    next.onclick = () => {
      this.current.setMonth(this.current.getMonth() + 1);
      this.render();
      this.bindEvents();
    };
  }
};

/* =========================
   初始化执行
========================= */
function initAll() {
  ColorThemeManager.init();
  bindLinks();
  addRippleEffect();
  enableHorizontalScroll();
  bindSettingsTrigger();
  Calendar.init();
  initGiscus();

  const MIN_LOAD_TIME = 3000;   // 最短停留 3 秒

  const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const elapsed = Date.now() - pageLoadStart;        // 已经过去的时间
    const remaining = Math.max(MIN_LOAD_TIME - elapsed, 0);  // 还需等待的时间

    const doHide = () => {
      preloader.classList.add('hidden');

      // 等淡出动画结束后再执行内容入场动画
      setTimeout(() => {
        initCodeBoxes();
        initHitokoto();
        playEnterAnimation(
          '.content, .home-content, .card, .home-link-card, .about-card, ' +
          '.profile-card, .article-card, .header-container, .article-header, ' +
          '.logo, .settings-button-m, .footer, .comment-content'
        );
        initImageViewer();
      }, 400); // 与 CSS 的 opacity 过渡时间一致
    };

    if (remaining > 0) {
      setTimeout(doHide, remaining);
    } else {
      doHide();
    }
  };

  // 等待 DOM 就绪后执行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(hidePreloader, 0);
  } else {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  }
}

// 监听浏览器前进/后退，交给 loadPage 内部更新 active
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);   // ← 传入 false 避免重复 pushState
});

initAll();
