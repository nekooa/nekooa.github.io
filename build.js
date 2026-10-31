#!/usr/bin/env node
/*!
 * ねねねこ —— 压缩构建脚本
 * Copyright (C) 2026 holo-world (sagiri-world / nekooa)
 *
 * 本文件是自由软件：你可以依据 GNU 通用公共许可证（GPL）第 3 版
 * （或你选择的任何更新版本）的条款重新发布和/或修改它。
 * 本文件按"无任何担保"分发，详见仓库根目录的 LICENSE。
 */
/**
 * 构建脚本做三件事：
 *
 *   1. 把未压缩源码压成页面实际加载的 *.min.js
 *   2. 把 4 个首屏 CSS 合并成 styles/bundle.css（减少请求数）
 *   3. 给静态资源打上内容指纹：xxx.js?v=1a2b3c4d
 *
 * 为什么需要第 3 步
 * ----------------
 * 没有指纹就只能给静态资源 `max-age=0, must-revalidate`，
 * 于是每次进站/切页浏览器都要为每个 CSS/JS 问一次"变了没"，
 * 在国内到 Cloudflare 的延迟下，这就是实打实的几百毫秒起步。
 *
 * 有了内容指纹，_headers 里就能给 /js/*、/styles/* 设成
 *   Cache-Control: public, max-age=31536000, immutable
 * 浏览器一年内完全不再请求它们；而 HTML 保持不缓存，
 * 所以每次部署都会拿到新的指纹 URL —— 既快又不会看到旧样式。
 *
 * 用法：
 *   npm install     # 首次安装 terser
 *   npm run build   # 生成 .min.js + bundle.css + 更新所有 HTML 的 ?v=
 *
 * 提醒：改完 js/script.js、xf-MusicPlayer.js、styles/*.css 之后
 *       一定要跑一次 npm run build 再提交，否则线上还是旧的。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let minify;
try {
  ({ minify } = require('terser'));
} catch (err) {
  console.error('找不到 terser，请先运行：npm install');
  process.exit(1);
}

/** 源码 → 产物 映射 */
const TARGETS = [
  { src: 'js/script.js', dest: 'js/script.min.js' },
  { src: 'xf-MusicPlayer.js', dest: 'xf-MusicPlayer.min.js' },
];

/**
 * 首屏 CSS 合并。
 * 顺序必须与原来 HTML 里 <link> 的先后完全一致，
 * 否则层叠顺序变了，样式就会走样。
 */
const CSS_BUNDLE = {
  dest: 'styles/bundle.css',
  sources: [
    'vendor/highlight.js/11.9.0/atom-one-dark.min.css',
    'styles/style.css',
    'styles/article-typography.css',
    'styles/viewer.css',
  ],
};

/** 需要打内容指纹的资源（页面里以 ?v=hash 引用） */
const VERSIONED = [
  CSS_BUNDLE.dest,
  'js/script.min.js',
  'js/viewer.js',
  'xf-MusicPlayer.min.js',
];

const terserOptions = {
  compress: { passes: 2 },
  // 故意不开 toplevel：页面里的内联 onclick="initGiscus()" 以及播放器
  // 都在依赖 ColorThemeManager / initGiscus 这类顶层全局名，混淆掉会直接报错。
  mangle: true,
  // 只保留 /*! ... */ 形式的署名 / 授权注释
  format: { comments: /^!/ },
};

const root = __dirname;
const abs = (p) => path.resolve(root, p);

function hashOf(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 10);
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

let failed = false;
function fail(msg) {
  console.error(msg);
  failed = true;
}

/* ---------------- 1. JS 压缩 ---------------- */
async function buildScripts() {
  for (const { src, dest } of TARGETS) {
    if (!fs.existsSync(abs(src))) {
      fail(`跳过：找不到源文件 ${src}`);
      continue;
    }

    const code = read(src);

    let result;
    try {
      result = await minify(code, terserOptions);
    } catch (err) {
      fail(`压缩失败：${src}\n${err}`);
      continue;
    }

    if (!result || typeof result.code !== 'string') {
      fail(`压缩失败：${src}（terser 未返回结果）`);
      continue;
    }

    fs.writeFileSync(abs(dest), `${result.code}\n`, 'utf8');

    const before = Buffer.byteLength(code, 'utf8');
    const after = Buffer.byteLength(result.code, 'utf8');
    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`  ${src} → ${dest}   ${before} B → ${after} B  （省 ${saved}%）`);
  }
}

/* ---------------- 2. CSS 合并 ---------------- */
function buildCssBundle() {
  const parts = [];

  for (const src of CSS_BUNDLE.sources) {
    if (!fs.existsSync(abs(src))) {
      fail(`CSS 合并：找不到 ${src}`);
      return;
    }
    parts.push(`/* ==== ${src} ==== */\n${read(src).trim()}\n`);
  }

  const header = '/*!\n * ねねねこ 样式合并产物 —— 由 build.js 生成，请勿手动编辑。\n' +
    ' * 修改样式请改 styles/style.css、article-typography.css、viewer.css 后重新 npm run build。\n' +
    ' * 版权与许可见仓库根目录 LICENSE / THIRD-PARTY-NOTICES.md。\n */\n';

  const output = header + parts.join('\n');
  fs.writeFileSync(abs(CSS_BUNDLE.dest), output, 'utf8');

  const bytes = Buffer.byteLength(output, 'utf8');
  console.log(`  ${CSS_BUNDLE.sources.length} 个 CSS → ${CSS_BUNDLE.dest}   ${bytes} B`);
}

/* ---------------- 3. 内容指纹 ---------------- */
function stampHtml() {
  const hashes = new Map();
  for (const rel of VERSIONED) {
    if (!fs.existsSync(abs(rel))) {
      fail(`打指纹：找不到 ${rel}`);
      return;
    }
    hashes.set(rel, hashOf(fs.readFileSync(abs(rel))));
  }

  const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  let touched = 0;

  for (const file of htmlFiles) {
    const filePath = abs(file);
    const original = fs.readFileSync(filePath, 'utf8');
    let output = original;

    for (const [rel, hash] of hashes) {
      // 同时兼容 src="x" / href="x" / src="./x" / 已带旧指纹的情况
      const candidates = [rel, `./${rel}`];
      for (const target of candidates) {
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(src|href)="(${escaped})(?:\\?v=[0-9a-z]+)?"`, 'g');
        output = output.replace(re, (_m, attr, p) => `${attr}="${p}?v=${hash}"`);
      }
    }

    if (output !== original) {
      fs.writeFileSync(filePath, output, 'utf8');
      touched += 1;
    }
  }

  console.log(`  已为 ${touched} 个页面写入资源指纹：`);
  for (const [rel, hash] of hashes) {
    console.log(`    ${rel}  →  ?v=${hash}`);
  }
}

/* ---------------- 执行 ---------------- */
(async () => {
  console.log('构建开始…');
  await buildScripts();
  buildCssBundle();
  if (!failed) stampHtml();

  if (failed) {
    console.error('构建失败：见上面的错误。');
    process.exit(1);
  }
  console.log('构建完成：产物、CSS 合并与资源指纹均已同步。');
})();
