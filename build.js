#!/usr/bin/env node
/*!
 * ねねねこ —— 压缩构建脚本
 * Copyright (C) 2026 ねねねこ (holo-world / sagiri-world / nekooa)
 *
 * 本文件是自由软件：你可以依据 GNU 通用公共许可证（GPL）第 3 版
 * （或你选择的任何更新版本）的条款重新发布和/或修改它。
 * 本文件按"无任何担保"分发，详见仓库根目录的 LICENSE。
 */
/**
 * 构建脚本：把未压缩源码压缩成页面实际加载的 *.min.js
 *
 * 为什么需要它
 * ------------
 * 页面（index.html 等 21 个文件）加载的是 js/script.min.js 与
 * xf-MusicPlayer.min.js，而仓库里保存的是可读源码 js/script.js 与
 * xf-MusicPlayer.js。过去两者靠手工同步——改完源码忘记重新压缩，
 * 改动就不会在线上生效，而且没有任何提示。
 *
 * 现在只需一条命令：
 *
 *   npm install     # 首次安装 terser
 *   npm run build   # 重新生成全部 .min.js
 *
 * 站点本身依然是纯静态的：构建只用于生成产物，部署不需要构建步骤。
 */

'use strict';

const fs = require('fs');
const path = require('path');

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

const terserOptions = {
  compress: { passes: 2 },
  // 故意不开 toplevel：页面里的内联 onclick="initGiscus()" 以及播放器
  // 都在依赖 ColorThemeManager / initGiscus 这类顶层全局名，混淆掉会直接报错。
  mangle: true,
  // 只保留 /*! ... */ 形式的署名 / 授权注释
  format: { comments: /^!/ },
};

async function build() {
  let failed = false;

  for (const { src, dest } of TARGETS) {
    const srcPath = path.resolve(__dirname, src);
    const destPath = path.resolve(__dirname, dest);

    if (!fs.existsSync(srcPath)) {
      console.error(`跳过：找不到源文件 ${src}`);
      failed = true;
      continue;
    }

    const code = fs.readFileSync(srcPath, 'utf8');

    let result;
    try {
      result = await minify(code, terserOptions);
    } catch (err) {
      console.error(`压缩失败：${src}\n`, err);
      failed = true;
      continue;
    }

    if (!result || typeof result.code !== 'string') {
      console.error(`压缩失败：${src}（terser 未返回结果）`);
      failed = true;
      continue;
    }

    fs.writeFileSync(destPath, `${result.code}\n`, 'utf8');

    const before = Buffer.byteLength(code, 'utf8');
    const after = Buffer.byteLength(result.code, 'utf8');
    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`${src} → ${dest}   ${before} B → ${after} B  （省 ${saved}%）`);
  }

  if (failed) {
    process.exit(1);
  }
  console.log('构建完成：产物已与源码同步。');
}

build();
