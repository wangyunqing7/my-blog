---
date: 2026-04-16T20:00:00+08:00
draft: false
title: 为什么只会写 Prompt 已经不够了：Prompt、Context 与 Harness Engineering 讲透
tags:
  - AI
  - PromptEngineering
  - ContextEngineering
  - HarnessEngineering
  - AIAgent
categories:
  - 技术
comments: true
author: 王云卿
slug: prompt-context-harness-engineering
description: 当 AI 从一次性问答变成会用工具、会长期执行任务的 Agent，真正决定效果的已经不只是 Prompt，而是 Prompt、Context 与 Harness 这三层工程。
---

# 为什么只会写 Prompt 已经不够了

过去几年，大家最熟悉的词是 `prompt engineering`。

这很好理解。大模型刚流行的时候，很多任务都还是“一问一答”式的：你写一句提示词，模型回你一段结果。于是大家自然会把注意力放在一个问题上：**这句话到底该怎么写，模型才更听话？**

但一旦 AI 从聊天玩具变成真正干活的系统，事情就开始变了。

比如你不再只是让它“解释一个概念”，而是让它：

- 读代码库
- 查文档
- 调工具
- 记住前面做过什么
- 连续工作几十分钟甚至几小时

这时候，如果效果不好，问题往往已经不只是“提示词写得不够好”。更常见的情况是：**给错了信息，或者系统壳子搭得不对。**

这正是 `prompt engineering`、`context engineering`、`harness engineering` 这三个概念出现的背景。

如果只用一句话概括它们的区别，可以这样记：

- `Prompt engineering`：研究“你怎么对模型说话”
- `Context engineering`：研究“模型在这一轮到底看到了什么”
- `Harness engineering`：研究“模型外面的运行系统怎样驱动它持续完成任务”

很多人第一次看到这三个词，会觉得它们像是换汤不换药的同义词。其实不是。它们对应的是三层完全不同的工程问题。

## 01. 先把 AI 想成一个超级聪明但会失忆的实习生

理解这三个概念，最简单的方法，是先把大模型想成一个能力极强、但工作方式很特别的实习生。

他有几个鲜明特点。

第一，他很聪明，读过海量资料，推理和表达能力都不错。

第二，他没有真正稳定的长期记忆。你不给他信息，他就不知道；你这轮给了，下轮不一定还能完整保留。

第三，他能不能干成事，不只取决于你说得清不清楚，还取决于三件事：

- 你到底给他下了什么任务
- 你把哪些资料和现场信息摆在了他面前
- 你有没有给他工具、流程、检查点和工作台

这三件事，分别就对应今天要讲的三个层次。

## 02. Prompt Engineering：你怎么给他下指令

`Prompt engineering` 是最早被广泛讨论的概念。Anthropic 在官方文档里把它描述为：为了获得更好的结果，去设计和组织给模型的指令。

说白了，它解决的是：**一句话怎么写，一段提示怎么组织，模型才更容易给出你要的输出。**

这一层最常见的工作包括：

- 设定角色，比如“你是一位资深律师”或“你是一位代码审查专家”
- 明确任务，比如“总结”“比较”“修复”“改写”
- 指定输出格式，比如表格、JSON、Markdown、固定字段
- 加约束条件，比如长度限制、语气限制、禁止编造
- 提供 few-shot 示例，让模型照着范例做

如果把模型当作一个实习生，`prompt engineering` 做的事就是：**把任务交代清楚。**

比如同样是让 AI 写文章，下面这两种写法的效果往往完全不同。

```text
差的写法：
帮我写一篇文章。

更好的写法：
请写一篇面向完全小白的科普文章，主题是“为什么只会写 Prompt 已经不够了”。
文章需要解释 Prompt Engineering、Context Engineering、Harness Engineering 的区别。
风格要通俗、自然，避免空泛术语，并给出一个 AI 编码助手的具体例子。
```

你会发现，第二种写法并没有使用什么神秘技巧，它只是更清楚。

这也是官方文档里反复强调的一件事：**清晰、直接、具体的指令，往往比花哨的“咒语式提示词”更有效。**

不过，`prompt engineering` 有一个天然边界：它只能解决“指令表达”的问题。

如果你让 AI 修一个 bug，但没有给它错误日志、相关文件、测试结果，那么 prompt 写得再漂亮，它也只能猜。

这时问题就不再是 prompt 了，而是 context。

## 03. Context Engineering：模型到底看到了什么

这几年，越来越多人开始强调 `context engineering`。Anthropic 在工程文章里甚至直接说，这是 `prompt engineering` 的自然延伸。

为什么？因为在真实系统里，模型“看到的东西”远远不止一段 prompt。

Anthropic 对 `context` 的定义很直接：**在一次推理时，被放进模型上下文窗口里的那一整组 token。**

注意这里的关键词：**一整组**。

它通常包括：

- system prompt
- 用户当前提问
- 历史对话
- few-shot 示例
- 工具描述
- 工具调用返回结果
- 检索出来的文档片段
- 外部记忆或状态摘要

换句话说，`prompt` 只是 `context` 的一部分，而不是全部。

所以 `context engineering` 真正研究的问题，不是“提示词怎么写”，而是：**在这一轮推理里，到底该把哪些信息放进去，哪些不该放进去，顺序怎么排，什么时候补充，什么时候压缩。**

这听起来像细节，其实往往决定成败。

### 为什么 context 比以前重要得多

因为今天很多 AI 应用已经不是单轮问答，而是多轮、长链路、会调用工具的 Agent。

在这种场景里，模型会不断产生新信息：读到的文件、搜到的资料、工具结果、历史操作记录、临时结论、下一步计划。理论上，这些信息都“可能有用”；但如果你不加选择地全部塞进去，模型反而更容易失焦。

Anthropic 在 `Context windows` 和 `Effective context engineering for AI agents` 两篇资料里反复强调一个现象：**上下文不是越多越好。**

原因很简单。上下文窗口虽然越来越大，但模型的注意力仍然是稀缺资源。随着 token 越来越多，信息召回和推理精度会下降，这就是很多人提到的 `context rot`。

所以好的 `context engineering`，目标不是“拼命多喂资料”，而是：**用尽量少、但信号尽量高的信息，最大化模型做对事的概率。**

### 一个简单例子

假设你在做一个 AI 编码助手，用户说：“帮我修一下登录失败的问题。”

如果只看 `prompt engineering`，你可能会把提示词润色成：

```text
你是一位资深后端工程师。请定位并修复登录失败问题，修改代码后运行测试并汇报结果。
```

这当然比一句“修一下 bug”更好，但还是不够。

真正决定效果的，往往是你给模型注入了什么上下文：

- 最近一次报错栈
- 登录接口相关文件
- 身份验证模块的测试
- 最近一次涉及登录逻辑的 commit
- 线上环境和本地环境的差异说明

如果上下文选得准，模型很快就能收敛到问题核心。

如果上下文选得乱，它可能会在无关文件里兜圈子，或者根据陈旧信息做出错误判断。

### Context Engineering 常见工作

在工程实践里，这一层通常包括：

- 做检索，把真正相关的文档片段拉进来
- 控制历史对话，不让无关旧信息污染当前任务
- 设计记忆和摘要，让长任务能跨窗口继续
- 安排信息顺序，让关键材料先出现
- 裁剪工具返回值，避免把海量噪音直接塞给模型

这也是为什么很多团队后来发现：**他们以为自己在做 prompt 优化，实际上是在做 context 优化。**

## 04. Harness Engineering：模型外面的那层“工作系统”

如果说前两个概念已经相对稳定，那么 `harness engineering` 还没有那么统一的学术定义。但在 Agent 和 LLM 应用工程里，它是一个非常实用的词。

你可以把 `harness` 理解成：**套在模型外面的执行框架，或者说工作系统。**

OpenAI 在 Agents SDK 文档里描述过这样一层能力边界：当你的应用自己负责 `orchestration`、`tool execution`、`state`、`approvals` 时，你已经不再只是“调用一个模型”，而是在构建一个 agent runtime。Anthropic 的工程文章则更直接，直接讨论 `agent harness`，也就是让 Agent 能跨多个 context window 连续工作的外壳设计。

所以 `harness engineering` 关注的是这些问题：

- 模型能调用哪些工具
- 工具怎么定义，什么时候调用，结果怎么回传
- 一次任务是单步完成还是循环执行
- 长任务如何 checkpoint，如何压缩上下文，如何续跑
- 什么操作需要审批，什么错误需要重试
- 多个子 Agent 怎么分工，如何汇总结果
- 怎样做日志、评估、监控和失败恢复

如果继续沿用“实习生”的比喻：

- `prompt engineering` 是你怎么交代任务
- `context engineering` 是你把哪些资料摊在他桌上
- `harness engineering` 是你有没有给他电脑、终端、文档系统、测试环境、任务单、交接制度和审批流程

没有这一层，模型再聪明，也很难稳定完成复杂任务。

### Anthropic 给了一个很典型的例子

在 `Effective harnesses for long-running agents` 里，Anthropic 讨论了长时间运行的编码 Agent 应该怎么设计外壳。

他们发现，光靠“让模型一直干活”并不够，因为任务一旦跨越多个 context window，新的会话就像换了一个刚接班的人。如果没有交接材料，它很容易：

- 一上来试图一口气做完整个项目
- 在半路把代码留在半成品状态
- 后面的会话看不懂前面做了什么
- 明明还有很多 feature 没完成，却误以为任务已经结束

于是他们给出了一套明显属于 `harness engineering` 的方案：

- 用一个初始化 Agent 搭好环境
- 写 `init.sh` 之类的脚本，保证后续会话能快速启动
- 用 `progress` 文件记录进度
- 用结构化的 feature 列表标记哪些功能还没完成
- 用 git commit 和日志帮助后续会话快速“接班”

你会发现，这些设计已经远远超出了“怎么写提示词”的范围。

## 05. 三者到底是什么关系

理解它们最重要的一点，是看见它们之间的层级关系。

`Prompt engineering` 不是孤立存在的，它是 `context engineering` 的一部分；而 `context engineering` 又通常运行在某个 `harness` 之中。

也就是说，它们不是并列的三块砖，更像是三层结构。

| 层次 | 核心问题 | 典型工作 |
| --- | --- | --- |
| Prompt engineering | 话怎么说 | 角色、任务、约束、格式、示例 |
| Context engineering | 给模型看什么 | 检索、裁剪、排序、摘要、记忆、历史管理 |
| Harness engineering | 整个系统怎么驱动模型工作 | 工具调用、状态管理、循环执行、审批、重试、监控、多 Agent 协作 |

如果再压缩成最短的三个句子：

- `Prompt` 决定“表达”
- `Context` 决定“信息”
- `Harness` 决定“执行”

## 06. 为什么很多人会把问题看错

在实际工作里，这三层最容易被混淆。

最常见的误判有四种。

### 第一种：把一切问题都归因于 Prompt

AI 效果不好，很多人的第一反应是“提示词还得再改改”。

当然，有时候确实如此。但如果失败的根源是没有提供关键背景、检索片段不相关、历史消息污染当前任务，那么你再怎么雕 prompt，也只是拿更漂亮的话去包装错误输入。

### 第二种：以为上下文越多越好

不少人刚接触 Agent 时，会有一种直觉：既然不确定什么有用，那就全塞进去。

问题是，模型不是无损数据库。上下文一旦变得冗长、嘈杂、前后矛盾，它的注意力就会被稀释。很多“模型突然变笨了”的时刻，本质上不是模型变差了，而是上下文设计出了问题。

### 第三种：把 Harness 当成“只是工程细节”

这也是常见误区。很多人会觉得，模型能力才是核心，工具、流程、状态管理只是外围实现。

但真正做过 Agent 系统的人很快就会发现：**外围系统不是配角，而是能力放大器。**

同一个模型，放进不同的 harness 里，表现可能天差地别。有没有好的工具定义、有没有合理的重试与检查点、能不能跨窗口续跑、会不会在高风险操作前停下来确认，这些都会直接决定系统可用性。

### 第四种：把 Harness 设计得过度复杂

这点同样重要。

Anthropic 在 `Building effective agents` 里强调过一个经验：最成功的系统往往不是靠复杂框架取胜，而是靠简单、可组合、可调试的模式取胜。

所以 `harness engineering` 并不等于“堆很多 Agent、堆很多图、堆很多状态机”。它真正关心的是：**为了完成当前任务，最小但足够的运行框架是什么。**

## 07. 放到一个真实场景里，你就更容易分清楚了

我们就用一个最典型的例子：做一个 AI 编码 Agent。

用户说：“根据这个报错修复 bug，改完后跑测试，如果通过就提交代码。”

这一句话背后，其实有三层工作同时在发生。

### 第一层：Prompt Engineering

你要告诉模型：

- 先理解报错，再定位根因
- 只做必要修改，不要顺手大改架构
- 改完运行相关测试
- 最终用清晰格式汇报结果

这是在定义它该如何思考和输出。

### 第二层：Context Engineering

你要决定注入哪些信息：

- 错误日志
- 相关源码文件
- 测试文件
- 最近相关的 commit diff
- 项目里的编码规范

这是在决定它基于什么事实做判断。

### 第三层：Harness Engineering

你还要在系统层面决定：

- 它能否读取文件
- 能否编辑文件
- 能否运行测试命令
- 测试失败后是否允许继续迭代
- 提交代码前是否需要人工确认
- 长任务是否会自动压缩上下文
- 如果一次任务拆成多个子任务，谁来协调

这是在决定它究竟能不能把事闭环做完。

到这里，三者的边界就非常清楚了。

## 08. 什么时候该重点优化哪一层

不是所有任务都要三层一起重度投入。

很多时候，任务复杂度决定了你的优化重点。

### 如果是简单的一次性任务

比如改写一段文案、翻译一封邮件、总结一篇文章。

这时重点通常还是 `prompt engineering`。只要任务说清楚，模型通常就能完成得不错。

### 如果是基于资料的复杂问答

比如让模型读几十篇文档后回答问题，或者结合代码库回答架构问题。

这时重点会转向 `context engineering`。比起反复打磨 prompt，更重要的是检索质量、材料排序、上下文裁剪和摘要策略。

### 如果是长链路、可执行的 Agent

比如自动修 bug、处理工单、做研究、操作浏览器、跨多个回合完成任务。

这时真正决定上限的，往往是 `harness engineering`。因为模型不只是“回答”，而是在一个系统里持续工作。

可以粗略地记成这样：

- 小任务，先看 `prompt`
- 中等复杂任务，重点看 `context`
- 生产级 Agent，成败常常在 `harness`

## 09. 最后，用一句最容易记住的话收尾

如果你以后再听到这三个词，可以把它们翻译成下面这三句话。

- `Prompt engineering`：我该怎么对 AI 说，AI 才听得明白？
- `Context engineering`：我该让 AI 看到哪些信息，AI 才判断得正确？
- `Harness engineering`：我该搭一个怎样的系统，AI 才能持续、可靠地把事情做完？

这也是为什么今天只会写 prompt，已经不够了。

当 AI 只是一个聊天框时，提示词确实是主角。

但当 AI 变成真正参与工作流的 Agent 时，真正的工程问题会逐层展开：先是怎么说，再是给什么信息，最后是整个系统怎么运转。

谁先看清这一点，谁就更容易做出真正可用的 AI 产品。

## 参考资料

- [Anthropic: Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic: Prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: Agents SDK](https://platform.openai.com/api/docs/guides/agents)
