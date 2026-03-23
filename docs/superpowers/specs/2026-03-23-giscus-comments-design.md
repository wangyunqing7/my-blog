# Giscus 评论系统集成设计

**日期**: 2026-03-23
**作者**: Claude
**状态**: 设计中

---

## 概述

为个人博客集成 Giscus 评论系统，基于 GitHub Discussions 存储评论数据，提供免费的评论功能。

### 需求

- 集成 Giscus 评论系统
- 使用 wangyunqing7/my-blog 仓库存储评论
- 评论按最新优先排序
- 懒加载方式提升性能
- 自动适配中文/英文语言
- 自动跟随深色/浅色主题

---

## 架构

```
文章页面
  ├── 文章内容
  ├── 文章元数据
  ├── 目录导航
  └── 评论区 (Giscus)
      ├── 连接到 GitHub Discussions
      ├── 自动适配主题
      └── 自动适配语言
```

---

## 文件结构

```
my-blog/
├── layouts/
│   └── partials/
│       └── comments.html          # 新建：Giscus 评论组件
├── hugo.yaml                      # 修改：添加 giscus 配置
└── content/posts/
    └── *.md                       # 可选：添加 comments: true
```

---

## 核心组件

### comments.html

创建 `layouts/partials/comments.html`：

```html
{{- /* Giscus 评论组件 */ -}}
<script src="https://giscus.app/client.js"
  data-repo="wangyunqing7/my-blog"
  data-repo-id="{{ site.Params.giscus.repoId }}"
  data-category="Announcements"
  data-category-id="{{ site.Params.giscus.categoryId }}"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="auto"
  data-loading="lazy"
  crossorigin="anonymous"
  async>
</script>
```

### hugo.yaml 配置

```yaml
params:
  # 现有配置保持不变

  # Giscus 评论配置
  giscus:
    repo: "wangyunqing7/my-blog"
    repoId: "从 Giscus 获取"
    categoryId: "从 Giscus 获取"
```

### 文章 frontmatter

```yaml
---
title: "文章标题"
comments: true  # 启用评论（可设为 false 禁用）
---
```

---

## 配置参数

| Giscus 参数 | 值 | 说明 |
|-------------|-----|------|
| data-repo | wangyunqing7/my-blog | 评论存储仓库 |
| data-mapping | pathname | 根据文章路径关联评论 |
| data-theme | preferred_color_scheme | 跟随系统主题 |
| data-lang | auto | 自动适配语言 |
| data-loading | lazy | 懒加载 |

---

## 实现步骤

1. **启用 GitHub Discussions**
   - 访问仓库 Settings → General → Features
   - 勾选 Discussions

2. **安装 Giscus App**
   - 访问 https://github.com/apps/giscus
   - 安装到 wangyunqing7/my-blog

3. **获取配置 ID**
   - 访问 https://giscus.app
   - 填入仓库信息
   - 复制 `data-repo-id` 和 `data-category-id`

4. **创建 comments.html**
   - 在 `layouts/partials/` 创建评论组件

5. **更新 hugo.yaml**
   - 添加 giscus 配置参数

6. **本地测试**
   - 运行 `hugo server`
   - 验证评论区显示

---

## 错误处理

| 场景 | 处理 |
|------|------|
| 未设置 comments: true | 不显示评论区 |
| Giscus 加载失败 | 显示错误，不影响文章 |
| 用户未登录 GitHub | 显示登录提示 |
| Discussions 未启用 | Giscus 显示错误 |

---

## 主题适配

使用 `preferred_color_scheme` 实现自动主题切换：

| 博客主题 | Giscus 主题 |
|----------|-------------|
| 浅色 | light |
| 深色 | dark |

与现有 `defaultTheme: auto` 配置匹配。

---

## 测试计划

| 测试项 | 验证内容 |
|--------|----------|
| 本地构建 | hugo server 正常运行 |
| 评论区显示 | 文章中能看到评论区 |
| 评论发布 | 能发布评论 |
| 主题切换 | 深色/浅色样式正确 |
| 懒加载 | 滚动时才加载 |
| 禁用评论 | comments: false 时隐藏 |

---

## 后续扩展

以下功能不在本次实现范围：

- 评论通知（webhook）
- 评论计数显示
- 匿名评论

---

## 变更日志

| 日期 | 变更 |
|------|------|
| 2026-03-23 | 初始设计 |
