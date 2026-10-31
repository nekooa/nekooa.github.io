#!/usr/bin/env node
/*!
 * ねねねこ —— 本地预览服务器
 * Copyright (C) 2026 holo-world (sagiri-world / nekooa)
 *
 * 本文件是自由软件：你可以依据 GNU 通用公共许可证（GPL）第 3 版
 * （或你选择的任何更新版本）的条款重新发布和/或修改它。
 */
/**
 * 为什么不用 `python3 -m http.server`
 * ----------------------------------
 * 站内链接已经改成 Cloudflare Pages 的"无扩展名"写法（/article10 而不是
 * article10.html），用来省掉服务器那一跳 308 重定向。python 自带的静态
 * 服务器只会按文件路径找文件，访问 /article10 会直接 404。
 *
 * 这个小服务器就是补上 Pages 的这两条行为：
 *   GET /article10      -> 返回 article10.html
 *   GET /article10.html -> 301 跳回 /article10（和线上一致，避免你写成 .html）
 *
 * 用法：
 *   npm run serve            # http://127.0.0.1:8000
 *   node tools/preview.js 8080
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Cache-Control': 'no-cache' }, headers));
  res.end(body);
}

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(url.parse(req.url).pathname);

  // 和 Pages 一样：带 .html 的地址跳回无扩展名版本
  if (pathname.endsWith('.html')) {
    const clean = pathname.replace(/\.html$/, '');
    return send(res, 301, '', { Location: clean === '/index' ? '/' : clean });
  }

  let file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT)) return send(res, 403, '403 Forbidden');

  if (pathname === '/' || pathname.endsWith('/')) {
    file = path.join(file, 'index.html');
  } else if (!fs.existsSync(file) && fs.existsSync(file + '.html')) {
    file += '.html';
  }

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return send(res, 404, '404 Not Found：' + pathname, { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`本地预览：http://127.0.0.1:${PORT}  (根目录 ${ROOT})`);
  console.log('提示：站内链接无扩展名，请用这个服务器预览，不要用 python3 -m http.server。');
});
