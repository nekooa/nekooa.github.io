/* =========================
   全局变量与初始化 (主题管理)
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

ThemeManager.init();

/* =========================
   统一动画执行
========================= */
function playEnterAnimation(selectors) {
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  elements.forEach(el => {
    // 1. 禁用过渡，瞬间将元素下沉并隐藏
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.classList.remove('fade-out', 'fade-in');
  });

  // 2. 强制触发浏览器重排
  void document.body.offsetWidth;

  elements.forEach(el => {
    // 3. 清理内联样式，交给 CSS 控制，添加入场类名
    el。style.transition = '';
    el。style.opacity = '';
    el.style.transform = '';
    el.classList.add('fade-in');
  });

  // 4. 动画结束后清理多余类名，防止影响后续交互
  setTimeout(() => {
    elements.forEach(el => el.classList.remove('fade-in'));
  }, 400); 
}

/* =========================
   SPA 页面加载
========================= */
async function loadPage(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const newContent = doc.querySelector('.home-content') || doc.querySelector('.content');
    const newLogo = doc.querySelector('.logo');
    const newHeaderContainer = doc.querySelector('.header-container');
    const newHeader = doc.querySelector('.article-header');
    const newArticleCard = doc.querySelector('.article-card');
    const newFooter = doc.querySelector('.footer');

    const currentContent = document.querySelector('.home-content') || document.querySelector('.content');
    const currentLogo = document.querySelector('.logo');
    let currentHeaderContainer = document.querySelector('.header-container');
    let currentHeader = document.querySelector('.article-header');
    let currentArticleCard = document.querySelector('.article-card');
    let currentFooter = document.querySelector('.footer');

    if (newContent && currentContent) {
      const newContentClasses = newContent.className;

      // 1. 全局元素退场 (添加 fade-out，触发 0.2s 消失动画)
      const outElements = [
        currentContent,
        currentLogo,
        currentHeaderContainer,
        currentHeader,
        currentArticleCard,
        currentFooter,
      ].filter(Boolean);
      outElements.forEach(el => el.classList.add('fade-out'));
       
      // 2. 等待 0.2s 退场结束后，进行 DOM 替换
      setTimeout(() => {
        // 让页面瞬间回到顶部
        window.scrollTo({ top: 0, behavior: 'auto' });

        // 头图容器替换
        if (newHeaderContainer) {
          if (currentHeaderContainer) currentHeaderContainer.replaceWith(newHeaderContainer);
          else document.body.insertBefore(newHeaderContainer, currentContent);
        } else if (currentHeaderContainer) currentHeaderContainer.remove();

        // 文章头图替换
        if (newHeader) {
          if (currentHeader) currentHeader.replaceWith(newHeader);
          else document.body.insertBefore(newHeader, currentContent);
        } else if (currentHeader) currentHeader.remove();

        // 主内容替换
        currentContent.innerHTML = newContent.innerHTML;
        currentContent.className = newContentClasses;

        // Logo 替换
        if (newLogo && currentLogo) currentLogo.innerHTML = newLogo.innerHTML;

        // 文章卡片替换
        if (newArticleCard) {
          if (currentArticleCard) currentArticleCard.replaceWith(newArticleCard);
          else document.body.insertBefore(newArticleCard, currentContent);
        } else if (currentArticleCard) currentArticleCard.remove();

        // footer 替换
        if (newFooter) {
          if (currentFooter) {
            currentFooter.replaceWith(newFooter);
          } else {
            document.body.appendChild(newFooter);
          }
        } else if (currentFooter) {
          currentFooter.remove();
        }

        // 初始化新页面的代码框
        initCodeBoxes();

        // 3. 统一触发入场动画
        playEnterAnimation('.content, .home-content, .card, .home-link-card, .about-card, .profile-card, .article-card, .header-container, .article-header, .logo, .footer');

        // 4. 重置新页面组件状态
        initHitokoto(true);
        bindLinks();
        addRippleEffect();
        bindSettingsTrigger();
        Calendar.init();
        initGiscus();
      }, 200); 
    }

    history.pushState(null, '', url);

    document.querySelectorAll('.sidebar a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === url) a.classList.add('active');
    });
  } catch (err) {
    console.error('加载失败:', err);
  }
}

/* =========================
   链接绑定
========================= */
function bindLinks() {
  document.querySelectorAll('.sidebar a, .spa-link').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      loadPage(link.getAttribute('href'));
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
          copyBtn。textContent = '已复制';
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
  textArea。style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea。select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copyBtn.textContent = '已复制';
      setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
    }
  } catch (err) {
    copyBtn。textContent = '复制失败';
    setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
  }
  document.body.removeChild(textArea);
}

/* =========================
   Giscus 评论系统 (SPA 动态加载)
========================= */
function initGiscus() {
  const container = document.querySelector('.giscus');
  if (!container) return; // 当前页面没有评论区容器，直接跳过

  // 移除已有的 Giscus 脚本（避免重复加载）
  const oldScript = document.querySelector('script[data-giscus]');
  if (oldScript) oldScript.remove();

  // 创建新的 Giscus 脚本，沿用你原来的所有配置
  const script = document.createElement('script');
  script。src = 'https://giscus.app/client.js';
  script。setAttribute('data-repo', 'sagiriworld/sagiriworld.github.io');
  script.setAttribute('data-repo-id', 'R_kgDORzOqxQ');
  script.setAttribute('data-category', 'Announcements');
  script.setAttribute('data-category-id', 'DIC_kwDORzOqxc4C-uzR');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script。setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', 'custom'); // 关键：使用自定义 CSS 变量
  script。setAttribute('data-lang', 'zh-CN');
  script.setAttribute('crossorigin', 'anonymous');
  script。async = true;

  // 用于标记该脚本，便于后续移除
  script。dataset.giscus = 'true';

  // 清空容器并注入脚本，Giscus 会自动渲染到 .giscus 内
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
    .settings-button-m,
    .close-button, 
    .md3-button, 
    .md3-list-item
  `);

  rippleElements.forEach(element => {
    if (element.dataset.rippleBound === "true") return;
    element.dataset.rippleBound = "true";

    const position = window.getComputedStyle(element).position;
    if (position === 'static') element.style.position = 'relative';
    if (window.getComputedStyle(element).overflow !== 'hidden') element.style.overflow = 'hidden';

    element.addEventListener('click', function (e) {
      const rect = element.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.classList.add('ripple');
      circle。style.width = circle.style.height = `${diameter}px`;
      circle。style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const old = element.querySelector('.ripple');
      if (old) old.remove();

      element。appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* =========================
   一言 API（修复闪烁版）
========================= */
let hitokotoCache = null;
let hitokotoCacheTime = 0;
const HITOKOTO_CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存

/**
 * 将一言数据渲染到页面
 * @param {Object} data - 一言 API 返回的数据
 */
function applyHitokoto(data) {
  const mainText = document.getElementById('hitokoto_text');
  const mainFrom = document.getElementById('hitokoto_from');

  if (!mainText) return;

  const sentence = data.hitokoto;
  const source = data.from ? `—— ${data.from}` : '';

  // 避免相同句子重复渲染
  if (mainText.dataset.current === sentence) return;
  mainText.dataset.current = sentence;

  // 填充内容
  mainText.textContent = sentence;
  mainText.href = `https://hitokoto.cn/?uuid=${data.uuid}`;

  if (mainFrom) {
    mainFrom.textContent = source;
  }

  // 移除加载状态，触发 CSS 淡入动画
  mainText。classList。remove('loading');
  if (mainFrom) mainFrom.classList.remove('loading');
}

/**
 * 应用兜底文案（网络异常或超时时使用）
 */
function applyFallback() {
  const mainText = document.getElementById('hitokoto_text');
  if (!mainText) return;

  const fallback = '愿你的每一天都独特而美好';

  if (mainText.dataset.current === fallback) return;
  mainText.dataset.current = fallback;
  mainText.textContent = fallback;

  // 同样移除 loading 状态，正常显示
  mainText。classList.remove('loading');
  const mainFrom = document.getElementById('hitokoto_from');
  if (mainFrom) {
    mainFrom.textContent = '';
    mainFrom.classList.remove('loading');
  }
}

/**
 * 初始化一言（获取并显示）
 * @param {boolean} delay - 是否延迟加载（SPA 切换时使用）
 */
async function initHitokoto(delay = false) {
  const mainText = document.getElementById('hitokoto_text');
  if (!mainText) return;

  // 如果要求延迟，则 350ms 后再执行（避免与页面动画冲突）
  if (delay) {
    setTimeout(() => initHitokoto(false), 350);
    return;
  }

  // 缓存有效时直接使用
  if (hitokotoCache && (Date.now() - hitokotoCacheTime) < HITOKOTO_CACHE_DURATION) {
    applyHitokoto(hitokotoCache);
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 秒超时

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
    // 有缓存但已过期时仍可使用旧数据
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
              <div class="item-label">动画效果</div>
              <div class="item-supporting">启用页面切换动画</div>
            </span>
            <span class="md3-switch">
              <input type="checkbox" id="animationToggle" checked>
              <span class="slider"></span>
            </span>
          </label>
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
      ThemeManager。setTheme('auto');
      themeSelect.value = 'auto';
      animationToggle.checked = true;
      alert('缓存已清除');
    }
  });

  themeSelect。addEventListener('change', () => {
    ThemeManager。setTheme(themeSelect.value);
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
      this。current.setMonth(this.current.getMonth() - 1);
      this.render();
      this。bindEvents();
    };

    下一处。onclick = () => {
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
  bindLinks();
  addRippleEffect();
  initHitokoto();
  bindSettingsTrigger();
  Calendar.init();
  initGiscus();
  
  // 初次加载时，触发页面内所有核心组件和卡片的入场动画
  playEnterAnimation('.content, .home-content, .card, .home-link-card, .about-card, .profile-card, .article-card, .header-container, .article-header, .footer');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBoxes);
  } else {
    initCodeBoxes();
  }
}

initAll();

// 监听 popstate
window.addEventListener('popstate', () => {
  loadPage(location.pathname);
});
