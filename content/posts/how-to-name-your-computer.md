---
date: 2026-02-27T16:30:00+08:00
draft: false
title: 如何给你的计算机取个好名字？——来自 1989 年的经典指南
tags:
  - 计算机
  - 命名
  - RFC
  - 经典
categories:
  - 技术杂谈
slug: how-to-name-your-computer
description: 1989 年的 RFC 1178 至今仍是计算机命名的最佳参考。Don Libes 用幽默的笔触总结了哪些名字会让你后悔，以及什么样的命名才经得起时间考验。
---

> "Is up down?" — 当一台名为 "up" 的机器宕机时，这就是你会听到的困惑。

## 前言

最近偶然读到了 Don Libes 在 1989 年写的一篇经典文章 —— **《Choosing a Name for Your Computer》**（后来成为 RFC 1178）。这篇文章以幽默的笔触总结了计算机命名的种种"坑"和建议，三十多年后的今天读来依然让人会心一笑。

如果你曾经给服务器、虚拟机、甚至自己的笔记本电脑取过名字，这篇文章值得一看。

---

## 为什么要给计算机取名？

一旦你拥有不止一台计算机，就需要能够区分它们。

- **人类需要**："嘿 Ken，Goon 宕机了！"
- **计算机需要**：`mail libes@goon`

无论名字如何被解析，选一个"好"名字能避免很多麻烦。

---

## ❌ 这些坑，别踩

Don Libes 列举了许多命名上的"反面教材"，有些真的让人哭笑不得：

### 1. 不要重载通用词汇

> 一台数据库服务器被命名为 `up`，因为它是唯一接受更新的机器。
>
> 于是出现了这样的对话：
>
> **"Is up down?"** —— up 宕机了吗？
>
> **"Boot the machine up."** —— 启动那台机器。
>
> **"Which machine?"** —— 哪台？

这种命名会让日常交流变得像猜谜游戏。

### 2. 不要以该机器独有的项目命名

> 一台机器被命名为 `shop`（车间），因为用于控制车间设备。
>
> 一年后：五台新机器上线，原来的机器被移到不相关的项目。
>
> `shop` 这个名字，还合适吗？

通用名称很难长期保持准确。

### 3. 不要使用自己的名字

> "把磁盘驱动器给 don" —— 这是说给人听，还是说给机器？

更现实的问题是：一年后你换了台机器，别人卡在 "don" 上，你却要用 "jim"。而且，各种配置文件、脚本里写死的名字都要改……

### 4. 不要使用长名字

超过 8 个字符的名字只会让人烦恼。

### 5. 避免替代拼写

> 一台机器叫 `czek`，大家以为叫 `check`。
>
> 一台机器叫 `pythagoris`（拼错了），管理员每次都要查字典才能输入。

故意"卖萌"的错误拼写只会制造混乱。

### 6. 避免域名样式

> 名叫 `tahiti` 的机器，真的在塔希提吗？
>
> 如果在弗吉尼亚，会不会让人以为是 CIA 的塔希提办公室？

地理和组织名称会暗示位置，容易造成误解。

---

## ✅ 好的名字，这样选

Don Libes 给出了一些建议，我觉得很实用：

### 1. 使用少见的词汇

与其叫 `typical` 或 `server`，不如叫：

- `lurch`（突然倾斜）
- `squire`（乡绅）
- `flux`（流动）

### 2. 使用主题命名

这是最有趣的部分！给一组机器用统一的主题命名：

| 主题 | 示例 |
|------|------|
| **颜色** | red, blue, aqua, crimson |
| **神话人物** | zeus, hera, athena, orion |
| **神话地方** | midgard, styx, paradise |
| **元素** | helium, argon, zinc |
| **花卉** | tulip, peony, lilac |

主题命名的优点：
- 易于记忆
- 方便扩展（颜色永远不会用完）
- 有趣且展示品味

### 3. 使用真实单词

随机字符串（如 `x7k2p9`）虽然适合做密码，但作为主机名简直灾难。

---

## 🤔 我的思考

读完这篇文章，我不禁想到：

### 为什么命名如此重要？

名字是我们与世界交互的"接口"。一个好的名字：

- **降低认知负担** —— 不用每次都停下来思考
- **减少沟通成本** —— "红服务器宕机了"比"172.16.1.5宕机了"更直观
- **承载文化** —— 一个好的命名主题可以反映团队的风格

### 命名是"软技能"

技术能力之外，命名体现了：

- 沟通意识（为他人着想）
- 系统思维（考虑扩展性）
- 幽默感（让工作更有趣）

这些"软技能"往往比技术本身更能影响团队效率。

---

## 📝 给你的一些建议

如果你正在为新机器取名，这里有一些建议：

### 个人电脑

可以使用自己喜欢的词汇，比如：

- 自然类：`river`, `forest`, `peak`
- 抽象类：`flux`, `zen`, `spark`
- 科幻类：`hal`, `matrix`, `nexus`

### 多机器环境

使用主题命名系列：

```
# 希腊神话系列
zeus, hera, athena, apollo

# 星球系列
mars, venus, jupiter, saturn

# 太阳系列
sun, moon, star, comet
```

### 企业环境

保持专业，但也可以有趣：

```
# 科学家系列
einstein, newton, darwin, curie

# 探索者系列
columbus, magellan, armstrong
```

---

## 结语

> "By choosing a name wisely, both user and administrator will have an easier time of remembering, discussing and typing the names of their computers."

—— Don Libes, 1989

三十多年过去，计算机的数量从那时的一台、两台，变成了今天的数十亿台。但命名的智慧，依然值得铭记。

**下次给新机器取名时，多花一分钟想想吧。**

---

## 参考资料

- [RFC 1178 - Choosing a Name for Your Computer](https://www.rfc-editor.org/rfc/rfc1178.html)
- Don Libes, "Choosing a Name for Your Computer", *Communications of the ACM*, Vol. 32, No. 11, November 1989.

---

*你的第一台电脑叫什么名字？欢迎在评论区分享！*
