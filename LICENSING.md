# 授权说明 / Licensing

ねねねこ —— 纯 HTML / CSS / JS 编写的个人博客。

本仓库采用**分项授权**：程序代码与图文内容适用不同的许可证。完整法律文本见
[LICENSE](LICENSE)（GPL-3.0）与 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

版权所有者：**nekooa**（holo-world / sagiri-world）
Copyright (C) 2026 nekooa

---

## 1. 程序代码 —— GNU GPL v3.0

适用于本仓库中由本站作者编写的全部程序代码，包括但不限于：

- `*.html`、`styles/*.css`、`js/*.js`
- `xf-MusicPlayer.js` / `xf-MusicPlayer.min.js`（本站作者的修改部分）
- `build.js` 等构建脚本

这是 **GNU 通用公共许可证第 3 版**。你可以自由使用、修改和再分发，但须遵守
其条款，主要是：

- 再分发时**必须附带完整源代码**，并以同样的 GPL-3.0 许可；
- 修改过的文件**必须保留修改声明**；
- 不得附加额外限制。

> **为什么是 GPL-3.0？**
> 本站内嵌的音乐播放器 `xf-MusicPlayer.js` 是第三方作品「小枫音乐播放器」
> 旧版实现的修改版，该版本以 **GPL-3.0**（强 copyleft）发布，
> 因此本站代码整体采用 GPL-3.0，以保持授权一致。
> 详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

> 声明位置：`js/script.js`、`styles/style.css`、`build.js`、`xf-MusicPlayer.js`
> 等主要程序文件的顶部带有 GPL 声明头（`*.min.js` 经压缩后仍保留）。
> HTML 页面因同时承载图文内容，未逐文件添加声明头，其**代码部分**同样由
> 根目录的 [LICENSE](LICENSE) 覆盖。

## 2. 图文内容 —— CC BY-NC-SA 4.0

适用于**本站作者原创**的文字与图像内容，包括但不限于博客文章
（`article*.html`）、小说（`novel*.html`）、页面文案，以及作者自己拍摄、
绘制或制作的图片（例如教程截图、聊天记录截图）。

> ⚠️ **不适用于第三方画作**。本站部分配图取自 pixiv 等平台的他人作品，
> 其版权归**原画师**所有，本站作者无权对其授权，因此这些图片**不在**
> CC BY-NC-SA 4.0 的授权范围内——想使用它们请直接联系原画师。
> 详见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) 的「第三方画作」一节。

许可协议：[知识共享 署名-非商业性使用-相同方式共享 4.0 国际
（CC BY-NC-SA 4.0）](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)

简言之：可自由转载、改编，但须**署名**、**不得商用**、并以**相同方式共享**。
完整法律文本：<https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-Hans>

## 3. 第三方组件

第三方组件**不适用**上述授权，各自遵循其原始许可证，详见
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。其中：

| 组件 | 许可证 |
|---|---|
| 小枫音乐播放器（旧版，本仓库大幅修改） | GPL-3.0 |
| Viewer.js / giscus / highlight.js / jQuery / Pixi.js | MIT 或 BSD-3-Clause |
| GSAP / TweenMax | GreenSock 标准免费许可（非 OSI 认证） |
| mikutap | 非营利免费使用，商用需授权 |
| **第三方画作（pixiv 等平台的插画）** | **保留所有权利（版权归原画师）** |

## 4. 关于"聚合"与许可共存

本仓库在同一份分发中共存了几类**彼此独立的作品**：

- 本站程序代码（GPL-3.0）
- 本站原创图文（CC BY-NC-SA 4.0）
- **第三方画作（版权归原画师，本站未获授权时不得由本站转授）**
- 第三方组件（各自的许可证，其中 mikutap 为"仅限非营利"）

它们属于**聚合**（aggregate）而非合并成单一作品：各部分的许可证只约束自己
那一部分。因此 GPL-3.0 代码与采用"非商业"条款的内容/子目录可以并存，但请
注意：

- 你不能因为代码是 GPL-3.0 就认为**文章**可以商用（文章是 CC BY-NC-SA）；
- 也不能因为文章是"非商业"就认为**代码**不能商用（GPL-3.0 明确允许商用）；
- **更不能用本仓库的任何许可证去使用第三方画作**——那些图不在本站可授权的
  范围内，必须另行取得原画师的许可。
- 若你把 GPL-3.0 代码与实际内容**合并**成一个新作品再分发，需同时满足两者，
  这在"非商业"条款上会产生冲突——此时应把内容替换为你自己拥有权利的内容。

---

*本文件是便于理解的说明，不构成法律意见；如条款表述与
[LICENSE](LICENSE) 或 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
中的正式文本不一致，以正式文本为准。*
