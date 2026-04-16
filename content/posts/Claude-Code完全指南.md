---
date: 2026-03-11T21:00:00+08:00
draft: false
slug: claude-code-complete-guide
title: Claude Code 完全指南：从入门到精通
tags:
  - Claude Code
  - AI编程
  - 开发工具
  - 教程
  - Anthropic
categories:
  - 技术教程
author: "王云卿"
description: "从安装、核心工作流、MCP、Hooks 到 GitHub 集成，一篇文章带你系统掌握 Claude Code 的实际用法。"
comments: true
---

想象一下，如果你有一个超级聪明的编程搭档——它不仅能帮你写代码，还能读懂整个项目结构，自动运行命令，甚至帮你审查代码。这不是科幻小说，而是 Claude Code 带来的现实。

Claude Code 是 Anthropic 推出的命令行 AI 助手，它让 Claude 从聊天框里"走出来"，真正融入你的开发工作流。

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36629974659&p=1&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

## 01. 什么是 AI 编码助手？

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36629974734&p=2&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

在深入 Claude Code 之前，我们需要先理解 AI 编码助手的工作原理。这不仅仅是一个能写代码的工具，而是一个使用语言模型来处理复杂编程任务的精密系统。

### 编码助手的工作流程

当你给编码助手一个任务，比如根据错误信息修复 bug 时，它会按照类似人类开发者的方式来处理问题：

1. **收集上下文** - 理解错误指的是什么、代码库的哪个部分受影响、哪些文件是相关的
2. **制定计划** - 决定如何解决问题，比如修改代码并运行测试来验证修复
3. **执行操作** - 实际实现解决方案，更新文件并运行命令

这里的关键洞察是：第一步和最后一步需要助手与外部世界交互——读取文件、获取文档、运行命令或编辑代码。

### 工具使用的挑战

有趣的地方来了。语言模型本身只能处理文本并返回文本——它们实际上无法读取文件或运行命令。如果你让一个独立的语言模型读取文件，它会告诉你它没有这个能力。

那么编码助手是如何解决这个问题的？它们使用了一个聪明的系统，叫做"工具使用"（tool use）。

### 工具使用的工作原理

当你向编码助手发送请求时，它会自动在你的消息中添加指令，教语言模型如何请求操作。例如，它可能会添加类似这样的文本："如果你想读取文件，请回复 'ReadFile: 文件名'"

完整的流程是这样的：

1. 你问："main.go 文件里写了什么代码？"
2. 编码助手在你的请求中添加工具指令
3. 语言模型回复："ReadFile: main.go"
4. 编码助手读取实际文件并将内容发送回模型
5. 语言模型基于文件内容提供最终答案

这个系统让语言模型能够有效地"读取文件"、"编写代码"和"运行命令"，即使它们实际上只是生成精心格式的文本响应。

### 为什么 Claude 的工具使用很重要

并非所有语言模型在使用工具方面都同样出色。Claude 系列模型（Opus、Sonnet 和 Haiku）在理解工具的作用以及有效使用工具来完成复杂任务方面特别强。

这种强大的工具使用能力为 Claude Code 带来了几个关键优势：

- **处理更难的任务** - Claude 可以组合不同的工具来处理复杂工作，甚至可以使用它从未见过的工具
- **可扩展平台** - 你可以轻松地向 Claude Code 添加新工具，Claude 会适应并随着你工作流程的演变而使用它们
- **更好的安全性** - Claude Code 可以在不索引的情况下导航代码库，这通常意味着不需要将整个代码库发送到外部服务器

## 02. Claude Code 的实际应用

Claude Code 配备了一套全面的内置工具，可以处理常见的开发任务，比如读取文件、编写代码、运行命令和管理目录。但真正让 Claude Code 强大的是它如何智能地组合这些工具来处理复杂的多步骤问题。

比如，当你要求 Claude Code 实现一个新功能时，它可能会：
- 读取多个相关文件来理解代码结构
- 运行命令查看项目依赖
- 创建或修改多个文件
- 运行测试验证改动

所有这些工具调用都是智能组合的，不需要你一步步告诉它该做什么。

## 03. 安装和设置 Claude Code

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36629974821&p=3&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

是时候在本地设置 Claude Code 了！

### 安装步骤

简而言之，你需要做以下操作：

**安装 Claude Code：**

- **MacOS (Homebrew):** `brew install --cask claude-code`
- **MacOS, Linux, WSL:** `curl -fsSL https://claude.ai/install.sh | bash`
- **Windows CMD:** `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`

安装完成后，在终端运行 `claude`。第一次运行此命令时，系统会提示你进行身份验证。

### 云服务商的特殊设置

如果你要使用 AWS Bedrock 或 Google Cloud Vertex，有一些额外的设置步骤：

- **AWS Bedrock 的特殊说明：** https://code.claude.com/docs/en/amazon-bedrock
- **Google Cloud Vertex 的特殊说明：** https://code.claude.com/docs/en/google-vertex-ai

## 04. 项目设置

使用 Claude Code 处理项目会更有趣。课程准备了一个小项目来探索。这是一个之前视频中显示的 UI 生成应用。注意：你不必运行这个项目。你随时可以用自己的代码库跟随课程的其余部分！

### 设置步骤

这个项目需要少量的设置：

1. 确保本地安装了 Node JS
2. 下载附加到本讲座的名为 uigen.zip 的压缩文件并解压
3. 在项目目录中，运行 `npm run setup` 来安装依赖并设置本地 SQLite 数据库
4. 可选：此项目通过 Anthropic API 使用 Claude 来生成 UI 组件。如果你想完全测试应用程序，需要提供 API 密钥来访问 Anthropic API。这是可选的。如果没有提供 API 密钥，应用程序仍然会生成一些静态假代码。

## 05. 添加上下文：让 Claude 理解你的项目

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036499&p=4&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

在使用 Claude 处理编码项目时，上下文管理至关重要。你的项目可能有几十或几百个文件，但 Claude 只需要正确的信息就能有效地帮助你。太多不相关的上下文实际上会降低 Claude 的性能，因此学习引导它关注相关文件和文档是必不可少的。

### /init 命令

当你第一次在新项目中启动 Claude 时，运行 `/init` 命令。这会告诉 Claude 分析你的整个代码库并理解：

- 项目的目的和架构
- 重要的命令和关键文件
- 编码模式和结构

分析完代码后，Claude 会创建一个摘要并将其写入 CLAUDE.md 文件。当 Claude 请求权限创建此文件时，你可以按 Enter 批准每次写入操作，或按 Shift+Tab 让 Claude 在整个会话期间自由写入文件。

### CLAUDE.md 文件

CLAUDE.md 文件主要有两个目的：

1. **引导 Claude 了解你的代码库**，指出重要的命令、架构和编码风格
2. **允许你给 Claude 提供具体的或自定义的指令**

这个文件会被包含在你对 Claude 的每个请求中，所以它就像为你的项目提供了一个持久的系统提示。

### CLAUDE.md 文件的位置

Claude 在三个常见位置识别三种不同的 CLAUDE.md 文件：

1. **CLAUDE.md** - 用 /init 生成，提交到源代码控制，与其他工程师共享
2. **CLAUDE.local.md** - 不与其他工程师共享，包含给 Claude 的个人指令和自定义设置
3. **~/.claude/CLAUDE.md** - 用于你机器上的所有项目，包含你希望 Claude 在所有项目中遵循的指令

### 添加自定义指令

你可以通过在 CLAUDE.md 文件中添加指令来自定义 Claude 的行为。例如，如果 Claude 添加了太多注释，可以通过更新文件来解决这个问题。

使用 `#` 命令进入"记忆模式"——这让你能智能地编辑你的 CLAUDE.md 文件。只需输入类似这样的内容：

```
# 节俭地使用注释。只为复杂代码添加注释。
```

Claude 会自动将此指令合并到你的 CLAUDE.md 文件中。

### 用 '@' 提及文件

当你需要 Claude 查看特定文件时，使用 @ 符号后跟文件路径。这会自动将该文件的内容包含在你对 Claude 的请求中。

例如，如果你想询问认证系统并且知道相关文件，可以输入：

```
认证系统是如何工作的？@auth
```

Claude 会向你显示 auth 相关文件列表供选择，然后将选定的文件包含在对话中。

### 在 CLAUDE.md 中引用文件

你也可以使用相同的 @ 语法在 CLAUDE.md 文件中直接提及文件。这对于与项目的许多方面相关的文件特别有用。

例如，如果你有一个定义数据结构的数据库架构文件，可能会将其添加到你的 CLAUDE.md 中：

```
# 数据库架构在 @prisma/schema.prisma 文件中定义。每当你需要了解存储在数据库中的数据结构时，请参考它。
```

当你以这种方式提及文件时，其内容会自动包含在每个请求中，所以 Claude 可以立即回答有关数据结构的问题，而不必每次都搜索和读取架构文件。

## 06. 进行更改：让 Claude 帮你改代码

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036727&p=5&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

在开发环境中使用 Claude 时，你经常需要对现有项目进行更改。本指南涵盖了有效实施更改的实用技术，包括使用截图进行视觉沟通以及利用 Claude 的高级推理能力。

### 使用截图进行精确沟通

与 Claude 沟通的最有效方式之一是通过截图。当你想要修改界面的特定部分时，截图有助于 Claude 准确理解你指的是什么。

要将截图粘贴到 Claude 中，使用 **Ctrl+V**（在 macOS 上不是 Cmd+V）。这个键盘快捷键专门设计用于将截图粘贴到聊天界面中。粘贴图像后，你可以要求 Claude 对应用程序的该区域进行特定更改。

### 规划模式

对于需要在代码库中进行大量研究的更复杂任务，可以启用**规划模式**。此功能使 Claude 在实施更改之前彻底探索你的项目。

通过按 **Shift + Tab 两次**（如果你已经自动接受编辑，则按一次）来启用规划模式。在此模式下，Claude 将：

1. 读取项目中的更多文件
2. 创建详细的实施计划
3. 准确告诉你它打算做什么
4. 等待你的批准后再继续

这使你有机会审查计划，如果 Claude 遗漏了重要内容或没有考虑特定场景，可以重新定向它。

### 思考模式

Claude 通过"思考"模式提供不同程度的推理。这些模式允许 Claude 在提供解决方案之前花更多时间对复杂问题进行推理。

可用的思考模式包括：

1. **"Think"** - 基本推理
2. **"Think more"** - 扩展推理
3. **"Think a lot"** - 全面推理
4. **"Think longer"** - 扩展时间推理
5. **"Ultrathink"** - 最大推理能力

每种模式给 Claude 逐渐更多的 token 来处理，允许对挑战性问题进行更深入的分析。

### 何时使用规划与思考

这两个功能处理不同类型的复杂性：

**规划模式最适合：**
- 需要广泛了解代码库的任务
- 多步骤实施
- 影响多个文件或组件的更改

**思考模式最适合：**
- 复杂逻辑问题
- 调试困难问题
- 算法挑战

你可以为既需要广度又需要深度的任务结合使用这两种模式。只要记住，这两种功能都会消耗额外的 token，所以使用它们有成本考虑。

## 07. 控制上下文：掌握对话节奏

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036745&p=6&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

在使用 Claude 处理复杂任务时，你经常需要引导对话以保持专注和高效。有几种技术可以用来控制对话流程并帮助 Claude 保持正轨。

### 用 Escape 中断 Claude

有时 Claude 开始朝错误的方向前进或试图一次处理太多事情。你可以按 **Escape 键**在响应中途停止 Claude，允许你重新定向对话。

当你希望 Claude 专注于一个特定任务而不是试图同时处理多个事情时，这特别有用。例如，如果你要求 Claude 为多个函数编写测试，它开始为所有这些函数创建综合计划，你可以中断并要求它一次只专注于一个函数。

### 结合 Escape 和记忆

Escape 技术最强大的应用之一是修复重复性错误。当 Claude 在不同对话中重复犯同样的错误时，你可以：

1. 按 Escape 停止当前响应
2. 使用 # 快捷方式添加关于正确方法的记忆
3. 用更正的信息继续对话

这可以防止 Claude 在你项目的未来对话中犯同样的错误。

### 回退对话

在长对话中，你可能会积累变得无关或分散注意力的上下文。例如，如果 Claude 遇到错误并花时间调试它，这种来回讨论可能对下一个任务没有用处。

你可以通过按 **Escape 两次**来回退对话。这会显示你发送的所有消息，允许你跳回到较早的点并从那里继续。这种技术帮助你：

- 维持有价值的上下文（比如 Claude 对你代码库的理解）
- 移除分散注意力或不相关的对话历史
- 让 Claude 专注于当前任务

### 上下文管理命令

Claude 提供了几个命令来帮助有效管理对话上下文：

#### /compact

`/compact` 命令总结你的整个对话历史，同时保留 Claude 学到的关键信息。这在以下情况下最理想：

- Claude 获得了关于你的项目的宝贵知识
- 你想继续相关任务
- 对话已经变长但包含重要的上下文

当 Claude 对当前任务学到了很多东西，并且你想在继续下一个相关任务时保持这些知识时，使用 compact。

#### /clear

`/clear` 命令完全移除对话历史，给你一个新的开始。这在以下情况下最有用：

- 你要切换到一个完全不同的、不相关的任务
- 当前对话上下文可能会让 Claude 对新任务感到困惑
- 你想从头开始，没有任何之前的上下文

## 08. 自定义命令：自动化重复任务

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036935&p=7&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code 配有内置命令，你可以通过输入前斜杠来访问，但你也可以创建自己的自定义命令来自动化你经常运行的重复性任务。

### 创建自定义命令

要创建自定义命令，你需要在项目中设置特定的文件夹结构：

1. 在项目目录中找到 `.claude` 文件夹
2. 在其中创建一个名为 `commands` 的新目录
3. 使用你想要的命令名称创建一个新的 markdown 文件（比如 `audit.md`）

文件名就是你的命令名——所以 `audit.md` 创建 `/audit` 命令。

### 示例：审计命令

这是一个自定义命令的实际示例，它审计项目依赖项中的漏洞：

这个审计命令做三件事：

1. 运行 `npm audit` 查找已安装的易受攻击的包
2. 运行 `npm audit fix` 应用更新
3. 运行测试验证更新没有破坏任何东西

创建命令文件后，必须重启 Claude Code 才能识别新命令。

### 带参数的命令

自定义命令可以使用 `$ARGUMENTS` 占位符接受参数。这使它们更加灵活和可重用。

例如，`write_tests.md` 命令可能包含：

```
为以下内容编写全面的测试：$ARGUMENTS

测试约定：
* 使用 Vitest 和 React Testing Library
* 将测试文件放在与源文件相同文件夹的 __tests__ 目录中
* 将测试文件命名为 [filename].test.ts(x)
* 使用 @/ 前缀进行导入

覆盖率：
* 测试正常路径
* 测试边缘情况
* 测试错误状态
```

然后你可以用文件路径运行此命令：

```
/write_tests hooks 目录中的 use-auth.ts 文件
```

参数不必是文件路径——它们可以是任何你想要传递的字符串，为 Claude 提供任务的上下文和方向。

## 09. MCP 服务器：扩展 Claude Code 的能力

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036788&p=8&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

你可以通过添加 MCP（模型上下文协议）服务器来扩展 Claude Code 的能力。这些服务器远程运行或在你的本地机器上运行，为 Claude 提供它通常不具备的新工具和能力。

最流行的 MCP 服务器之一是 Playwright，它让 Claude 能够控制网络浏览器。这为 Web 开发工作流开启了强大的可能性。

### 安装 Playwright MCP 服务器

要将 Playwright 服务器添加到 Claude Code，在终端中（不是在 Claude Code 内部）运行以下命令：

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

这个命令做两件事：

1. 将 MCP 服务器命名为 "playwright"
2. 提供在你的本地机器上启动服务器的命令

### 管理权限

当你首次使用 MCP 服务器工具时，Claude 会每次请求权限。如果你厌倦了这些权限提示，可以通过编辑设置来预批准服务器。

打开 `.claude/settings.local.json` 文件并将服务器添加到 `allow` 数组：

```json
{
  "permissions": {
    "allow": ["mcp__playwright"],
    "deny": []
  }
}
```

注意 `mcp__playwright` 中的双下划线。这允许 Claude 在不每次请求许可的情况下使用 Playwright 工具。

### 实际示例：改进组件生成

以下是 Playwright MCP 服务器如何改进开发工作流程的真实示例。你可以让 Claude：

1. 打开浏览器并导航到你的应用程序
2. 生成一个测试组件
3. 分析视觉样式和代码质量
4. 根据观察到的内容更新生成提示
5. 用新组件测试改进的提示

例如，你可以要求 Claude：

"导航到 localhost:3000，生成一个基本组件，审查样式，并更新 @src/lib/prompts/generation.tsx 的生成提示，以在将来产生更好的组件。"

Claude 将使用浏览器工具与你的应用交互，检查生成的输出，然后修改你的提示文件以鼓励更加原创和有创意的设计。

## 10. GitHub 集成：让 AI 加入你的团队

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036966&p=9&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code 提供了一个官方 GitHub 集成，让 Claude 能够在 GitHub Actions 中运行。这个集成提供两个主要工作流：对 issue 和 pull request 的提及支持，以及自动 pull request 审查。

### 设置集成

要开始，在 Claude 中运行 `/install-github-app`。这个命令会引导你完成设置过程：

1. 在 GitHub 上安装 Claude Code 应用
2. 添加你的 API 密钥
3. 自动生成一个包含工作流文件的 pull request

生成的 pull request 会向你的仓库添加两个 GitHub Actions。合并后，你将在 `.github/workflows` 目录中拥有工作流文件。

### 默认的 GitHub Actions

集成提供两个主要工作流：

#### 提及操作

你可以在任何 issue 或 pull request 中使用 `@claude` 提及 Claude。当被提及时，Claude 将：

1. 分析请求并创建任务计划
2. 执行任务并完全访问你的代码库
3. 直接在 issue 或 PR 中回复结果

#### Pull Request 操作

每当你创建 pull request 时，Claude 会自动：

1. 审查提议的更改
2. 分析修改的影响
3. 在 pull request 上发布详细报告

### 自定义工作流

合并初始 pull request 后，你可以自定义工作流文件以适应你的项目需求。以下是增强提及工作流的方法：

#### 添加项目设置

在 Claude 运行之前，你可以添加步骤来准备环境：

```yaml
- name: Project Setup
  run: |
    npm run setup
    npm run dev:daemon
```

#### 自定义指令

为 Claude 提供有关项目设置的上下文：

```yaml
custom_instructions: |
  项目已经设置好，安装了所有依赖。
  服务器已经运行在 localhost:3000。日志写入到 logs.txt。
  如果需要，可以用 'sqlite3' cli 查询数据库。
  如果需要，使用 mcp__playwright 工具集启动浏览器并与应用交互。
```

## 11. Hooks：在关键时刻自动执行

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630036892&p=10&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Hooks 允许你在 Claude 尝试运行工具之前或之后运行命令。它们对于实现自动化工作流程非常有用，比如在文件编辑后运行代码格式化器、文件更改时执行测试，或阻止对特定文件的访问。

### Hooks 如何工作

要理解 hooks，让我们先回顾一下与 Claude Code 交互时的正常流程。当你问 Claude 一些事情时，你的查询连同工具定义一起被发送到 Claude 模型。Claude 可能通过提供格式化的响应来决定使用工具，然后 Claude Code 执行该工具并返回结果。

Hooks 将自己插入到这个过程中，允许你在工具执行发生之前或之后执行代码。

有两种类型的 hooks：

1. **PreToolUse hooks** - 在调用工具之前运行
2. **PostToolUse hooks** - 在调用工具之后运行

### Hook 配置

Hooks 在 Claude 设置文件中定义。你可以将它们添加到：

- **全局** - `~/.claude/settings.json`（影响所有项目）
- **项目** - `.claude/settings.json`（与团队共享）
- **项目（不提交）** - `.claude/settings.local.json`（个人设置）

你可以在这些文件中手动编写 hooks，或在 Claude Code 中使用 `/hooks` 命令。

#### PreToolUse Hooks

PreToolUse hooks 在工具执行之前运行。它们包括一个指定要针对哪些工具类型的匹配器：

```json
"PreToolUse": [
  {
    "matcher": "Read",
    "hooks": [
      {
        "type": "command",
        "command": "node /home/hooks/read_hook.ts"
      }
    ]
  }
]
```

在执行 'Read' 工具之前，此配置运行指定的命令。你的命令接收有关 Claude 想要进行的工具调用的详细信息，并且你可以：

- 允许操作正常继续
- 阻止工具调用并将错误消息发送回 Claude

#### PostToolUse Hooks

PostToolUse hooks 在工具已经执行后运行。以下是在写入、编辑或多编辑操作后触发的示例：

```json
"PostToolUse": [
  {
    "matcher": "Write|Edit|MultiEdit",
    "hooks": [
      {
        "type": "command",
        "command": "node /home/hooks/edit_hook.ts"
      }
    ]
  }
]
```

由于工具调用已经发生，PostToolUse hooks 无法阻止操作。然而，它们可以：

- 运行后续操作（比如格式化刚刚编辑的文件）
- 为 Claude 提供有关工具使用的额外反馈

### 实际应用

这里是使用 hooks 的一些常见方式：

- **代码格式化** - 在 Claude 编辑文件后自动格式化
- **测试** - 文件更改时自动运行测试
- **访问控制** - 阻止 Claude 读取或编辑特定文件
- **代码质量** - 运行 linter 或类型检查器并向 Claude 提供反馈
- **日志记录** - 跟踪 Claude 访问或修改的文件
- **验证** - 检查命名约定或编码标准

## 12. 定义 Hooks：构建模块详解

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630037205&p=11&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code 中的 hooks 允许你在执行之前或之后拦截和控制工具调用。这使你能够对 Claude 在开发环境中能做什么和不能做什么进行细粒度的控制。

### 构建 Hook

创建 hook 涉及四个主要步骤：

1. **决定 PreToolUse 或 PostToolUse hook** - PreToolUse hooks 可以阻止工具调用执行，而 PostToolUse hooks 在工具已经被使用后运行
2. **确定要监视的工具调用类型** - 你需要准确指定哪些工具应该触发你的 hook
3. **编写将接收工具调用的命令** - 此命令通过标准输入获取有关提议的工具调用的 JSON 数据
4. **如果需要，命令应该向 Claude 提供反馈** - 命令的退出代码告诉 Claude 是允许还是阻止操作

### 工具调用数据结构

当 hook 命令执行时，Claude 通过标准输入发送包含有关提议的工具调用详细信息的 JSON 数据：

```json
{
  "session_id": "2d6a1e4d-6...",
  "transcript_path": "/Users/sg/...",
  "hook_event_name": "PreToolUse",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/code/queries/.env"
  }
}
```

你的命令从标准输入读取此 JSON，解析它，然后根据工具名称和输入参数决定是允许还是阻止操作。

### 退出代码和控制流

你的 hook 命令通过退出代码与 Claude 通信：

- **退出代码 0** - 一切正常，允许工具调用继续
- **退出代码 2** - 阻止工具调用（仅限 PreToolUse hooks）

当你在 PreToolUse hook 中以代码 2 退出时，你写入标准错误的任何错误消息都将作为反馈发送给 Claude，解释操作为何被阻止。

## 13. 实现 Hook：保护敏感文件

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630037137&p=12&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

让我们构建一个自定义 hook 来防止 Claude 读取像 .env 这样的敏感文件。这是 hooks 如何在开发会话期间保护你的环境变量和其他机密数据的实际示例。

### 设置 Hook 配置

首先，我们需要在设置文件中配置我们的 hook。打开你的 `.claude/settings.local.json` 文件并找到 hooks 部分。我们要创建一个 PreToolUse hook，因为我们想在工具执行之前拦截调用。

配置需要两个关键部分：

1. **Matcher** - 指定要监视的工具
2. **Command** - 当调用这些工具时运行的脚本

对于匹配器，我们想要捕获可能访问 .env 文件的读取和 grep 操作：

```json
"matcher": "Read|Grep"
```

管道符号 (|) 充当 OR 运算符，所以这将在任一工具上触发。对于命令，我们将指向一个 Node.js 脚本：

```json
"command": "node ./hooks/read_hook.js"
```

### 实现 Hook 脚本

hook 脚本需要从标准输入读取工具调用数据并检查 Claude 是否试图访问 .env 文件。以下是核心逻辑：

```javascript
async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // 提取 Claude 试图读取的文件路径
  const readPath =
    toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";

  // 检查 Claude 是否试图读取 .env 文件
  if (readPath.includes('.env')) {
    console.error("你不能读取 .env 文件");
    process.exit(2);
  }
}
```

脚本检查文件路径中的 .env，如果找到则阻止操作。当你以代码 2 退出时，Claude 会收到错误消息并理解操作被 hook 阻止。

## 14. 有用的 Hooks：TypeScript 和查询防护

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630037235&p=13&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code hooks 可以帮助解决 AI 辅助开发中的常见弱点，特别是在较大的项目中。这些 hooks 在 Claude 对你的代码进行更改时自动运行，提供即时反馈并防止常见问题。

### TypeScript 类型检查 Hook

最有用的 hooks 之一解决了一个基本问题：当 Claude 修改函数签名时，它通常不会更新项目中调用该函数的所有位置。

例如，如果你要求 Claude 向 schema.ts 中的函数添加一个 verbose 参数，它会成功更新函数定义，但会错过 main.ts 中的调用点。这会产生 Claude 没有立即捕获的类型错误。

解决方案是一个在每次文件编辑后运行 TypeScript 编译器的 post-tool-use hook：

1. 运行 `tsc --noEmit` 检查类型错误
2. 捕获发现的任何错误
3. 立即将错误反馈给 Claude
4. 提示 Claude 修复其他文件中的问题

此 hook 适用于任何可以运行类型检查的类型化语言。对于非类型化语言，你可以使用自动测试实现类似功能。

### 查询重复防护 Hook

在有许多数据库查询的较大项目中，Claude 有时会创建重复功能而不是重用现有代码。当你给 Claude 复杂的多步骤任务，其中数据库操作只是一个组件时，这尤其成问题。

考虑一个包含多个查询文件的项目结构，每个文件包含许多 SQL 函数。当你要求 Claude "创建一个 Slack 集成，提醒超过 3 天未完成的订单"时，它可能会编写一个新查询而不是使用现有的 getPendingOrders() 函数。

查询重复 hook 通过实现审查过程来解决这个问题：

它的工作方式如下：

1. 当 Claude 修改 ./queries 目录中的文件时触发
2. 以编程方式启动单独的 Claude Code 实例
3. 要求第二个实例审查更改并检查类似的现有查询
4. 如果发现重复，向原始 Claude 实例提供反馈
5. 提示 Claude 删除重复项并使用现有功能

## 15. Claude Code SDK：编程方式运行 Claude

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630037424&p=14&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code SDK 允许你从自己的应用程序和脚本中以编程方式运行 Claude Code。它可用于 TypeScript、Python 和 CLI，提供与你在终端使用的相同的 Claude Code 功能，但集成到更大的工作流中。

SDK 运行的正是你已经熟悉的完全相同的 Claude Code。它可以访问所有相同的工具，并将使用它们来完成你给它的任何任务。这使其在自动化和集成场景中特别强大。

### 关键特性

- 以编程方式运行 Claude Code
- 与终端版本相同的 Claude Code 功能
- 继承同一目录中 Claude Code 实例的所有设置
- 默认为只读权限
- 作为较大管道或工具的一部分最有用

### 基本用法

这是一个简单的 TypeScript 示例，要求 Claude 分析代码以查找重复查询：

```typescript
import { query } from "@anthropic-ai/claude-code";

const prompt = "在 ./src/queries 目录中查找重复的查询";

for await (const message of query({
  prompt,
})) {
  console.log(JSON.stringify(message, null, 2));
}
```

当你运行此代码时，你将看到本地 Claude Code 和 Claude 语言模型之间的原始对话，逐条消息显示。最终消息包含 Claude 的完整响应。

### 权限和工具

默认情况下，SDK 只有只读权限。它可以读取文件、搜索目录和执行 grep 操作，但不能写入、编辑或创建文件。

要启用写权限，你可以将 allowedTools 选项添加到查询中：

```typescript
for await (const message of query({
  prompt,
  options: {
    allowedTools: ["Edit"]
  }
})) {
  console.log(JSON.stringify(message, null, 2));
}
```

或者，你可以在 .claude 目录内的设置文件中配置权限以进行项目范围访问。

## 16. 总结与进阶

<div class="video-container">
<iframe
    src="//player.bilibili.com/player.html?isOutside=true&aid=116211094461421&bvid=BV1VWwAzHEd5&cid=36630037435&p=15&autoplay=0&danmaku=0"
    width="100%"
    height="500"
    scrolling="no"
    frameborder="0"
    sandbox="allow-forms allow-same-origin allow-scripts allow-presentation"
    allowfullscreen>
</iframe>
</div>

Claude Code 不仅仅是一个 AI 工具，它代表了一种新的编程范式：**人机协作编程**。

在这种模式下，你负责"想做什么"，AI 负责"怎么做"。你的角色从"代码编写者"变成了"架构设计者"和"质量把控者"。

### 课程回顾

我们在这门课程中涵盖了许多内容：

- **基础概念**：AI 编码助手的工作原理和工具使用系统
- **入门设置**：安装 Claude Code 和配置项目
- **上下文管理**：使用 /init、CLAUDE.md 和文件引用
- **修改代码**：截图沟通、规划模式和思考模式
- **高级技巧**：控制对话流程和自定义命令
- **扩展能力**：MCP 服务器和 GitHub 集成
- **自动化**：Hooks 系统和 Claude Code SDK

### 实践建议

要真正用好 Claude Code，记住几点：

1. **明确你的意图**：AI 最怕模糊的需求
2. **提供足够的上下文**：使用 @ 提及、CLAUDE.md 文件等手段
3. **保持怀疑态度**：AI 也会犯错，始终要审查它的输出
4. **循序渐进**：从简单任务开始，逐步让它处理更复杂的工作

### 下一步

继续探索 Claude Code 的可能性：

- 尝试不同的 MCP 服务器来扩展能力
- 为你的团队创建自定义命令
- 实现 hooks 来自动化你的工作流程
- 将 Claude Code 集成到你的 CI/CD 管道中

如果你想让 AI 真正成为你的编程搭档，Claude Code 绝对值得一试。它或许不能完全替代你写代码，但绝对能让你的编程效率提升一个档次。

---

*参考资料：[Claude Code in Action 官方课程](https://anthropic.skilljar.com/claude-code-in-action)*
