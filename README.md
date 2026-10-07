# 个人博客
>只是我的个人博客罢了

使用纯 HTML CSS JS 编写。
部署在 GitHub Pages 和 CloudFlare Pages上。

*没什么好看的，有很多AI代码(*

---

## 本地预览

站点是纯静态的，直接起个静态服务器即可（推荐，`file://` 下部分功能不可用）：

```bash
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

部署同样不需要构建步骤：GitHub Pages / CloudFlare Pages 直接发布仓库根目录。

> **注意：VS Code Live Server（默认端口 5500）会与本页的 CSP 冲突**
>
> 页面带有 `script-src 'self'` 的内容安全策略，而 Live Server 会在 `</body>` 前
> 注入一段**内联脚本**来实现热重载，该脚本会被 CSP 拦截，控制台报
> `Executing inline script violates ... 'script-src 'self''`。
>
> 这只会让热重载失效，**页面功能不受影响**。若需要自动刷新，请改用普通静态服务器
> （如上），或在本地调试期间临时注释掉 HTML 里的 CSP `<meta>` 行。
> 不建议为此放开 `'unsafe-inline'`。

## 构建（仅用于生成压缩产物）

页面加载的是 `*.min.js`，仓库里保存的是可读源码。**改完源码后请重新压缩**，
否则改动不会在线上生效：

```bash
npm install     # 首次，安装 terser
npm run build   # 重新生成 js/script.min.js 与 xf-MusicPlayer.min.js
```

映射关系固定为：

| 源码 | 产物 | 被谁加载 |
|---|---|---|
| `js/script.js` | `js/script.min.js` | 全部页面 |
| `xf-MusicPlayer.js` | `xf-MusicPlayer.min.js` | 全部页面 |

## 目录速览

| 路径 | 说明 |
|---|---|
| `index.html` | 首页 |
| `PAGE*.html` | 主页 / 文章 / 影音 / 项目 / 关于 的分区页 |
| `article*.html` | 文章（含上一篇/下一篇导航） |
| `novel*.html` | 小说连载 |
| `video*.html` | 影音页 |
| `js/` | 站点脚本与其压缩产物 |
| `styles/` | 样式（含主题变量、文章排版、播放器、giscus 主题） |
| `vendor/` | 自托管的第三方库（highlight.js） |
| `mikutap/` | 第三方音游玩具（原样收录） |
| `build.js` | 压缩构建脚本 |
| `robots.txt` / `sitemap.xml` | 搜索引擎配置 |

## 许可证

- **程序代码**（HTML / CSS / JS / 构建脚本）：**GNU GPL v3.0** — 见 [LICENSE](LICENSE)
- **本站原创图文**（文章、小说、自制截图）：**CC BY-NC-SA 4.0**
- **第三方画作**（pixiv 等平台的插画，用于头图/封面/头像）：**版权归原画师，
  不在本仓库授权范围内**

> 缘由说明：本站内嵌的音乐播放器来自第三方作品「小枫音乐播放器」的旧版实现
> （作者 小枫），该版本以 **GPL-3.0**（强 copyleft）发布。因此本站自有代码也
> 一并采用 GPL-3.0，使授权保持一致——这正是选择 GPL-3.0 的原因。

通俗说明见 [LICENSING.md](LICENSING.md)，第三方组件与画作的授权情况见
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。
