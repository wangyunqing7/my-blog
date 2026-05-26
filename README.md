# My Blog

基于 [Astro](https://astro.build) 构建的个人博客，托管于 [wangyunqing.top](https://www.wangyunqing.top)。

## 功能

- 文章列表与归档
- 分类与标签系统
- 全文搜索（基于 Fuse.js）
- RSS 订阅
- Sitemap 站点地图
- 目录导航（Table of Contents）
- 响应式设计

## 技术栈

- **框架**: Astro 6
- **搜索**: Fuse.js
- **RSS**: @astrojs/rss
- **部署**: 静态站点生成（SSG）

## 项目结构

```
src/
├── components/     # 页面组件（导航、页脚、目录等）
├── content/
│   └── posts/      # 博客文章（Markdown）
├── layouts/        # 页面布局模板
├── lib/            # 工具函数
├── pages/          # 路由页面
└── styles/         # 全局样式
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
