# 第三方组件声明 / Third-Party Notices

本仓库包含以下第三方作品。它们各自遵循其原始许可证，**不适用**本仓库
[LICENSE](LICENSE) 中的 GPL-3.0 / CC BY-NC-SA 4.0 条款。

> 说明：其中的**小枫音乐播放器（旧版）为 GPL-3.0**。本仓库代码整体已采用
> GPL-3.0，因此两者一致、不存在冲突（这正是本站选择 GPL-3.0 的原因）。
>
> ⚠️ 另请注意：本站**配图中含有 pixiv 等平台的第三方画作**，其版权归原画师
> 所有，**不在本仓库任何授权范围内**，详见下方「第三方画作」专条。

| 组件 | 版本 | 许可证 | 位置 | 说明 |
|---|---|---|---|---|
| [Viewer.js](https://github.com/fengyuanchen/viewerjs) | 1.11.7 | MIT | `js/viewer.js` | 图片查看器，作者 Chen Fengyuan，版权头保留在文件顶部 |
| [giscus](https://github.com/giscus/giscus) | — | MIT | `js/giscus-client.js` | 评论系统的官方客户端脚本（压缩版） |
| [highlight.js](https://highlightjs.org/) | 11.9.0 | BSD-3-Clause | `vendor/highlight.js/11.9.0/` | 代码语法高亮，版权头保留在文件顶部 |
| [小枫音乐播放器](https://github.com/s33806/music-player) | 旧版（legacy） | **GPL-3.0** | 见下方专条 | 音乐播放器，作者小枫；本副本已大幅修改 |
| [jQuery](https://jquery.com/) | 2.2.4 | MIT | 仅 `mikutap/index.html` 经 CDN 加载 | Mikutap 依赖 |
| [Pixi.js](https://pixijs.com/) | 3.0.11 | MIT | 仅 `mikutap/index.html` 经 CDN 加载 | Mikutap 依赖 |
| [GSAP / TweenMax](https://greensock.com/) | 1.19.1 | GreenSock 标准免费许可（非 OSI 认证） | 仅 `mikutap/index.html` 经 CDN 加载 | Mikutap 依赖 |
| [mikutap](https://aidn.jp/mikutap) | — | 非营利免费使用，商用需授权 | `mikutap/` | 见下方专条 |
| **第三方画作**（pixiv 等平台的插画） | — | **保留所有权利（版权归原画师）** | 见下方专条 | 首页头图、文章封面、头像、影音缩略图 |

---

## 小枫音乐播放器 / XF Music Player（GPL-3.0）

作者：**小枫** `<1809185784@qq.com>`　官网：<https://musicplayer.xfyun.club>

### 上游与分支对应关系

| 上游 | 分支 | 内容 | 许可证 |
|---|---|---|---|
| <https://github.com/s33806/music-player> | `main` | 1.0.6，基于 Lit / Howler / Zustand 重写 | LGPL-3.0 |
| <https://gitee.com/xfwlclub/xf-MusicPlayer> | `main` | 同上 | LGPL-3.0 |
| <https://gitee.com/xfwlclub/xf-MusicPlayer> | `master` | **旧版原生 JS 实现（本副本所属）** | **GPL-3.0** |

### 本仓库涉及的文件

- `xf-MusicPlayer.js` / `xf-MusicPlayer.min.js`
- `styles/xf-MusicPlayer.css`
- `styles/xfplayIcon.css`
- `styles/iconfont.ttf`

### 许可证结论

本仓库使用的是上游的**旧版实现**，该版本随附的许可证是
**GNU 通用公共许可证第 3 版（GPL-3.0）**——即 Gitee `master` 分支的
`LICENSE`，与 GitHub 仓库历史中 `xf-MusicPlayer-master/LICENSE` 逐字节一致。
全文见仓库根目录的 [LICENSE](LICENSE)（本仓库代码整体即为 GPL-3.0）。

> 上游后来把**新版本**改成了 LGPL-3.0，但本仓库用的是旧版代码，
> 因此按 **GPL-3.0** 处理。
>
> GPL-3.0 是**强 copyleft**：本副本及其修改部分必须继续以 GPL-3.0 分发。
> 本仓库因此把**全部自有代码**一并采用 GPL-3.0，使授权保持一致，
> 详见 [LICENSING.md](LICENSING.md)。

### 修改声明（GPL-3.0 §5 要求）

上游旧版 `xf-MusicPlayer.js` 为 **911 行 / 44,874 字节**，且**文件本身不带
许可证头**（当时由仓库根目录的 `LICENSE` 覆盖）。本仓库副本由本站作者自
2026 年引入后持续修改（最近一次 2026-10），篇幅较上游增加约三分之一，
改动包括但不限于：

- 与站点主题系统联动（`ColorThemeManager` 向播放器注入配色变量）
- 歌单封面 `IntersectionObserver` 懒加载
- 歌词滚动、高亮与页面滚动时收起
- 低性能模式（`animations-off`）适配
- 第三方 API 数据转义（`escapeHTML` / `safeURL`，防 XSS）

`xf-MusicPlayer.js` 文件顶部保留了修改声明与许可证信息，`xf-MusicPlayer.min.js`
由 `npm run build` 从该源码生成，注释经压缩后仍保留。

---

## mikutap 版权说明

`mikutap/` 为第三方作品，提取自 <https://aidn.jp/mikutap>，国内适配版见
<https://github.com/AYJCSGM/mikutap>。

原作者说明（daniwell）：

> 本サイトにて公開している楽曲は非営利かつ公序良俗に反しない限り、
> 連絡なしにご自由にお使いいただいて構いません。

即：**非营利且不违背公序良俗的公共使用可免费使用、无需告知**；
商业用途请联系 <daniwell@aidn.jp>。
Exittunes 管理的曲目（「Nyan Cat」「ねこみみスイッチ」等）商用授权请见
<http://exittunes.com/license/>。

请勿移除原作者信息。

---

## 第三方画作（pixiv 等平台的插画）

本站部分**配图**取自 [pixiv](https://www.pixiv.net/) 等平台上他人创作的插画，
主要用于首页头图、文章封面、头像与影音缩略图。

**这些图片的版权归原画师所有，不属于本站作者。因此：**

- **不适用**本仓库的任何授权——既不是 GPL-3.0（代码），也不是
  CC BY-NC-SA 4.0（本站原创图文）；
- 本站作者**无权**为这些图片转授许可，也无法替你取得授权；
- 想使用这些图片，请**直接联系原画师**，到其在 pixiv 的作品页确认使用条款；
- 本仓库中发布的 `LICENSE` / `LICENSING.md` 对它们**不产生任何效力**。

### 权利人下架请求

如果你是本站中某张图片的权利人，且不希望它出现在本站，可通过以下任一方式联系：

- Telegram：<https://t.me/hello800767>
- Bilibili：<https://space.bilibili.com/1287762605>
- GitHub：<https://github.com/nekooa>（提交 Issue 或 PR）

收到通知并确认后，我们会尽快移除相关图片或补齐署名。
