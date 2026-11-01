# 个人博客
>只是我的个人博客罢了

使用纯 HTML CSS JS 编写。
部署在 GitHub Pages 和 CloudFlare Pages上。

*没什么好看的，有很多AI代码(*

---

## 本地预览

站点是纯静态的，但**站内链接是无扩展名写法**（`/article10` 而不是 `article10.html`，
和 Cloudflare Pages 的清理 URL 行为保持一致，见下面"性能约定"）。
`python3 -m http.server` 只会按文件路径找文件，访问 `/article10` 会直接 404，
所以请用仓库自带的小服务器：

```bash
npm run serve        # http://127.0.0.1:8000
# 或 node tools/preview.js 8080
```

它会补上 Pages 的两条行为：`/article10` → 返回 `article10.html`；
访问 `*.html` → 301 跳回无扩展名版本（顺便提醒你别把链接写回带 `.html` 的）。

部署不需要构建步骤：GitHub Pages / CloudFlare Pages 直接发布仓库根目录。

> **注意：VS Code Live Server（默认端口 5500）会与本页的 CSP 冲突**
>
> 页面带有 `script-src 'self'` 的内容安全策略，而 Live Server 会在 `</body>` 前
> 注入一段**内联脚本**来实现热重载，该脚本会被 CSP 拦截，控制台报
> `Executing inline script violates ... 'script-src 'self''`。
>
> 这只会让热重载失效，**页面功能不受影响**。若需要自动刷新，请改用普通静态服务器
> （如上），或在本地调试期间临时注释掉 HTML 里的 CSP `<meta>` 行。
> 不建议为此放开 `'unsafe-inline'`。

## 部署注意

1. 根目录的 `404.html` 不只是“自定义错误页”：Cloudflare Pages 在**缺少顶层 `404.html`** 时会把整站当成 SPA，
   对任何未匹配路径回退首页并返回 200（软 404）；补上它之后，未匹配路径才会真正返回 404 状态码。
   GitHub Pages 同样会使用这个文件。
2. 本地 `npm run serve` 已按同样行为实现（未匹配路径 → `404.html` + 404 状态码），
   和线上（存在顶层 `404.html` 时）的表现一致。
3. `sitemap.xml` 与所有页面的 `canonical` / `og:url` 都写死了域名 `https://0u0.l.cd`，换域名时要一起改。

## 构建

页面加载的是 `*.min.js` 和合并后的 `styles/bundle.css`，仓库里保存的是可读源码。
**改完源码后请重新构建**，否则改动不会在线上生效：

```bash
npm install     # 首次，安装 terser
npm run build   # 生成产物 + 合并 CSS + 刷新资源指纹
```

`npm run build` 做三件事：

1. 压缩 JS：`js/script.js` → `js/script.min.js`，`xf-MusicPlayer.js` → `xf-MusicPlayer.min.js`
2. 合并首屏 CSS：`style.css` + `article-typography.css` + `viewer.css` +
   highlight 主题 → `styles/bundle.css`（顺序与原 `<link>` 完全一致，层叠顺序不变）
3. 给产物算内容指纹，回写进全部 HTML 页面（含 `404.html`）：`styles/bundle.css?v=c2e3f12809`

映射关系：

| 源码 | 产物 | 被谁加载 |
|---|---|---|
| `js/script.js` | `js/script.min.js` | 全部页面 |
| `xf-MusicPlayer.js` | `xf-MusicPlayer.min.js` | 全部页面 |
| `styles/style.css` 等 4 个 CSS | `styles/bundle.css` | 全部页面 |

> `styles/bundle.css` 是**生成物，不要手改**；改完 `styles/*.css` 后重新 `npm run build`。
> 资源指纹没变说明文件没变，浏览器就会一直用本地缓存——这正是我们要的效果。

## 性能约定（改动前先读这段）

这些约定是为了不再回到"点一下等好几秒"的状态：

1. **站内链接一律无扩展名**：写成 `href="/article10"`，不要写 `href="/article10.html"`。
   Pages 会把带 `.html` 的地址 308 跳到无扩展名版本，等于每次点击多一个完整往返。
   侧边栏高亮、SPA 路由都基于 `pageKey()` 归一化后比较，写错扩展名会认不出来。
2. **`js/script.js` 里的 `loadPage()` 只管换 DOM**：取 HTML 由 `fetchPageHTML()` 负责，
   它有 12 秒硬超时、60 秒内存缓存、同名请求合并（预取在路上时点下去直接搭车）。
   改路由逻辑时别把 `navSeq` 的序号判断删掉，否则快速连点会互相覆盖 DOM。
3. **预取**：鼠标悬停 / 键盘聚焦 / 首屏空闲时会提前抓目标页 HTML。想关掉改
   `warmUpNavigation()` 即可；弱网与"省流量模式"下自动跳过。
4. **代码高亮按需加载**：`vendor/highlight.js` 不再写进 HTML，第一次出现
   `<code-box>` 时才由 `ensureHighlight()` 动态注入。新增语言要把语言包放进
   `vendor/highlight.js/11.9.0/` 并加进 `HIGHLIGHT_PACKS`。
5. **`_headers` 里 `/js/*`、`/styles/*` 是长缓存**，靠 `?v=` 指纹失效。
   新增静态文件如果也需要长缓存，记得加进 `build.js` 的 `VERSIONED` 列表。

## 目录速览

| 路径 | 说明 |
|---|---|
| `index.html` | 首页 |
| `404.html` | 自定义 404 页（同时用于关闭 Pages 的 SPA 回退） |
| `PAGE*.html` | 主页 / 文章 / 影音 / 项目 / 关于 的分区页 |
| `article*.html` | 文章（含上一篇/下一篇导航） |
| `novel*.html` | 小说连载 |
| `video*.html` | 影音页 |
| `js/` | 站点脚本与其压缩产物 |
| `styles/` | 样式（含主题变量、文章排版、播放器、giscus 主题） |
| `vendor/` | 自托管的第三方库（highlight.js、web-mascot 桌宠引擎） |
| `mascot_pack/` | 桌宠素材 Neuron / Eviling（CC BY-NC-SA 4.0，非商业） |
| `mikutap/` | 第三方音游玩具（原样收录） |
| `build.js` | 压缩构建脚本 |
| `robots.txt` / `sitemap.xml` | 搜索引擎配置 |

## 许可证

- **程序代码**（HTML / CSS / JS / 构建脚本）：**GNU GPL v3.0** — 见 [LICENSE](LICENSE)
- **本站原创图文**（文章、小说、自制截图）：**CC BY-NC-SA 4.0**
- **桌宠素材** `mascot_pack/`（Neuron / Eviling，第三方）：**CC BY-NC-SA 4.0，
  仅限非商业**；美术 Paccha，配置 @promote.
- **第三方画作**（pixiv 等平台的插画，用于头图/封面/头像）：**版权归原画师，
  不在本仓库授权范围内**

> 缘由说明：本站内嵌的音乐播放器来自第三方作品「小枫音乐播放器」的旧版实现
> （作者 小枫），该版本以 **GPL-3.0**（强 copyleft）发布。因此本站自有代码也
> 一并采用 GPL-3.0，使授权保持一致——这正是选择 GPL-3.0 的原因。

通俗说明见 [LICENSING.md](LICENSING.md)，第三方组件与画作的授权情况见
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
