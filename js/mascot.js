/*!
 * 桌宠（web-mascot）接入层
 * Copyright (C) 2026 holo-world (sagiri-world / nekooa)
 *
 * 引擎：web-mascot v0.0.3 — https://github.com/CommentOut64/web-mascot
 *       许可证 GPL-3.0-or-later（移植自 libshijima，本身也是 GPL 系）
 * 素材：Neuron / Eviling — 许可证 CC-BY-NC-SA-4.0（非商业）
 *       美术 Paccha <https://linktr.ee/paccha_>，动作配置 @promote.
 *       许可证文件见 mascot_pack/<Pack>/LICENSE*
 * 详见 THIRD-PARTY-NOTICES.md 与 LICENSING.md
 *
 * 本文件是自由软件，依 GPL-3.0-or-later 分发，不提供任何担保。
 *
 * 行为约定：
 *   - 移动端（<=768px）默认关闭；桌面端默认只挂 Neuron
 *   - 用户的显式选择始终优先于默认值
 *   - 低性能模式（<html class="animations-off">）下强制关闭
 */
import { configure, createMascot, MascotEngine } from '../vendor/web-mascot/index.js';

const STORAGE_KEY = 'mascot-mode';
const VALID_MODES = ['off', 'neuron', 'eviling', 'both'];
const PACKS = {
  neuron: ['Neuron'],
  eviling: ['Eviling'],
  both: ['Neuron', 'Eviling'],
};
const MOBILE_MQ = window.matchMedia('(max-width: 768px)');

// 素材基址锚定在本模块上：即使站点部署到子路径也能指对
configure({ assets: new URL('../mascot_pack', import.meta.url).href });

/** 当前已生效的模式；用于幂等判断 */
let activeMode = null;
/** 正在运行的实例 */
let instances = [];
/** 串行化，避免快速切换时重复创建 */
let queue = Promise.resolve();

const isMobile = () => MOBILE_MQ.matches;
const lowPerfOn = () => document.documentElement.classList.contains('animations-off');

/* ---------- 工作区（桌宠的活动矩形 / 吸附边界） ----------
 * 引擎内部每次渲染都会重新调用 area()，而 area() 读取的是
 * MascotEngine.animationConfig.zone(名字)。把 zone() 接到下面这个
 * 实时计算的对象上，就能让"墙/地板"跟着页面布局走。
 *
 * 返回值的单位是 CSS px —— 引擎的 metric() 会自己除以 spriteScale
 * 换算成虚拟单位，所以这里不需要关心缩放大。
 */
const SIDEBAR_SEL = '.sidebar';

/**
 * 侧栏位置缓存。
 * 侧栏是 position:fixed，位置不随滚动或内容变化，可以缓存；
 * 但 viewport 的 clientWidth/clientHeight 会在滚动条出现/消失时变化，
 * 必须每次现读，否则右侧会让不出滚动条的位置。
 */
let sidebarBox = null;

function invalidateWorkArea() {
  sidebarBox = null;
}

function measureSidebar() {
  if (sidebarBox) return sidebarBox;
  const sidebar = document.querySelector(SIDEBAR_SEL);
  const r = sidebar ? sidebar.getBoundingClientRect() : null;
  sidebarBox =
    r && r.width > 0 && r.height > 0
      ? { top: Math.round(r.top), right: Math.round(r.right) }
      : { top: null, right: null };
  return sidebarBox;
}

function workArea() {
  const doc = document.documentElement;
  // clientWidth/clientHeight 不含滚动条；这两个值很便宜，每次现读
  const width = doc.clientWidth || window.innerWidth;
  const height = doc.clientHeight || window.innerHeight;
  const area = { left: 0, right: width, top: 0, bottom: height };

  const box = measureSidebar();
  if (box.top !== null) {
    if (isMobile()) {
      // 移动端：侧栏变成底部条，让宠物站在它上沿
      if (box.top > height * 0.4) area.bottom = box.top;
    } else if (box.right < width * 0.4) {
      // 桌面端：左侧吸附到侧栏右缘
      area.left = box.right;
    }
  }

  area.right = Math.max(area.left + 1, area.right);
  area.bottom = Math.max(area.top + 1, area.bottom);
  return area;
}

/** 只在首次（或引擎替换了配置实例）时打补丁 */
let patchedConfig = null;

function applyWorkArea() {
  const cfg = MascotEngine && MascotEngine.animationConfig;
  if (!cfg || typeof cfg.zone !== 'function') {
    console.warn('[mascot] 无法设置活动区域：引擎的 animationConfig 不可用');
    return;
  }
  if (cfg === patchedConfig) return;
  const originalZone = cfg.zone.bind(cfg);
  cfg.zone = (name) => ({ ...originalZone(name), ...workArea() });
  patchedConfig = cfg;
}

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID_MODES.indexOf(v) === -1 ? null : v;
  } catch (e) {
    return null;
  }
}

/** 用户偏好：显式设置优先，否则按设备给默认值 */
function preference() {
  return readStored() || (isMobile() ? 'off' : 'neuron');
}

/** 实际渲染的模式：低性能模式强制关闭 */
function runtimeMode() {
  return lowPerfOn() ? 'off' : preference();
}

async function destroyAll() {
  const list = instances;
  instances = [];
  await Promise.all(
    list.map((m) => {
      try {
        return m.destroy();
      } catch (e) {
        return null;
      }
    })
  );
}

/**
 * 桌宠的挂载层。
 * 引擎会把节点直接 append 到 container，且不给自己的根节点加 class，
 * 因此这里提供一个带 id 的容器，好让 styles/style.css 能精确命中并
 * 取消全局 img 规则的灰色占位底（否则透明 PNG 下会透出灰方块）。
 */
function ensureLayer() {
  let layer = document.getElementById('mascot-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'mascot-layer';
    document.body.appendChild(layer);
  }
  return layer;
}

async function createAll(mode) {
  const created = [];
  const container = ensureLayer();
  // 先接好活动区域，宠物一出生就落在正确的墙/地板之间
  invalidateWorkArea();
  applyWorkArea();
  for (const pack of PACKS[mode] || []) {
    try {
      const mascot = await createMascot({ container, pack });
      if (mascot.engine && mascot.engine.elRoot) {
        rootEngines.set(mascot.engine.elRoot, mascot.engine);
      }
      created.push(mascot);
    } catch (err) {
      console.warn('[mascot] 创建失败:', pack, err);
    }
  }
  // 引擎可能在加载配置后替换 animationConfig 实例，这里再确认一次
  applyWorkArea();
  return created;
}

async function reconcile() {
  const mode = runtimeMode();
  if (mode === activeMode) return;

  // 先占位再异步创建：防止并发调用重复挂载
  activeMode = mode;
  await destroyAll();
  if (mode === 'off') return;

  instances = await createAll(mode);
  // 全部失败时退回 off，下次事件还能重试
  if (!instances.length) activeMode = 'off';
}

/** 排队执行，后一次调用永远看到前一次的结果 */
function apply() {
  queue = queue.then(reconcile, reconcile);
  return queue;
}

/* ---------- 移动端：把触摸合成为鼠标拖拽 ----------
 * 引擎的交互只监听 mousedown（绑在宠物根节点）/ 全局 mousemove / 全局 mouseup，
 * 没有 pointer/touch 支持，也没设 touch-action。移动端触摸会被浏览器当成页面
 * 滚动消费掉，永远产生不了 mousemove 流，所以手指拖不动桌宠。
 * 这里把触摸翻译成等价的鼠标事件（注意 mousemove 必须带 buttons: 1，
 * 引擎据此判断"仍在按住"）。
 */
const MASCOT_ROOT_SEL = '#mascot-layer > div';

// 宠物根节点 -> 引擎实例：触摸时需要用 engine.isOpaqueAt() 判断是否点到本体
const rootEngines = new WeakMap();

function firstTouch(event) {
  const t = event.touches && event.touches[0];
  if (t) return t;
  const c = event.changedTouches && event.changedTouches[0];
  return c || null;
}

function synthesizeMouse(type, point, buttons) {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    button: type === 'mousemove' ? -1 : 0,
    buttons,
    clientX: point.clientX,
    clientY: point.clientY,
  });
}

function bindTouchDrag() {
  const layer = ensureLayer();
  let dragging = false;

  layer.addEventListener(
    'touchstart',
    (event) => {
      const target = event.target;
      const root = target instanceof Element ? target.closest(MASCOT_ROOT_SEL) : null;
      if (!root) return;
      const point = firstTouch(event);
      if (!point) return;

      // 只接管真正落在宠物本体上的触摸。128×128 的框里大块区域是透明的，
      // 在那里也 preventDefault 会让页面滚不动，所以先按像素 alpha 判定。
      const engine = rootEngines.get(root);
      if (engine && typeof engine.isOpaqueAt === 'function' &&
          !engine.isOpaqueAt(point.clientX, point.clientY)) {
        return;
      }

      // 阻止页面滚动，否则浏览器会取消这次触摸序列
      event.preventDefault();
      dragging = true;
      root.dispatchEvent(synthesizeMouse('mousedown', point, 1));
    },
    { passive: false }
  );

  window.addEventListener(
    'touchmove',
    (event) => {
      if (!dragging) return;
      const point = firstTouch(event);
      if (!point) return;
      event.preventDefault();
      window.dispatchEvent(synthesizeMouse('mousemove', point, 1));
    },
    { passive: false }
  );

  const endTouch = (event) => {
    if (!dragging) return;
    dragging = false;
    const point = firstTouch(event) || { clientX: 0, clientY: 0 };
    window.dispatchEvent(synthesizeMouse('mouseup', point, 0));
  };
  window.addEventListener('touchend', endTouch);
  window.addEventListener('touchcancel', endTouch);
}

/* ---------- 事件源 ---------- */

// 设置面板改动（由 js/script.js 派发）
window.addEventListener('mascot:update', apply);

// 低性能模式通过切换 <html> 的 class 生效；顺带覆盖 hide-lyric 等无关 class
new MutationObserver(apply).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});

// 跨断点时只在用户没有显式选择的情况下重算默认值
MOBILE_MQ.addEventListener('change', () => {
  invalidateWorkArea();
  if (!readStored()) apply();
});

/* ---------- 工作区失效监听 ----------
 * workArea() 会读侧栏的位置，属于布局读取（会触发重排），
 * 因此缓存起来，只在真正可能变化时失效。 */
window.addEventListener('resize', invalidateWorkArea, { passive: true });
window.addEventListener('orientationchange', invalidateWorkArea);

const sidebarEl = document.querySelector(SIDEBAR_SEL);
if (sidebarEl && 'ResizeObserver' in window) {
  // 侧栏尺寸变化（断点切换、字体加载、主题变化）时重算
  new ResizeObserver(invalidateWorkArea).observe(sidebarEl);
}

// 移动端拖拽（触摸 → 合成鼠标事件），见 bindTouchDrag
bindTouchDrag();

/* ---------- 供传统脚本（js/script.js）调用的接口 ---------- */
window.__mascot = {
  /** 用户偏好（不含低性能模式的强制覆盖），供设置面板回显 */
  getPreference: preference,
  setPreference(mode) {
    if (VALID_MODES.indexOf(mode) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      /* 隐私模式下可能写不进去，忽略 */
    }
    apply();
  },
  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    apply();
  },
  /** 当前真实运行的模式，调试用 */
  getActiveMode() {
    return activeMode;
  },
  /** 当前工作区（CSS px），调试用 */
  getWorkArea() {
    return workArea();
  },
  /** 引擎实例（含 area()/position()/snapshot()），调试用 */
  getEngines() {
    return instances.map((m) => m.engine).filter(Boolean);
  },
};

/* ---------- 启动 ----------
 * 首屏先让给关键资源，等主线程空闲（最多 3s）再拉素材，
 * 避免和字体、头图抢带宽。 */
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(apply, { timeout: 3000 });
} else {
  window.setTimeout(apply, 1200);
}
