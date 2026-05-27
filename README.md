# My Blog

基于 [Astro](https://astro.build) 构建的个人博客，托管于 [wangyunqing.top](https://www.wangyunqing.top)。

## 功能

- 文章列表与归档
- 分类与标签系统
- 作品集（多图展示、详情页）
- 全文搜索（基于 Fuse.js）
- RSS 订阅
- Sitemap 站点地图
- 目录导航（Table of Contents）
- 深色/浅色主题切换
- 移动端抽屉导航（768px 断点）
- 响应式设计

## 技术栈

- **框架**: Astro 6
- **搜索**: Fuse.js
- **RSS**: @astrojs/rss
- **部署**: 静态站点生成（SSG）

## 项目结构

```
src/
├── components/             # 可复用 UI 组件
│   ├── Comments.astro      #   文章评论区
│   ├── Footer.astro        #   页脚
│   ├── Nav.astro           #   导航栏
│   └── TableOfContents.astro  # 文章目录导航
├── content/
│   └── posts/              # 博客文章（Markdown，33 篇）
├── layouts/
│   └── Layout.astro        # 全局页面布局
├── lib/
│   └── utils.ts            # 工具函数（文章排序、日期格式化等）
├── pages/                  # 路由页面
│   ├── index.astro         #   首页
│   ├── about.astro         #   关于页
│   ├── archives.astro      #   归档页
│   ├── search.astro        #   搜索页
│   ├── gallery.astro       #   作品集列表
│   ├── rss.xml.ts          #   RSS 订阅源
│   ├── search.json.ts      #   搜索索引数据
│   ├── posts/
│   │   ├── index.astro     #   文章列表
│   │   ├── [slug].astro    #   文章详情
│   │   └── [page].astro    #   文章分页
│   ├── tags/
│   │   ├── index.astro     #   标签列表
│   │   └── [tag].astro     #   标签筛选页
│   └── gallery/
│       └── [slug].astro    #   作品集详情页
├── styles/
│   └── global.css          # 全局样式
├── assets/                 # 静态资源（SVG 等）
└── content.config.ts       # 内容集合定义与 schema 校验
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

## 写作

在 `src/content/posts/` 目录下创建 `.md` 文件，添加 frontmatter：

```yaml
---
title: 文章标题
date: 2026-01-01
categories: [分类]
tags: [标签1, 标签2]
---
```

## License

MIT
