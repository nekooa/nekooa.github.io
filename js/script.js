/* =========================
   常量配置
========================= */
const CONFIG = {
  GISCUS_REPO: 'sagiriworld/sagiriworld.github.io',
  GISCUS_REPO_ID: 'R_kgDORzOqxQ',
  GISCUS_CATEGORY: 'Announcements',
  GISCUS_CATEGORY_ID: 'DIC_kwDORzOqxc4C-uzR',
  GISCUS_DARK_THEME: 'https://neneneko.pages.dev/styles/giscus-dark.css',
  GISCUS_LIGHT_THEME: 'https://neneneko.pages.dev/styles/giscus-light.css',
  HITOKOTO_CACHE_DURATION: 5 * 1000,
  MIN_LOAD_TIME: 3000,
};

/* =========================
   加载屏
========================= */
var pageLoadStart = Date.now();

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
   主题颜色管理器
========================= */
const ColorThemeManager = {
  STORAGE_KEY: 'site-color-theme',

  themes: {
    pink: {
      light: {
        '--color-bg': '#FFFBFF',
        '--color-pink': '#ff95bc',
        '--color-pink-soft': 'rgba(255,216,231,0.7)',
        '--color-svg': '#352f31',
        '--sidebar-bg': 'rgba(240,240,240)',
        '--sidebar-a': 'rgba(106,106,106,0.2)',
        '--sidebar-bg-mobile': 'rgba(247,236,244,0.8)',
        '--card-bg': '#F7ECF4',
        '--profile-list-bg': 'rgba(255,216,231,0.3)',
        '--time-badge-bg': 'rgba(255,216,231,0.8)',
        '--li-a-bg': 'rgba(255,216,231,0.8)',
        '--li-a-hover-bg': 'rgba(253,176,210,0.626)',
        '--slogan-color': '#e91e63',
        '--slogan-text-shadow': '0 2px 8px rgba(233,30,99,0.25)',
        '--thoughts-color': '#b06a8c',
        '--thoughts-bg': 'rgba(255,235,245,0.5)',
        '--thoughts-border': '#f8bbd0',
        '--nav-time-bg': 'rgba(255,216,231,0.8)',
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
        '--color-bg': '#1F1A1C',
        '--color-pink': '#ffb3cf',
        '--color-pink-soft': 'rgba(255,179,207,0.25)',
        '--color-svg': '#fed9e6',
        '--sidebar-bg': 'rgba(30,30,30)',
        '--sidebar-a': 'rgba(106,106,106,0.6)',
        '--sidebar-bg-mobile': 'rgba(49,38,42,0.8)',
        '--card-bg': '#2A2125',
        '--profile-list-bg': 'rgba(90,63,72,0.5)',
        '--time-badge-bg': 'rgba(255,179,207,0.2)',
        '--li-a-bg': 'rgba(255,179,207,0.25)',
        '--li-a-hover-bg': 'rgba(255,179,207,0.35)',
        '--slogan-color': '#f48fb1',
        '--slogan-text-shadow': '0 2px 12px rgba(244,143,177,0.35)',
        '--thoughts-color': '#f8bbd0',
        '--thoughts-bg': 'rgba(255,210,225,0.08)',
        '--thoughts-border': '#f06292',
        '--nav-time-bg': 'rgba(255,179,207,0.2)',
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
        '--profile-list-bg': '#D1E5F4',
        '--time-badge-bg': 'rgba(195,232,255,0.6)',
        '--li-a-bg': 'rgba(195,232,255,0.8)',
        '--li-a-hover-bg': 'rgba(127,180,224,1)',
        '--slogan-color': '#006689',
        '--slogan-text-shadow': '0 2px 8px rgba(59,122,191,0.2)',
        '--thoughts-color': '#006689',
        '--thoughts-bg': 'rgba(209,229,244,0.3)',
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
        '--profile-list-bg': 'rgba(30,60,90,0.5)',
        '--time-badge-bg': 'rgba(145,192,240,0.2)',
        '--li-a-bg': 'rgba(145,192,240,0.25)',
        '--li-a-hover-bg': 'rgba(145,192,240,0.35)',
        '--slogan-color': '#91c0f0',
        '--slogan-text-shadow': '0 2px 12px rgba(145,192,240,0.35)',
        '--thoughts-color': '#b8d8f8',
        '--thoughts-bg': 'rgba(30,60,90,0.15)',
        '--thoughts-border': '#4a7ca5',
        '--nav-time-bg': 'rgba(145,192,240,0.2)',
        '--settings-panel-bg': '#17212b',
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
      el.style.transform = 'translateX(-20px)';
    } else if (el.matches('.settings-button-m')) {
      el.style.transform = 'translateX(20px)';
    } else if (el.matches('.article-card, .comment-content')) {
      el.style.transform = isMobile
        ? 'translateY(15px)'
        : 'translateX(-50%) translateY(15px)';
    } else {
      el.style.transform = 'translateY(15px)';
    }
  });

  // 二：强制重排
  void document.body.offsetWidth;

  // 三：移除内联样式并添加 .fade-in
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

/* =========================
   页面加载守卫
========================= */
/* [修改] 防止快速连续点击导致并发加载 */
let isLoadingPage = false;

async function loadPage(url, addToHistory = true) {
  /* [修改] 防止并发 */
  if (isLoadingPage) return;
  isLoadingPage = true;

  /* [修改] 如果设置弹窗开着，先关掉 */
  const settingsDialog = document.getElementById('settingsDialog');
  if (settingsDialog && settingsDialog.classList.contains('open')) {
    settingsDialog.classList.remove('open');
    settingsDialog.setAttribute('aria-hidden', 'true');
  }

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

    /* [BUG#3 修复] 记录最后加载的路径，供 popstate 判断用 */
    window.__lastLoadedPath = url;

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
    /* [修改] 加载失败时恢复页面状态，而不是卡在 fade-out */
    console.error('页面加载失败:', err);
    document.querySelectorAll('.fade-out').forEach(el => {
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
    });
  } finally {
    /* [修改] 无论成功失败都释放锁 */
    isLoadingPage = false;
  }
}

/* =========================
   链接绑定
========================= */
function bindLinks() {
  let activeTimer = null;

  const isSamePage = (url1, url2) => {
    const normalize = (path) => {
      if (path === '/' || path === '/index.html') return 'index.html';
      return path.replace(/^\//, '');
    };
    return normalize(url1) === normalize(url2);
  };

  /* [修改] 判断是否为站内链接 */
  const isInternalLink = (url) => {
    if (!url) return false;
    if (url.startsWith('http://') || url.startsWith('https://')) return false;
    if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) return false;
    if (url.startsWith('#')) return false;
    return true;
  };

  /* [BUG#2 修复] 扩展选择器覆盖文章内容内链，data-spa-bound 防重复绑定 */
  document.querySelectorAll('.sidebar a, .spa-link, .spa-link-home, .content a[href$=".html"], .home-content a[href$=".html"]').forEach(link => {
    if (link.dataset.spaBound === 'true') return;
    link.dataset.spaBound = 'true';

    link.onclick = e => {
      const url = link.getAttribute('href');

      /* [修改] 外部链接、锚点等不做 SPA 拦截，交给浏览器处理 */
      if (!isInternalLink(url)) return;

      e.preventDefault();

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

  /* [BUG#4 修复] 清除旧的 Giscus script 和 iframe，防止累积 */
  const oldScript = document.querySelector('script[data-giscus]');
  if (oldScript) oldScript.remove();
  container.querySelectorAll('iframe').forEach(f => f.remove());

  const isDark = (() => {
    const theme = ThemeManager.getTheme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  /* [修改] 使用 CONFIG 常量 */
  const themeUrl = isDark ? CONFIG.GISCUS_DARK_THEME : CONFIG.GISCUS_LIGHT_THEME;

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', CONFIG.GISCUS_REPO);
  script.setAttribute('data-repo-id', CONFIG.GISCUS_REPO_ID);
  script.setAttribute('data-category', CONFIG.GISCUS_CATEGORY);
  script.setAttribute('data-category-id', CONFIG.GISCUS_CATEGORY_ID);
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
   一言 API
========================= */
let hitokotoCache = null;
let hitokotoCacheTime = 0;

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

  /* [修改] fallback 数组随机选取 */
  const fallbacks = [
    '愿你的每一天都独特而美好',
    '生活明朗，万物可爱',
    '保持热爱，奔赴山海',
    '心有所期，全力以赴',
  ];
  const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

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

  /* [修改] 使用 CONFIG.HITOKOTO_CACHE_DURATION（60s） */
  if (hitokotoCache && (Date.now() - hitokotoCacheTime) < CONFIG.HITOKOTO_CACHE_DURATION) {
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
    if (confirm('确定清除所有缓存数据吗？？')) {
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

  /* [修改] 移除了无效的 window.loadPage 包装（loadPage 不在 window 上）
     loadPage 开头已内置关闭弹窗的逻辑 */

  window.addEventListener('popstate', closeDialog);

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
  const containers = document.querySelectorAll('.article-card');
  containers.forEach(container => {
    if (container.dataset.viewer === 'true') return;
    container.dataset.viewer = 'true';
    new Viewer(container, {
      /* [修改] 合并为单一 toolbar 对象，修复重复定义导致第一个被覆盖的 bug */
      toolbar: {
        zoomIn: false,
        zoomOut: false,
        oneToOne: false,
        reset: true,
        prev: true,
        play: false,
        next: true,
        rotateLeft: false,
        rotateRight: false,
        flipHorizontal: false,
        flipVertical: false,
      },
      navbar: false,
      title: false,
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
   日历组件（事件委托）
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

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty"></div>`;
    }

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

  /* [修改] 使用事件委托，避免每次 render 后重新绑定 */
  bindEvents() {
    const container = document.getElementById('calendar');
    if (!container || container.dataset.bound === 'true') return;
    container.dataset.bound = 'true';

    container.addEventListener('click', (e) => {
      if (e.target.closest('.cal-prev')) {
        this.current.setMonth(this.current.getMonth() - 1);
        this.render();
      } else if (e.target.closest('.cal-next')) {
        this.current.setMonth(this.current.getMonth() + 1);
        this.render();
      }
    });
  }
};

/* =========================
   初始化执行
========================= */
function initAll() {
  /* [修改] 先初始化 ThemeManager，恢复 data-theme 属性，
     再初始化 ColorThemeManager 读取正确的暗/亮模式 */
  ThemeManager.init();
  ColorThemeManager.init();

  bindLinks();
  addRippleEffect();
  bindSettingsTrigger();
  Calendar.init();
  initGiscus();

  const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const elapsed = Date.now() - pageLoadStart;
    const remaining = Math.max(CONFIG.MIN_LOAD_TIME - elapsed, 0);

    const doHide = () => {
      preloader.classList.add('hidden');

      setTimeout(() => {
        initCodeBoxes();
        initHitokoto();
        playEnterAnimation(
          '.content, .home-content, .card, .home-link-card, .about-card, ' +
          '.profile-card, .article-card, .header-container, .article-header, ' +
          '.logo, .settings-button-m, .footer, .comment-content'
        );
        initImageViewer();
      }, 400);
    };

    if (remaining > 0) {
      setTimeout(doHide, remaining);
    } else {
      doHide();
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(hidePreloader, 0);
  } else {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  }
}

// 监听浏览器前进/后退
window.addEventListener('popstate', () => {
  /* [BUG#3 修复] 避免重复加载同一页面 */
  const targetPath = location.pathname;
  const normalize = (path) => {
    if (path === '/' || path === '/index.html') return 'index.html';
    return path.replace(/^\//, '');
  };
  if (normalize(targetPath) !== normalize(window.__lastLoadedPath || '')) {
    loadPage(targetPath, false);
  }
});

initAll();
