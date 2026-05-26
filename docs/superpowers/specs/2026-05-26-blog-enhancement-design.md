# 博客功能全面增强设计文档

**项目**: my-blog (Astro 6)
**日期**: 2026-05-26
**方案**: 渐进增强 — 在现有 Astro 项目基础上实现全部功能

---

## 1. 内容架构：Markdown Content Collections

### 目录结构

```
src/
  content.config.ts       # 集合定义（位于 src/ 根目录）
  content/
    posts/                 # 文章 Markdown 文件
      welcome.md
      astro-blog.md
      ...
```

### Frontmatter Schema（Astro 6 Content Layer API）

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { posts };
```

### Markdown 文件示例

```yaml
---
title: "用 Astro 搭建极简博客"
date: 2026-05-20
description: "记录用 Astro 搭建博客的过程"
tags: ["Astro", "Web开发"]
draft: false
---

文章正文...
```

### 迁移策略

参考项目 (C:\Users\Yunqing72\Documents\my-blog) 的 30+ 篇 Markdown 文章可直接复制，frontmatter 格式兼容（date/title/tags/description 字段一致）。

**readingTime**: 迁移后由 Astro 在构建时从 Markdown 内容自动计算，替代 posts.ts 中的硬编码值。

**excerpt → description**: 页面中引用 `post.excerpt` 的地方更新为 `post.data.description`。

**移除 marked**: Astro Content Collections 内置 Markdown 渲染，`marked` 依赖及其手动调用将被移除。

---

## 2. 页面路由

| 路由 | 文件 | 功能 |
|------|------|------|
| `/` | `src/pages/index.astro` | 首页：最新 3 篇文章 + CTA |
| `/posts/` | `src/pages/posts/index.astro` | 文章列表，支持标签筛选 |
| `/posts/[slug]` | `src/pages/posts/[slug].astro` | 文章详情：TOC + 评论 + 标签 |
| `/tags/` | `src/pages/tags/index.astro` | 标签云页面 |
| `/tags/[tag]` | `src/pages/tags/[tag].astro` | 单标签下的所有文章 |
| `/archives/` | `src/pages/archives.astro` | 按年月分组的归档时间线 |
| `/about/` | `src/pages/about.astro` | 关于页面（已有，优化） |
| `/search/` | `src/pages/search.astro` | 全文搜索页面 |
| `/rss.xml` | `src/pages/rss.xml.ts` | RSS 订阅源 |
| `/sitemap-index.xml` | 自动生成 | sitemap（@astrojs/sitemap） |

---

## 3. 共享组件

当前导航栏和页脚在每个页面中重复。新增功能会增加更多导航项，必须提取为共享组件：

- `src/components/Nav.astro` — 共享导航栏（首页 | 文章 | 标签 | 归档 | 搜索 | 关于 + 主题切换）
- `src/components/Footer.astro` — 共享页脚
- 更新 Layout.astro 使用这些组件

---

## 4. 核心功能

### 4.1 全文搜索

**方案**: 构建时生成静态 JSON 文件 + 客户端 fuse.js 模糊搜索

**实现**:
- `src/pages/search.json.ts` — `GET` 函数，构建时生成包含所有文章标题/描述/slug/标签的静态 JSON 文件
- `src/pages/search.astro` — 搜索页面，加载 JSON + fuse.js
- 搜索框实时过滤，无后端依赖
- 30+ 篇文章的索引预计 < 50KB，无需分页或懒加载

**依赖**: `fuse.js`

### 4.2 文章目录 (TOC)

**方案**: 使用 Astro Content Collections 的内置 `headings` 属性

**实现**:
- `src/components/TableOfContents.astro` — 组件，接收 `headings` 数组（Astro render() 返回值直接提供，无需解析 HTML）
- CSS 行为：
  - 屏幕 < 1200px：隐藏或折叠
  - 屏幕 >= 1200px：固定在右侧边栏，跟随滚动
  - 当前阅读位置高亮（Intersection Observer）
- 参考 Hugo 项目的 TOC 设计：仅显示 h2 级别，简洁实用

### 4.3 评论系统 (Giscus)

**方案**: GitHub Discussions 驱动的评论系统

**配置**:
```javascript
// Giscus 参数
{
  repo: "wangyunqing7/my-blog",  // 部署前需确认仓库存在且已启用 Discussions
  category: "Announcements",
  mapping: "pathname",
  lang: "zh-CN",
  loading: "lazy",
  theme: "preferred_color_scheme",  // 跟随暗色模式
}
```

**实现**: `src/components/Comments.astro`，在文章详情页底部加载。

### 4.4 暗色模式

**方案**: CSS 变量 + 系统 preference 检测 + 手动切换

**实现**:
- `src/styles/global.css` 中定义 `[data-theme="dark"]` 变量集
- 保持暖色调设计语言的一致性：
  - 亮色：奶油白背景 + 珊瑚强调色
  - 暗色：中性深灰背景 + 琥珀/暖橙强调色（中性底 + 暖色强调，与亮色设计呼应）
- `src/components/ThemeToggle.astro` — 切换按钮，存储偏好到 localStorage
- 支持 `prefers-color-scheme` 系统级检测
- Giscus 评论跟随主题变化

### 4.5 RSS 订阅

**方案**: `@astrojs/rss` 官方集成

**前置条件**: `astro.config.mjs` 中必须设置 `site` 属性（如 `site: 'https://www.wangyunqing.top'`）

**实现**: `src/pages/rss.xml.ts` 输出标准 RSS 2.0 feed

**依赖**: `@astrojs/rss`

### 4.6 SEO 优化

**前置条件**: `astro.config.mjs` 中必须设置 `site` 属性

**实现**:
- `@astrojs/sitemap` 集成 — 自动生成 sitemap
- Layout.astro 中添加 OpenGraph meta 标签（og:title, og:description, og:image, og:type）
- 每篇文章自动生成 canonical URL
- robots.txt 静态文件

**依赖**: `@astrojs/sitemap`

### 4.7 标签系统

**方案**: Astro 动态路由，从文章 frontmatter 自动聚合

**实现**:
- `src/pages/tags/index.astro` — 收集所有唯一标签，展示标签云
- `src/pages/tags/[tag].astro` — `getStaticPaths()` 生成每个标签页面
- 标签可点击跳转到对应文章列表

### 4.8 归档页

**方案**: 按年份分组的文章时间线

**实现**: `src/pages/archives.astro`，按 date 降序排列，年份作为分组标题。

---

## 5. 文章详情页布局

```
┌─────────────────────────────────────────────────┐
│  ← 返回文章列表                    日期 · 阅读时间   │
├─────────────────────────────────────────────────┤
│  标题                                            │
│  标签: [tag1] [tag2] [tag3]                      │
├───────────────────────────────┬──────────────────┤
│                               │  目录 (TOC)      │
│  文章正文                     │  · 标题1         │
│  (Markdown 渲染)              │  · 标题2         │
│                               │    · 标题2.1     │
│                               │  · 标题3         │
│                               │                  │
├───────────────────────────────┴──────────────────┤
│  评论区 (Giscus)                                 │
└─────────────────────────────────────────────────┘
```

- 主体宽度约 700px，TOC 侧边栏约 200px
- 屏幕 < 1200px 时 TOC 隐藏

---

## 6. 设计系统扩展

### 颜色变量

```css
:root {
  /* 亮色（暖色调） */
  --bg-primary: #FFF8F0;
  --text-primary: #2D2016;
  --accent: #E8725C;
  /* ... */
}

[data-theme="dark"] {
  /* 暗色（中性深灰底 + 暖色强调） */
  --bg-primary: #1A1B1E;
  --text-primary: #E8E6E3;
  --accent: #F0A050;
  /* ... */
}
```

### 导航栏

提取为 `src/components/Nav.astro` 共享组件：

```
首页 | 文章 | 标签 | 归档 | 搜索 | 关于  [🌙/☀️]
```

---

## 7. Astro 配置更新

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.wangyunqing.top',
  integrations: [sitemap()],
});
```

---

## 8. 部署

保持现有 Vercel 部署方式（如有），或添加 `vercel.json` 配置。

---

## 9. 新增依赖

| 包名 | 用途 |
|------|------|
| `fuse.js` | 客户端模糊搜索 |
| `@astrojs/rss` | RSS 订阅源生成 |
| `@astrojs/sitemap` | sitemap 自动生成 |

**移除依赖**: `marked`（Astro 内置 Markdown 渲染替代）

---

## 10. 迁移清单

1. 将现有 posts.ts 中的 4 篇文章转为 Markdown 文件放入 `src/content/posts/`
2. 可选：从参考项目 `C:\Users\Yunqing72\Documents\my-blog\content\posts\` 复制文章
3. 删除 `posts.ts` 数据文件
4. 移除 `marked` 依赖
5. 更新所有引用 posts 数据的页面组件
6. 设置 `astro.config.mjs` 中的 `site` 属性
7. 提取 Nav/Footer 为共享组件

---

## 11. 不做的事情

- 不做 Google Analytics（可后续添加）
- 不做 PWA 图标套件（可后续添加）
- 不做社交分享按钮（可后续添加）
- 不做文章封面图功能（保持简单，可后续添加）
- 不做 i18n 国际化（当前仅需中文）
