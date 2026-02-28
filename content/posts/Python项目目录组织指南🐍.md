---
date: 2026-02-28T17:10:00+08:00
draft: false
title: Python项目目录组织指南🐍
tags:
  - Python
  - 项目工程化
  - 最佳实践
categories:
  - 技术指南
---

# 让你的 Python 项目告别混乱：一份实用的目录组织指南

你是否有过这样的经历：打开几个月前写的项目，看着一堆散落的 `.py` 文件陷入沉思——这个是干什么的？那个又被谁调用？入口文件到底是哪个？

或者更糟：同事发来一个项目，你解压后看到几十个文件平铺在根目录，连 README 都找不到，顿时兴趣全无。

如果你点头了，那么这篇文章就是写给你的。

## 为什么项目结构很重要？

想象你搬家到一个新房子。如果所有东西——衣服、厨具、文件、零食——都堆在客厅里，你的生活会变成什么样？找个东西要翻遍整个房间，朋友来做客无处下脚，想整理都不知道从哪里开始。

Python 项目也是一样。**当你的代码从单个脚本增长到成百上千个文件时，如何组织它们决定了项目的生死**。

一个好的项目结构能让：
- **你自己** 快速找到需要修改的代码
- **新同事** 在 5 分钟内理解项目布局
- **测试** 与源码清晰分离，不会混在一起
- **部署** 变得可预测和自动化

## 先看一个糟糕的例子

很多 Python 开发者都是从这样开始的：

```
my-project/
├── main.py
├── utils.py
├── database.py
├── api.py
├── test.py
├── config.py
└── new_utils.py
```

看起来还行？但问题已经在悄悄滋生：

1. **`import` 的地雷阵**：当你运行 `python main.py` 时，Python 会把当前目录加到搜索路径。这意味着你可以直接 `import utils`，但也意味着你可能错误地导入了其他同名模块。

2. **测试在哪里？**：`test.py` 看起来很孤单，而且和源码混在一起。当项目变大后，测试文件会淹没在源码中。

3. **配置混乱**：`config.py` 和代码放在一起，意味着每次部署都要小心不要把配置文件一起打包。

4. **无法打包**：如果你想把项目分享给别人，或者发布到 PyPI，这种结构根本无法打包。

## 两种主流布局：src vs flat

Python 社区争论已久的话题：**源码应该放在哪里？**

### Flat Layout（扁平布局）

```
my-project/
├── README.md
├── pyproject.toml
├── my_package/
│   ├── __init__.py
│   └── module.py
└── tests/
    └── test_module.py
```

**优点**：简单直观，适合快速原型和脚本

**缺点**：
- 开发时，项目根目录在 Python 搜索路径中
- 容易意外导入本地文件而非安装的包
- 打包时需要额外配置排除测试等文件

### Src Layout（推荐）

```
my-project/
├── README.md
├── pyproject.toml
├── src/
│   └── my_package/
│       ├── __init__.py
│       └── module.py
└── tests/
    └── test_module.py
```

**优点**：
- 强制通过安装来使用项目，避免意外导入
- 测试一定会导入已安装的包，而非本地文件
- 打包更简单明确

**缺点**：
- 需要额外的安装步骤（`pip install -e .`）
- 对初学者来说多了一层目录

### 为什么推荐 src layout？

想象一下这个场景：你的项目叫 `awesome_utils`，而 Python 环境里已经安装了一个同名库。在 flat layout 下，你运行代码时 Python 可能导入你本地的文件，而不是已安装的库。这种 bug 会让你怀疑人生。

src layout 通过**强制安装**来避免这个问题。你的代码和已安装的包走同一条路径，不会有"两个版本"的混乱。

## 一个完整的项目模板

以下是一个适用于大多数 Python 项目的结构：

```
my-project/
├── src/                          # 源代码目录
│   └── my_package/               # 你的包名
│       ├── __init__.py           # 包初始化文件
│       ├── main.py               # 主要逻辑
│       ├── utils.py              # 工具函数
│       └── sub_package/          # 子包
│           └── __init__.py
├── tests/                        # 测试目录
│   ├── __init__.py
│   ├── conftest.py               # pytest 配置
│   └── test_main.py              # 主逻辑测试
├── docs/                         # 文档（可选）
├── scripts/                      # 脚本和工具（可选）
├── .gitignore                    # Git 忽略文件
├── README.md                     # 项目说明
├── LICENSE                       # 许可证
├── pyproject.toml                # 项目配置
└── requirements.txt              # 依赖列表（可选）
```

### 核心文件说明

| 文件/目录 | 作用 |
|-----------|------|
| `src/` | 包含所有源代码，与测试和配置分离 |
| `tests/` | 测试代码，与源码分离，便于 CI/CD |
| `pyproject.toml` | 现代标准的项目配置文件，包含依赖、构建配置等 |
| `README.md` | 项目说明，告诉别人这是什么、怎么用 |
| `.gitignore` | 告诉 Git 哪些文件不要提交（如虚拟环境、缓存） |
| `LICENSE` | 开源许可证，告诉别人可以如何使用你的代码 |

## 实践建议

### 1. 从一开始就做好结构

不要想着"以后再整理"。项目一旦成型，重构目录结构的痛苦远超你的想象。哪怕只是一个脚本，也值得给它一个合适的"家"。

### 2. 保持一致性

无论你选择 src 还是 flat，**保持整个项目的一致性**。不要一部分用 src，另一部分用 flat。

### 3. 分离关注点

- **源码**在 `src/` 或 `your_package/`
- **测试**在 `tests/`
- **文档**在 `docs/`
- **配置**在根目录

### 4. 使用虚拟环境

无论项目大小，**始终使用虚拟环境**。它隔离了项目依赖，避免"我的机器上能跑"的尴尬。

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e .
```

### 5. 写好 README.md

你的项目目录再清晰，如果 README 写得像谜语，也没人愿意用。一个好的 README 应该回答：
- 这是什么？
- 解决什么问题？
- 如何安装？
- 如何使用？
- 如何运行测试？

## 不同场景的选择

| 场景 | 推荐布局 |
|------|---------|
| 快速脚本、一次性任务 | 单个 `.py` 文件即可 |
| 个人小工具、实验性项目 | flat layout 够用 |
| 打算发布到 PyPI 的库 | src layout |
| 多人协作的项目 | src layout |
| 长期维护的生产项目 | src layout + 完整结构 |

## 总结

好的项目结构不是装饰品，它是**可维护性的基础**。当你：

- 能在 10 秒内找到需要修改的文件
- 新同事能在半小时内跑通项目
- 一次 `pip install` 就能部署到新环境

你就知道，当初花时间规划目录结构是多么值得。

**记住**：你的项目结构是你给未来的自己（和同事）的一封信——告诉他们这个项目是如何组织的，如何优雅地修改和扩展它。

从今天开始，给每个 Python 项目一个像样的家吧。

---

## 参考资料

- [Python Packaging User Guide - src layout vs flat layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)
- [Real Python - project layout](https://realpython.com/ref/best-practices/project-layout/)
- [The Hitchhiker's Guide to Python - Structuring Your Project](https://docs.python-guide.org/writing/structure/)
- [pyOpenSci - Python Package Structure](https://www.pyopensci.org/python-package-guide/package-structure-code/python-package-structure.html)
- [Hitchhiker's Guide to Python](https://docs.python-guide.org/)
