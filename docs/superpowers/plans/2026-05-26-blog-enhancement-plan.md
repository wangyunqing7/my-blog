# 博客功能全面增强 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Astro 博客从基础站点升级为功能完整的博客，包含 Content Collections、搜索、TOC、评论、暗色模式、RSS、SEO、标签和归档。

**Architecture:** 使用 Astro 6 Content Layer API 管理文章，共享 Nav/Footer 组件消除重复，CSS 变量驱动暗色模式，fuse.js 客户端搜索，Giscus 评论。

**Tech Stack:** Astro 6, TypeScript, fuse.js, @astrojs/rss, @astrojs/sitemap, Giscus

---

## Chunk 1: 基础架构（Content Collections + 共享组件 + 配置）

### Task 1: 安装新依赖并更新 Astro 配置

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

- [ ] **Step 1: 安装依赖**

Run:
```bash
cd C:/Users/Yunqing72/blog/my-blog
npm install fuse.js @astrojs/rss @astrojs/sitemap
npm uninstall marked
```

- [ ] **Step 2: 更新 astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.wangyunqing.top',
  integrations: [sitemap()],
});
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: 成功（可能有内容警告但无错误）

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: add sitemap integration, configure site URL, remove marked"
```

---

### Task 2: 创建 Content Collections 配置

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: 创建 content.config.ts**

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: 创建 content/posts 目录**

Run: `mkdir -p src/content/posts`

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add content collections config for Astro 6"
```

---

### Task 3: 迁移现有文章为 Markdown 文件

**Files:**
- Create: `src/content/posts/building-blog-with-astro.md`
- Create: `src/content/posts/warm-color-design.md`
- Create: `src/content/posts/life-beyond-code.md`
- Create: `src/content/posts/css-has-selector.md`

- [ ] **Step 1: 创建第一篇文章**

```markdown
---
title: "用 Astro 搭建极简博客"
date: 2026-05-20
description: "为什么选择 Astro 作为博客框架，以及如何从零开始搭建一个温暖而简约的个人站点。"
tags: ["Astro", "前端"]
---

## 为什么选 Astro

在众多静态站点生成器中，Astro 以「零 JavaScript 默认输出」的理念脱颖而出。对于一个内容为主的博客来说，这意味着更快的加载速度和更好的阅读体验。

Astro 的核心优势：

- **内容优先**：原生支持 Markdown 和 MDX，无需额外配置
- **零 JS**：组件在构建时渲染为纯 HTML，不向客户端发送多余脚本
- **框架无关**：可以混合使用 React、Vue、Svelte 等任何框架的组件
- **简洁至上**：文件即路由，学习成本极低

## 搭建过程

从 `npm create astro@latest` 开始，整个搭建过程不到十分钟。选择最简模板后，项目结构清晰明了：

```
src/
├── pages/       # 页面路由
├── layouts/     # 布局组件
├── components/  # 可复用组件
└── styles/      # 全局样式
```

## 设计理念

这个博客追求的不是功能的堆砌，而是**阅读体验的纯粹**。暖色调的选择是有意为之——奶油色的背景、深棕色的文字、赤陶色的点缀，都是为了让读者感到放松和舒适。

正如 Dieter Rams 所说：「好的设计是尽可能少的设计。」一个博客，安静地承载文字，这就够了。
```

- [ ] **Step 2: 创建第二篇文章**

```markdown
---
title: "暖色调设计的温柔力量"
date: 2026-04-15
description: "探索色彩心理学中暖色系的应用，以及如何在数字产品中营造舒适、亲切的视觉体验。"
tags: ["设计", "色彩"]
---

## 色彩与情绪

人类对色彩的反应是本能的。研究表明，暖色调（红、橙、黄及其衍生色）能够唤起安全感、亲近感和舒适感。这并非偶然——温暖的颜色让我们联想到阳光、炉火和大地。

> 色彩是一种直达灵魂的力量。 — 瓦西里·康定斯基

## 暖色在数字设计中的应用

在屏幕上使用暖色调需要克制。大面积的暖色容易显得嘈杂，关键在于**平衡**：

1. **奶油色作为基础**：`#FDFBF7` 这类暖白色既不刺眼，又比纯白更有温度
2. **深棕代替纯黑**：`#2D2A26` 这样的深棕色作为文字色，比 `#000` 更柔和
3. **赤陶色点缀**：`#B86B4A` 用在标题强调、链接、按钮等关键元素上

## 一个练习

下次打开一个让你感到舒适的应用时，注意它的配色。你大概率会发现，那种「舒适感」来自暖色调的精心运用，而不是某个特别酷的交互效果。

好的设计是感受得到的，但说不出来为什么。
```

- [ ] **Step 3: 创建第三篇文章**

```markdown
---
title: "代码之外的生活"
date: 2026-03-08
description: "程序员的生活不止代码。关于阅读、咖啡、散步，以及那些让创造更持久的日常习惯。"
tags: ["生活", "随笔"]
---

## 写在前面

持续输出的秘密不在于更努力地工作，而在于更好地生活。这一篇不聊技术，聊聊代码之外那些同样重要的事。

## 早起散步

每天早上六点半出门，走三十分钟。不带手机，不听播客，只是走。这个习惯坚持了两年，带来的变化是：

- 思绪变得更清晰
- 一整天的精力更充沛
- 很多技术方案是在走路时想到的

## 关于咖啡

从速溶到手冲，咖啡不只是提神工具。磨豆、注水、等待——这个过程本身就是一种冥想。推荐一支埃塞俄比亚的耶加雪菲，花果香，干净明亮。

## 阅读

技术书之外，每个月读两本非技术类的书。最近在读的是《百年孤独》和《禅与摩托车维修艺术》。阅读拓宽的不只是知识面，还有思考问题的角度。

## 写在最后

程序是写给人读的，顺便让机器执行。写好程序的前提，是过好生活。
```

- [ ] **Step 4: 创建第四篇文章**

```markdown
---
title: "CSS :has() 选择器改变了什么"
date: 2026-02-22
description: "终于可以在 CSS 中实现「父选择器」了。看看 :has() 如何简化那些曾经必须依赖 JavaScript 的交互。"
tags: ["CSS", "前端"]
---

## 等了很久的特性

CSS :has() 选择器，常被称为「父选择器」，在 2022 年底开始获得主流浏览器支持。它解决了一个长期存在的痛点：**根据子元素的状态来改变父元素的样式**。

## 基本用法

```css
/* 当表单内有获得焦点的 input 时，改变表单边框 */
form:has(input:focus) {
  border-color: coral;
}

/* 当卡片内包含图片时，调整卡片布局 */
.card:has(img) {
  grid-template-columns: 1fr 2fr;
}
```

## 实际场景

### 1. 表单验证反馈

以前需要 JS 监听 input 事件来显示验证状态，现在：

```css
.form-group:has(input:invalid) .error-msg {
  display: block;
}
```

### 2. 暗色模式联动

```css
:root:has(.dark-toggle:checked) {
  color-scheme: dark;
}
```

### 3. 空状态处理

```css
.list:has(li) .empty-state {
  display: none;
}
```

## 性能

现代浏览器对 :has() 做了大量优化，实际使用中性能损耗可以忽略不计。大胆用。
```

- [ ] **Step 5: Commit**

```bash
git add src/content/posts/
git commit -m "feat: migrate posts from posts.ts to Markdown files"
```

---

### Task 4: 创建工具函数（替代 posts.ts）

**Files:**
- Create: `src/lib/utils.ts`

- [ ] **Step 1: 创建工具函数**

```typescript
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.ceil(minutes));
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getSortedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return tagMap;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add utility functions for posts, dates, reading time, tags"
```

---

### Task 5: 创建共享 Nav 和 Footer 组件

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: 创建 Nav.astro**

```astro
---
interface Props {
  active?: string;
}

const { active = '' } = Astro.props;

const navItems = [
  { href: '/', label: '首页', name: 'home' },
  { href: '/posts', label: '文章', name: 'posts' },
  { href: '/tags', label: '标签', name: 'tags' },
  { href: '/archives', label: '归档', name: 'archives' },
  { href: '/search', label: '搜索', name: 'search' },
  { href: '/about', label: '关于', name: 'about' },
];
---

<nav>
  <a href="/" class="logo">Yunqing</a>
  <div class="nav-links">
    {navItems.map((item) => (
      <a href={item.href} class:list={[active === item.name && 'active']}>
        {item.label}
      </a>
    ))}
    <button class="theme-toggle" id="theme-toggle" aria-label="切换主题">
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  </div>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1.75rem 1.5rem;
  }

  .logo {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--warm-900);
    letter-spacing: -0.02em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-links a {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--warm-500);
    transition: color 0.2s ease;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--warm-900);
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: var(--warm-500);
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
  }

  .theme-toggle:hover {
    color: var(--warm-900);
  }

  .icon-moon { display: none; }
  .icon-sun { display: block; }

  :global([data-theme="dark"]) .icon-moon { display: block; }
  :global([data-theme="dark"]) .icon-sun { display: none; }

  @media (max-width: 480px) {
    nav {
      padding: 1.25rem;
    }
    .nav-links {
      gap: 1rem;
    }
    .nav-links a {
      font-size: 0.8125rem;
    }
  }
</style>

<script>
  const toggle = document.getElementById('theme-toggle');
  function getTheme(): string {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  setTheme(getTheme());
  toggle?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
</script>
```

- [ ] **Step 2: 创建 Footer.astro**

```astro
---

---

<footer>
  <p>&copy; 2026 Yunqing &middot; 用心记录，安静生长</p>
</footer>

<style>
  footer {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    border-top: 1px solid var(--cream-300);
  }

  footer p {
    font-size: 0.8125rem;
    color: var(--warm-400);
    text-align: center;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add shared Nav and Footer components"
```

---

### Task 6: 更新 Layout.astro（SEO meta + 使用共享组件）

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: 更新 Layout.astro**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  active?: string;
  ogImage?: string;
}

const { title = "Yunqing's Blog", description = 'A warm corner for thoughts and code.', active = '', ogImage = '' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <Nav active={active} />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 成功

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: update Layout with SEO meta, shared Nav/Footer"
```

---

## Chunk 2: 页面更新（首页 + 文章列表 + 文章详情）

### Task 7: 更新首页

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 重写 index.astro 使用 Content Collections**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getSortedPosts, formatDate } from '../lib/utils';

const recentPosts = (await getSortedPosts()).slice(0, 3);
---

<Layout>
  <main>
    <section class="hero">
      <div class="hero-glow"></div>
      <p class="hero-eyebrow">欢迎来到我的小角落</p>
      <h1 class="hero-title">
        用文字记录<br />
        <span class="highlight">思考与创造</span>
      </h1>
      <p class="hero-desc">
        关于编程、设计与生活的碎片思考。<br />
        偶尔更新，始终真诚。
      </p>
      <div class="hero-actions">
        <a href="/posts" class="btn-primary">开始阅读</a>
        <a href="/about" class="btn-ghost">了解更多</a>
      </div>
    </section>

    <section class="recent">
      <h2 class="section-title">最新文章</h2>
      <div class="post-list">
        {recentPosts.map((post) => (
          <article class="post-card">
            <span class="post-date">{formatDate(post.data.date)}</span>
            <h3 class="post-title">
              <a href={`/posts/${post.id}`}>{post.data.title}</a>
            </h3>
            <p class="post-excerpt">{post.data.description}</p>
          </article>
        ))}
      </div>
      <a href="/posts" class="view-all">查看全部文章 &rarr;</a>
    </section>

    <section class="cta">
      <div class="cta-inner">
        <p class="cta-text">想收到新文章通知？</p>
        <a href="/rss.xml" class="btn-primary">订阅 RSS</a>
      </div>
    </section>
  </main>
</Layout>

<style>
  /* ── Hero ── */
  .hero {
    position: relative;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 6rem 1.5rem 5rem;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    top: -40%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      var(--coral-300) 0%,
      var(--cream-200) 40%,
      transparent 70%
    );
    opacity: 0.5;
    pointer-events: none;
    z-index: -1;
  }

  .hero-eyebrow {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--coral-500);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--warm-900);
    margin-bottom: 1.5rem;
  }

  .highlight {
    color: var(--terracotta);
    font-style: italic;
  }

  .hero-desc {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--warm-700);
    max-width: 480px;
    margin-bottom: 2.5rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: white;
    background: var(--warm-900);
    border-radius: 100px;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(45, 42, 38, 0.12);
  }

  .btn-primary:hover {
    background: var(--terracotta);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(184, 107, 74, 0.25);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--warm-700);
    border: 1.5px solid var(--warm-300);
    border-radius: 100px;
    transition: all 0.25s ease;
  }

  .btn-ghost:hover {
    color: var(--warm-900);
    border-color: var(--warm-900);
  }

  /* ── Recent Posts ── */
  .recent {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .section-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--warm-900);
    margin-bottom: 2.5rem;
    letter-spacing: -0.01em;
  }

  .post-list {
    display: flex;
    flex-direction: column;
  }

  .post-card {
    padding: 2rem 0;
    border-bottom: 1px solid var(--cream-300);
  }

  .post-card:first-child {
    padding-top: 0;
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .post-date {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--warm-400);
    letter-spacing: 0.02em;
  }

  .post-title {
    font-family: var(--font-serif);
    font-size: 1.375rem;
    font-weight: 500;
    line-height: 1.4;
    margin: 0.5rem 0;
    letter-spacing: -0.01em;
  }

  .post-title a {
    color: var(--warm-900);
    transition: color 0.2s ease;
  }

  .post-title a:hover {
    color: var(--terracotta);
  }

  .post-excerpt {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--warm-500);
    max-width: 540px;
  }

  .view-all {
    display: inline-block;
    margin-top: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--coral-500);
    transition: color 0.2s ease;
  }

  .view-all:hover {
    color: var(--terracotta);
  }

  /* ── CTA ── */
  .cta {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .cta-inner {
    background: var(--cream-200);
    border-radius: 1.25rem;
    padding: 3rem;
    text-align: center;
  }

  .cta-text {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    color: var(--warm-700);
    margin-bottom: 1.25rem;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 3.5rem 1.25rem 3rem;
    }

    .hero-title {
      font-size: clamp(2rem, 8vw, 2.75rem);
    }

    .recent,
    .cta {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    .cta-inner {
      padding: 2rem 1.5rem;
    }

    .hero-actions {
      flex-direction: column;
    }

    .btn-primary,
    .btn-ghost {
      justify-content: center;
      width: 100%;
    }

    .post-card {
      padding: 1.5rem 0;
    }
  }

  @media (max-width: 480px) {
    .hero {
      padding: 2.5rem 1rem 2rem;
    }

    .recent,
    .cta {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: update homepage to use Content Collections"
```

---

### Task 8: 更新文章列表页

**Files:**
- Modify: `src/pages/posts/index.astro`

- [ ] **Step 1: 重写 posts/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getSortedPosts, formatDate, getReadingTime } from '../../lib/utils';

const posts = await getSortedPosts();
---

<Layout title="文章 - Yunqing's Blog" description="所有文章，关于编程、设计与生活。" active="posts">
  <main>
    <section class="page-header">
      <h1 class="page-title">文章</h1>
      <p class="page-desc">关于编程、设计与生活的碎片思考</p>
    </section>

    <section class="post-list">
      {posts.map((post) => (
        <article class="post-card">
          <a href={`/posts/${post.id}`} class="post-link">
            <div class="post-meta">
              <time class="post-date">{formatDate(post.data.date)}</time>
              <span class="post-reading">{getReadingTime(post.body || '')} 分钟</span>
            </div>
            <h2 class="post-title">{post.data.title}</h2>
            <p class="post-excerpt">{post.data.description}</p>
            <div class="post-tags">
              {post.data.tags.map((tag) => (
                <span class="tag">{tag}</span>
              ))}
            </div>
          </a>
        </article>
      ))}
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .page-header {
    padding: 3rem 0 3.5rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .page-desc {
    font-size: 1.0625rem;
    color: var(--warm-500);
    line-height: 1.6;
  }

  .post-list {
    display: flex;
    flex-direction: column;
  }

  .post-card {
    border-bottom: 1px solid var(--cream-300);
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .post-link {
    display: block;
    padding: 2rem 0;
    transition: transform 0.2s ease;
  }

  .post-link:hover {
    transform: translateX(4px);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.625rem;
  }

  .post-date {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--warm-400);
  }

  .post-reading {
    font-size: 0.75rem;
    color: var(--warm-400);
    background: var(--cream-200);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .post-title {
    font-family: var(--font-serif);
    font-size: 1.375rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--warm-900);
    letter-spacing: -0.01em;
    margin-bottom: 0.625rem;
  }

  .post-link:hover .post-title {
    color: var(--terracotta);
  }

  .post-excerpt {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--warm-500);
    margin-bottom: 1rem;
    max-width: 540px;
  }

  .post-tags {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--warm-700);
    background: var(--cream-200);
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    letter-spacing: 0.02em;
  }

  @media (max-width: 768px) {
    .page-header {
      padding: 2rem 0 2.5rem;
    }

    main {
      padding: 0 1.25rem 3rem;
    }

    .post-link {
      padding: 1.5rem 0;
    }
  }

  @media (max-width: 480px) {
    main {
      padding: 0 1rem 3rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/posts/index.astro
git commit -m "feat: update posts listing to use Content Collections"
```

---

### Task 9: 创建 TableOfContents 组件

**Files:**
- Create: `src/components/TableOfContents.astro`

- [ ] **Step 1: 创建 TOC 组件**

```astro
---
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;
const tocItems = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---

{tocItems.length > 0 && (
  <nav class="toc" aria-label="目录">
    <h2 class="toc-title">目录</h2>
    <ul class="toc-list">
      {tocItems.map((h) => (
        <li class={`toc-item toc-depth-${h.depth}`}>
          <a href={`#${h.slug}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  </nav>
)}

<style>
  .toc {
    position: fixed;
    top: 6rem;
    right: 2rem;
    width: 180px;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .toc-title {
    font-family: var(--font-serif);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--warm-400);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.75rem;
  }

  .toc-list {
    list-style: none;
    padding: 0;
  }

  .toc-item {
    margin-bottom: 0.5rem;
  }

  .toc-item a {
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--warm-400);
    transition: color 0.2s ease;
    display: block;
  }

  .toc-item a:hover {
    color: var(--terracotta);
  }

  .toc-depth-3 {
    padding-left: 1rem;
  }

  .toc-active a {
    color: var(--terracotta);
    font-weight: 500;
  }

  @media (max-width: 1200px) {
    .toc {
      display: none;
    }
  }
</style>

<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const tocLink = document.querySelector(`.toc a[href="#${id}"]`);
        if (tocLink) {
          if (entry.isIntersecting) {
            document.querySelectorAll('.toc-item').forEach((el) => el.classList.remove('toc-active'));
            tocLink.parentElement?.classList.add('toc-active');
          }
        }
      });
    },
    { rootMargin: '-80px 0px -80% 0px' }
  );

  document.querySelectorAll('.article-content h2, .article-content h3').forEach((heading) => {
    if (heading.id) observer.observe(heading);
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TableOfContents.astro
git commit -m "feat: add Table of Contents component"
```

---

### Task 10: 创建 Comments 组件

**Files:**
- Create: `src/components/Comments.astro`

- [ ] **Step 1: 创建 Comments.astro**

```astro
---

---

<section class="comments">
  <h2 class="comments-title">评论</h2>
  <div class="giscus"></div>
</section>

<style>
  .comments {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--cream-300);
  }

  .comments-title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--warm-900);
    margin-bottom: 1.5rem;
  }
</style>

<script>
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  // 部署前需在 https://giscus.app 获取实际的 repo-id 和 category-id
  const GISCUS_REPO = 'wangyunqing7/my-blog';
  const GISCUS_REPO_ID = '';  // 填入实际值
  const GISCUS_CATEGORY = 'Announcements';
  const GISCUS_CATEGORY_ID = '';  // 填入实际值

  if (!GISCUS_REPO_ID || !GISCUS_CATEGORY_ID) {
    console.warn('Giscus comments not configured. Set GISCUS_REPO_ID and GISCUS_CATEGORY_ID.');
    return;
  }

  script.setAttribute('data-repo', GISCUS_REPO);
  script.setAttribute('data-repo-id', GISCUS_REPO_ID);
  script.setAttribute('data-category', GISCUS_CATEGORY);
  script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-lang', 'zh-CN');
  script.setAttribute('data-loading', 'lazy');
  script.setAttribute('data-theme', theme);
  script.crossOrigin = 'anonymous';
  script.async = true;

  const container = document.querySelector('.giscus');
  if (container) container.appendChild(script);

  // 跟随主题切换
  const observer = new MutationObserver(() => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme: newTheme } } }, 'https://giscus.app');
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Comments.astro
git commit -m "feat: add Giscus comments component"
```

---

### Task 11: 重写文章详情页（TOC + Comments）

**Files:**
- Modify: `src/pages/posts/[slug].astro`

- [ ] **Step 1: 重写 [slug].astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import TableOfContents from '../../components/TableOfContents.astro';
import Comments from '../../components/Comments.astro';
import { getCollection, render } from 'astro:content';
import { formatDate, getReadingTime } from '../../lib/utils';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
const readingTime = getReadingTime(post.body || '');
---

<Layout title={`${post.data.title} - Yunqing's Blog`} description={post.data.description} active="posts">
  <main>
    <article class="article">
      <header class="article-header">
        <div class="article-meta">
          <time>{formatDate(post.data.date)}</time>
          <span class="dot">&middot;</span>
          <span>{readingTime} 分钟阅读</span>
        </div>
        <h1 class="article-title">{post.data.title}</h1>
        <div class="article-tags">
          {post.data.tags.map((tag) => (
            <a href={`/tags/${tag}`} class="tag">{tag}</a>
          ))}
        </div>
      </header>

      <div class="article-with-toc">
        <section class="article-content">
          <Content />
        </section>
        <TableOfContents headings={headings} />
      </div>

      <footer class="article-footer">
        <a href="/posts" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          返回文章列表
        </a>
      </footer>

      <Comments />
    </article>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .article {
    padding-top: 1rem;
  }

  .article-header {
    margin-bottom: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--cream-300);
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--warm-400);
    margin-bottom: 1.25rem;
  }

  .dot {
    color: var(--warm-300);
  }

  .article-title {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: var(--warm-900);
    margin-bottom: 1.25rem;
  }

  .article-tags {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--warm-700);
    background: var(--cream-200);
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    transition: all 0.2s ease;
  }

  .tag:hover {
    background: var(--terracotta);
    color: white;
  }

  .article-with-toc {
    display: flex;
    position: relative;
  }

  .article-content {
    flex: 1;
    min-width: 0;
    font-size: 1.0625rem;
    line-height: 1.85;
    color: var(--warm-700);
  }

  /* ── Markdown Body ── */
  .article-content :global(h2) {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--warm-900);
    margin: 2.5rem 0 1rem;
    letter-spacing: -0.01em;
    scroll-margin-top: 2rem;
  }

  .article-content :global(h3) {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--warm-900);
    margin: 2rem 0 0.75rem;
  }

  .article-content :global(p) {
    margin-bottom: 1.25rem;
  }

  .article-content :global(ul),
  .article-content :global(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }

  .article-content :global(li) {
    margin-bottom: 0.375rem;
  }

  .article-content :global(strong) {
    color: var(--warm-900);
    font-weight: 600;
  }

  .article-content :global(blockquote) {
    border-left: 3px solid var(--coral-300);
    padding: 0.75rem 0 0.75rem 1.25rem;
    margin: 1.5rem 0;
    color: var(--warm-500);
    font-style: italic;
  }

  .article-content :global(code) {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875em;
    background: var(--cream-200);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    color: var(--terracotta);
  }

  .article-content :global(pre) {
    background: var(--warm-900);
    color: var(--cream-200);
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    overflow-x: auto;
    margin: 1.5rem 0;
    line-height: 1.6;
  }

  .article-content :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
    font-size: 0.875rem;
  }

  .article-content :global(hr) {
    border: none;
    border-top: 1px solid var(--cream-300);
    margin: 2rem 0;
  }

  /* ── Footer Nav ── */
  .article-footer {
    margin-top: 3.5rem;
    padding-top: 2rem;
    border-top: 1px solid var(--cream-300);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--warm-500);
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: var(--terracotta);
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }

    .article-content {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    main {
      padding: 0 1rem 3rem;
    }
  }
</style>
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 成功，所有 4 篇文章生成为静态页面

- [ ] **Step 3: Commit**

```bash
git add src/pages/posts/[slug].astro
git commit -m "feat: rewrite post detail with TOC, comments, Content Collections"
```

---

## Chunk 3: 新页面（标签 + 归档 + 搜索 + RSS + 暗色模式）

### Task 12: 创建标签页面

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

- [ ] **Step 1: 创建标签云页 tags/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getAllTags } from '../../lib/utils';

const tagMap = await getAllTags();
const sortedTags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);
---

<Layout title="标签 - Yunqing's Blog" description="按标签浏览文章。" active="tags">
  <main>
    <section class="page-header">
      <h1 class="page-title">标签</h1>
      <p class="page-desc">按主题浏览所有文章</p>
    </section>

    <section class="tag-cloud">
      {sortedTags.map(([tag, count]) => (
        <a href={`/tags/${tag}`} class="tag-item">
          <span class="tag-name">{tag}</span>
          <span class="tag-count">{count}</span>
        </a>
      ))}
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .page-header {
    padding: 3rem 0 3.5rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .page-desc {
    font-size: 1.0625rem;
    color: var(--warm-500);
    line-height: 1.6;
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--cream-100);
    border: 1px solid var(--cream-300);
    border-radius: 100px;
    font-size: 0.9375rem;
    color: var(--warm-700);
    transition: all 0.2s ease;
  }

  .tag-item:hover {
    background: var(--terracotta);
    border-color: var(--terracotta);
    color: white;
  }

  .tag-count {
    font-size: 0.75rem;
    color: var(--warm-400);
    background: var(--cream-200);
    padding: 0.1rem 0.5rem;
    border-radius: 100px;
  }

  .tag-item:hover .tag-count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }
  }
</style>
```

- [ ] **Step 2: 创建标签文章页 tags/[tag].astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getSortedPosts, formatDate, getReadingTime } from '../../lib/utils';

export async function getStaticPaths() {
  const posts = await getSortedPosts();
  const tags = new Map<string, typeof posts>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!tags.has(tag)) tags.set(tag, []);
      tags.get(tag)!.push(post);
    }
  }
  return [...tags.entries()].map(([tag, tagPosts]) => ({
    params: { tag },
    props: { tag, posts: tagPosts },
  }));
}

const { tag, posts: tagPosts } = Astro.props;
---

<Layout title={`标签: ${tag} - Yunqing's Blog`} description={`标签「${tag}」下的所有文章。`} active="tags">
  <main>
    <section class="page-header">
      <a href="/tags" class="back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        全部标签
      </a>
      <h1 class="page-title">{tag}</h1>
      <p class="page-desc">{tagPosts.length} 篇文章</p>
    </section>

    <section class="post-list">
      {tagPosts.map((post) => (
        <article class="post-card">
          <a href={`/posts/${post.id}`} class="post-link">
            <div class="post-meta">
              <time class="post-date">{formatDate(post.data.date)}</time>
              <span class="post-reading">{getReadingTime(post.body || '')} 分钟</span>
            </div>
            <h2 class="post-title">{post.data.title}</h2>
            <p class="post-excerpt">{post.data.description}</p>
          </a>
        </article>
      ))}
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .page-header {
    padding: 3rem 0 3.5rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--warm-500);
    transition: color 0.2s ease;
    margin-bottom: 1rem;
  }

  .back-link:hover {
    color: var(--terracotta);
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .page-desc {
    font-size: 1.0625rem;
    color: var(--warm-500);
    line-height: 1.6;
  }

  .post-list {
    display: flex;
    flex-direction: column;
  }

  .post-card {
    border-bottom: 1px solid var(--cream-300);
  }

  .post-card:last-child {
    border-bottom: none;
  }

  .post-link {
    display: block;
    padding: 2rem 0;
    transition: transform 0.2s ease;
  }

  .post-link:hover {
    transform: translateX(4px);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.625rem;
  }

  .post-date {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--warm-400);
  }

  .post-reading {
    font-size: 0.75rem;
    color: var(--warm-400);
    background: var(--cream-200);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .post-title {
    font-family: var(--font-serif);
    font-size: 1.375rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--warm-900);
    letter-spacing: -0.01em;
    margin-bottom: 0.625rem;
  }

  .post-link:hover .post-title {
    color: var(--terracotta);
  }

  .post-excerpt {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--warm-500);
    max-width: 540px;
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }

    .post-link {
      padding: 1.5rem 0;
    }
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/tags/
git commit -m "feat: add tags cloud and per-tag pages"
```

---

### Task 13: 创建归档页

**Files:**
- Create: `src/pages/archives.astro`

- [ ] **Step 1: 创建 archives.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getSortedPosts, formatDate } from '../lib/utils';

const posts = await getSortedPosts();

interface YearGroup {
  year: number;
  posts: typeof posts;
}

const grouped: YearGroup[] = [];
let currentYear = 0;

for (const post of posts) {
  const year = post.data.date.getFullYear();
  if (year !== currentYear) {
    currentYear = year;
    grouped.push({ year, posts: [] });
  }
  grouped[grouped.length - 1].posts.push(post);
}
---

<Layout title="归档 - Yunqing's Blog" description="所有文章按时间归档。" active="archives">
  <main>
    <section class="page-header">
      <h1 class="page-title">归档</h1>
      <p class="page-desc">按时间线浏览所有文章</p>
    </section>

    {grouped.map((group) => (
      <section class="year-group">
        <h2 class="year-title">{group.year}</h2>
        <ul class="archive-list">
          {group.posts.map((post) => (
            <li class="archive-item">
              <time class="archive-date">{formatDate(post.data.date)}</time>
              <a href={`/posts/${post.id}`} class="archive-title">{post.data.title}</a>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .page-header {
    padding: 3rem 0 3.5rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .page-desc {
    font-size: 1.0625rem;
    color: var(--warm-500);
    line-height: 1.6;
  }

  .year-group {
    margin-bottom: 3rem;
  }

  .year-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--coral-500);
    margin-bottom: 1.25rem;
    letter-spacing: -0.01em;
  }

  .archive-list {
    list-style: none;
    padding: 0;
  }

  .archive-item {
    display: flex;
    align-items: baseline;
    gap: 1.25rem;
    padding: 0.875rem 0;
    border-bottom: 1px solid var(--cream-300);
  }

  .archive-item:last-child {
    border-bottom: none;
  }

  .archive-date {
    font-size: 0.8125rem;
    color: var(--warm-400);
    min-width: 120px;
    flex-shrink: 0;
  }

  .archive-title {
    font-size: 1rem;
    color: var(--warm-700);
    transition: color 0.2s ease;
  }

  .archive-title:hover {
    color: var(--terracotta);
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }

    .archive-item {
      flex-direction: column;
      gap: 0.25rem;
    }

    .archive-date {
      min-width: auto;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/archives.astro
git commit -m "feat: add archives page with year grouping"
```

---

### Task 14: 创建搜索功能

**Files:**
- Create: `src/pages/search.json.ts`
- Create: `src/pages/search.astro`

- [ ] **Step 1: 创建搜索索引端点 search.json.ts**

```typescript
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
    tags: post.data.tags,
    date: post.data.date.toISOString().split('T')[0],
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

- [ ] **Step 2: 创建搜索页面 search.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="搜索 - Yunqing's Blog" description="搜索文章。" active="search">
  <main>
    <section class="page-header">
      <h1 class="page-title">搜索</h1>
      <p class="page-desc">在文章中查找内容</p>
    </section>

    <section class="search-section">
      <input type="text" class="search-input" id="search-input" placeholder="输入关键词..." autocomplete="off" />
      <div class="search-results" id="search-results"></div>
      <p class="search-hint" id="search-hint">输入关键词开始搜索</p>
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .page-header {
    padding: 3rem 0 3.5rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .page-desc {
    font-size: 1.0625rem;
    color: var(--warm-500);
    line-height: 1.6;
  }

  .search-section {
    margin-top: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
    font-family: var(--font-sans);
    color: var(--warm-900);
    background: var(--cream-100);
    border: 1.5px solid var(--cream-300);
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .search-input:focus {
    border-color: var(--coral-400);
  }

  .search-input::placeholder {
    color: var(--warm-300);
  }

  .search-results {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .search-hint {
    margin-top: 2rem;
    text-align: center;
    color: var(--warm-400);
    font-size: 0.9375rem;
  }

  .result-card {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--cream-300);
  }

  .result-card:last-child {
    border-bottom: none;
  }

  .result-title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--warm-900);
    margin-bottom: 0.5rem;
  }

  .result-title a {
    color: var(--warm-900);
    transition: color 0.2s ease;
  }

  .result-title a:hover {
    color: var(--terracotta);
  }

  .result-desc {
    font-size: 0.9375rem;
    color: var(--warm-500);
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .result-tags {
    display: flex;
    gap: 0.5rem;
  }

  .result-tag {
    font-size: 0.75rem;
    color: var(--warm-700);
    background: var(--cream-200);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .no-results {
    text-align: center;
    padding: 3rem 0;
    color: var(--warm-400);
    font-size: 0.9375rem;
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }
  }
</style>

<script>
  import Fuse from 'fuse.js';

  function escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  const input = document.getElementById('search-input') as HTMLInputElement;
  const results = document.getElementById('search-results')!;
  const hint = document.getElementById('search-hint')!;

  let fuse: Fuse<any> | null = null;

  async function initFuse() {
    const res = await fetch('/search.json');
    const data = await res.json();
    fuse = new Fuse(data, {
      keys: ['title', 'description', 'tags'],
      threshold: 0.4,
      includeScore: true,
    });
  }

  initFuse();

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (!query || !fuse) {
      results.innerHTML = '';
      hint.style.display = query ? 'none' : 'block';
      return;
    }

    hint.style.display = 'none';
    const matches = fuse.search(query);

    if (matches.length === 0) {
      results.innerHTML = '<p class="no-results">没有找到相关文章</p>';
      return;
    }

    results.innerHTML = matches
      .map(
        (m: any) => `
      <div class="result-card">
        <h3 class="result-title"><a href="/posts/${escapeHtml(m.item.slug)}">${escapeHtml(m.item.title)}</a></h3>
        <p class="result-desc">${escapeHtml(m.item.description)}</p>
        <div class="result-tags">
          ${m.item.tags.map((t: string) => `<span class="result-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `
      )
      .join('');
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/search.json.ts src/pages/search.astro
git commit -m "feat: add search page with fuse.js client-side search"
```

---

### Task 15: 创建 RSS 订阅源

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: 创建 RSS 端点**

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "Yunqing's Blog",
    description: 'A warm corner for thoughts and code.',
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}`,
    })),
    customData: '<language>zh-CN</language>',
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed endpoint"
```

---

### Task 16: 添加暗色模式 CSS 变量

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 在 global.css 中添加暗色模式变量**

在现有 `:root` 块之后添加：

```css
[data-theme="dark"] {
  --cream-50: #1A1B1E;
  --cream-100: #222326;
  --cream-200: #2A2B2F;
  --cream-300: #3A3B40;
  --warm-900: #E8E6E3;
  --warm-700: #B8B5B0;
  --warm-500: #8A8780;
  --warm-400: #6A6760;
  --warm-300: #4A4740;
  --coral-500: #F0A050;
  --coral-400: #E8B870;
  --coral-300: #D09060;
  --terracotta: #E8945C;
}
```

同时更新现有 body 规则，添加过渡效果：

```css
body {
  font-family: var(--font-sans);
  background-color: var(--cream-50);
  color: var(--warm-900);
  line-height: 1.7;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add dark mode CSS variables"
```

---

### Task 17: 更新关于页 + 添加 robots.txt

**Files:**
- Modify: `src/pages/about.astro`
- Create: `public/robots.txt`

- [ ] **Step 1: 更新 about.astro 使用共享组件**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="关于 - Yunqing's Blog" description="关于我，以及这个博客的故事。" active="about">
  <main>
    <section class="about-hero">
      <div class="avatar-wrapper">
        <div class="avatar">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="var(--cream-300)" />
            <circle cx="32" cy="24" r="10" fill="var(--warm-400)" />
            <ellipse cx="32" cy="48" rx="18" ry="12" fill="var(--warm-400)" />
          </svg>
        </div>
      </div>
      <h1 class="about-name">Yunqing</h1>
      <p class="about-bio">写代码，偶尔写点别的。</p>
    </section>

    <section class="about-content">
      <div class="about-section">
        <h2 class="section-heading">你好</h2>
        <p>
          我是一名软件开发者，对简洁的代码和温暖的设计有着同样的执念。白天写程序，晚上看书，偶尔在博客里记录一些思考碎片。
        </p>
        <p>
          这个博客是我的数字花园——种什么、什么时候种、长成什么样，都没有严格计划。唯一确定的是，每一篇都写得很认真。
        </p>
      </div>

      <div class="about-section">
        <h2 class="section-heading">技术栈</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-name">TypeScript</span>
            <span class="tech-desc">日常主力语言</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">React / Vue</span>
            <span class="tech-desc">前端框架</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Node.js</span>
            <span class="tech-desc">服务端开发</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Astro</span>
            <span class="tech-desc">本站构建工具</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Python</span>
            <span class="tech-desc">数据分析与脚本</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Figma</span>
            <span class="tech-desc">界面设计</span>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-heading">联系方式</h2>
        <div class="contact-links">
          <a href="https://github.com/" class="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            GitHub
          </a>
          <a href="mailto:hello@example.com" class="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M22 7l-10 7L2 7"/>
            </svg>
            Email
          </a>
          <a href="/rss.xml" class="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>
              <circle cx="5" cy="19" r="1"/>
            </svg>
            RSS
          </a>
        </div>
      </div>
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  .about-hero {
    text-align: center;
    padding: 2rem 0 3.5rem;
  }

  .avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--cream-200);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--cream-300);
  }

  .about-name {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 500;
    color: var(--warm-900);
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .about-bio {
    font-size: 1.0625rem;
    color: var(--warm-500);
  }

  .about-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .about-section {
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--cream-300);
  }

  .about-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .section-heading {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--warm-900);
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }

  .about-section p {
    font-size: 1rem;
    line-height: 1.85;
    color: var(--warm-700);
    margin-bottom: 1rem;
  }

  .about-section p:last-child {
    margin-bottom: 0;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .tech-item {
    background: var(--cream-100);
    padding: 1rem 1.25rem;
    border-radius: 12px;
    border: 1px solid var(--cream-300);
  }

  .tech-name {
    display: block;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--warm-900);
    margin-bottom: 0.25rem;
  }

  .tech-desc {
    font-size: 0.8125rem;
    color: var(--warm-400);
  }

  .contact-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .contact-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--cream-100);
    border: 1px solid var(--cream-300);
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--warm-700);
    transition: all 0.2s ease;
  }

  .contact-item:hover {
    background: var(--warm-900);
    border-color: var(--warm-900);
    color: var(--cream-50);
  }

  @media (max-width: 768px) {
    main {
      padding: 0 1.25rem 3rem;
    }

    .tech-grid {
      grid-template-columns: 1fr;
    }

    .contact-links {
      flex-direction: column;
    }

    .contact-item {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    main {
      padding: 0 1rem 3rem;
    }
  }
</style>
```

- [ ] **Step 2: 创建 robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://www.wangyunqing.top/sitemap-index.xml
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro public/robots.txt
git commit -m "feat: update about page with shared components, add robots.txt"
```

---

## Chunk 4: 清理 + 最终验证

### Task 18: 删除旧文件 + 清理

**Files:**
- Delete: `src/data/posts.ts`

- [ ] **Step 1: 删除旧数据文件**

Run:
```bash
rm src/data/posts.ts
rm -f src/components/Welcome.astro
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 成功，所有页面正确生成

- [ ] **Step 3: 启动开发服务器验证**

Run: `npm run dev`

验证清单：
- [ ] 首页加载正常，显示最新文章
- [ ] 文章列表页正常
- [ ] 点击文章进入详情页
- [ ] 文章详情页 TOC 显示（大屏）
- [ ] 暗色模式切换正常
- [ ] 标签云页面正常
- [ ] 点击标签进入标签文章列表
- [ ] 归档页面正常
- [ ] 搜索功能正常
- [ ] RSS 链接可访问
- [ ] 关于页面正常
- [ ] 导航链接正确，高亮当前页面

- [ ] **Step 4: Commit**

```bash
git add src/data/posts.ts src/components/Welcome.astro
git commit -m "feat: remove old posts.ts data file and unused Welcome component"
```
