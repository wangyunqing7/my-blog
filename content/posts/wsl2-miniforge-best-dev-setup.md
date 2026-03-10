---
date: 2026-03-06T23:59:00+08:00
draft: false
title: WSL2 + Miniforge：Windows 下的最佳开发方案
tags:
  - WSL
  - Miniforge
  - 开发环境
  - Windows
  - Linux
categories:
  - 技术指南
slug: wsl2-miniforge-best-dev-setup
description: Windows 日常用软件，WSL2 搞开发、跑模型。这篇文章手把手教你搭建 WSL2 + Miniforge 的完美开发环境，包括安装、配置、文件迁移、Miniforge 使用。基于 2025 年最新最佳实践。
---

# WSL2 + Miniforge：Windows 下的最佳开发方案

你平时要用 Windows 软件（微信、QQ、Office、游戏），但开发想要 Linux 环境。

**WSL2 就是答案**：Windows + WSL2 = 开发神器，没有之一。

## 为什么 WSL2 是最优解？

### 你要的，它全给了

```
✅ 继续用 Windows：微信、QQ、浏览器、办公、游戏
✅ 拥有完整 Linux：GCC、CMake、Make、Python、大模型、PyTorch、CUDA
✅ 速度接近原生 Linux：比纯 Windows 快太多
✅ 不用重启：不用双系统、不用虚拟机卡顿
✅ 开个终端就能用
✅ 文件互通：跟 Windows 无缝切换
✅ GPU 支持：CUDA 直通，AI 训练无障碍
```

## 第一步：安装 WSL2

### 检查系统要求

```
Windows 10 版本 2004 或更高（内部版本 19041 或更高）
Windows 11（任何版本）
```

### 一行命令安装

打开 PowerShell（管理员），运行：

```powershell
wsl --install
```

这会自动安装：
- WSL2
- Ubuntu（默认 Linux 发行版，通常是 Ubuntu 24.04 LTS）

安装完会提示重启电脑。

### 重启后首次启动

重启完成后，会自动打开 Ubuntu 终端，让你设置用户名和密码：

```
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: ubuntu
Enter new UNIX password:
Retype new UNIX password:
```

## 第二步：更新 WSL2 和 Ubuntu

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装基础开发工具
sudo apt install -y build-essential cmake git curl wget vim ninja-build

# 安装 Python 基础（虽然 Miniforge 会自带，但装上备用）
sudo apt install -y python3 python3-pip
```

## 第三步：在 WSL2 里安装 Miniforge

### 为什么用 Miniforge？

```
✅ 跨平台：Windows 和 Linux 用法一样
✅ 默认 conda-forge：包最新、最全
✅ 预装 mamba：依赖解析超快（10-100x 于 conda）
✅ 轻量：只装必要的东西，比 Anaconda 小得多
✅ 开源免费：无商业限制
```

### 下载并安装

```bash
# 下载 Miniforge 安装脚本
wget https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh

# 运行安装
bash Miniforge3-Linux-x86_64.sh
```

安装过程：
1. 按回车查看许可协议
2. 输入 `yes` 同意
3. 按回车使用默认安装位置
4. 等待安装完成
5. 输入 `yes` 初始化 conda

### 关闭终端重新打开

安装完成后，关闭终端重新打开，你会看到 `(base)` 前缀，表示 conda 环境已激活。

## 第四步：配置 Miniforge

### 设置 conda-forge 为默认频道

```bash
conda config --add channels conda-forge
conda config --set channel_priority strict
```

### 验证安装

```bash
# 检查 conda 版本
conda --version

# 检查 mamba 是否可用
mamba --version
```

## 第五步：创建你的第一个开发环境

```bash
# 创建 Python 3.12 环境
conda create -n dev python=3.12

# 激活环境
conda activate dev

# 安装常用包
mamba install numpy pandas requests

# 如果需要深度学习
mamba install pytorch torchvision torchaudio
```

## 第六步：文件放置策略（重要！）

### 错误做法：跨 /mnt/ 访问 Windows 文件

```bash
# ❌ 慢！
cd /mnt/c/Users/Yunqing72/Documents/code
```

跨 /mnt/ 读 Windows 文件 = 巨慢！

**原因：**
```
Windows 文件系统 → NTFS
WSL2 里面 → ext4
互相访问要格式转换 + 权限模拟 + 内核来回切换
IO 速度可能只有原生的 10% ~ 20%
```

### 正确做法：放在 WSL2 内部

```
/home/你的用户名/
```

比如：

```
/home/ubuntu/
├── projects/       # 代码放这里
├── models/         # 权重、bin、safetensors 放这里
├── datasets/       # 数据集放这里
└── envs/           # 虚拟环境配置
```

**放在这里，速度 = 原生 Linux，满速！**

### 怎么从 Windows 把文件拷进 WSL2？

**最简单方法：**

1. 在 Windows 文件夹地址栏输入：
   ```
   \\wsl$
   ```

2. 找到你的 Ubuntu → 进入 home/你的用户名 → 直接粘贴

这是最快的文件互传方式，比复制到 /mnt/d 快几倍。

### 终极目录结构建议

```
/home/ubuntu/
├── projects/              # 所有项目
│   ├── cpp/               # C++ 项目
│   ├── python/            # Python 项目
│   └── ml/                # 机器学习项目
├── models/                # 模型权重
│   ├── llms/              # 大语言模型
│   └── checkpoints/       # 训练检查点
├── datasets/              # 数据集
├── tools/                 # 工具脚本
└── miniforge3/            # Miniforge 安装位置
```

## 第七步：从 Windows 迁移环境到 WSL

### 在 Windows 导出环境

```cmd
# Windows PowerShell 或 CMD
conda activate 你的环境名
conda env export > environment.yml
```

会在当前目录生成一个 `environment.yml` 文件。

### 在 WSL 重建环境

```bash
# 进入存放 environment.yml 的目录
cd /mnt/d/你的文件夹

# 重建环境
conda env create -f environment.yml

# 激活环境
conda activate 你的环境名
```

**完成！** 你在 Windows 里装的所有包（PyTorch、Transformers、数据集、模型工具）全部在 WSL 里自动装好。

## 速度对比：WSL2 真的更快

### 相同任务的时间对比

| 任务 | 纯 Windows | WSL2 | 提升 |
|------|-----------|------|------|
| 编译 C++ 项目 | 60s | 40s | **快 33%** |
| 跑 PyTorch 训练 | 100s | 70s | **快 30%** |
| 大模型推理 | 50s | 30s | **快 40%** |
| Git 克隆大仓库 | 30s | 15s | **快 50%** |
| Docker 构建镜像 | 120s | 80s | **快 33%** |

**数据来源：[Making Windows Disappear - WSL2 性能测试](https://medium.com/%40faranheit/making-windows-disappear-a-linux-developers-guide-to-a-production-grade-wsl2-setup-ae43473e12e8)**

## 常用命令速查

### WSL 命令

```bash
# 从 Windows 打开 WSL
wsl

# 从 WSL 回到 Windows
exit

# 关闭 WSL
wsl --shutdown

# 查看运行中的 WSL
wsl --list --running

# 以特定用户运行
wsl -u ubuntu
```

### Miniforge 命令

```bash
# 创建环境
conda create -n 环境名 python=3.12

# 激活环境
conda activate 环境名

# 退出环境
conda deactivate

# 安装包（推荐用 mamba，更快）
mamba install 包名

# 更新 conda
conda update conda

# 导出环境
conda env export > environment.yml

# 从环境文件创建
conda env create -f environment.yml

# 列出所有环境
conda env list

# 删除环境
conda remove -n 环境名 --all

# 清理未使用的包
conda clean --all
```

## 高级配置（可选）

### 启用 systemd（推荐）

```bash
# 允许 WSL2 使用 systemd
echo "[boot]
systemd=true" | sudo tee -a /etc/wsl.conf

# 重启 WSL
wsl --terminate
wsl
```

### 设置 Windows 访问 WSL 文件

在 Windows 文件资源管理器地址栏输入：
```
\\wsl.localhost\Ubuntu\home\ubuntu\projects
```

可以创建快捷方式，方便访问。

## 总结

### 你的最佳开发路线

```
日常用 Windows
    +
开发用 WSL2
    +
Miniforge 管理环境
    +
文件放在 /home/用户名/
```

### 这 5 句就够了

```
1. WSL2 = Windows 里的完整 Linux
2. Miniforge 跨平台，Windows/Linux 用法一样
3. 文件放在 /home/用户名/，不要放 /mnt/
4. Windows 通过 \\wsl\ 访问 WSL 文件最快
5. 跑得更快、更接近真实部署环境
```

### 为什么这是标准标配？

```
2025 年后端、C++、AI 开发者的标配：
→ Windows 日常使用
→ WSL2 开发环境
→ Miniforge 环境管理

→ 完美兼顾！
```

---

## 参考资料

- [Best Python Setup – WSL and Miniforge Tutorial](https://pythonchan.com/?p=15021) - WSL + Miniforge 入门教程
- [Making Windows Disappear: A Linux Developer's Guide to WSL2](https://medium.com/%40faranheit/making-windows-disappear-a-linux-developers-guide-to-a-production-grade-wsl2-setup-ae43473e12e8) - 生产级 WSL2 配置
- [How to Set Up a Conda Environment for WSL/Linux](https://zenn.dev/atoy0m0/articles/b9c9b9440bd7aa) - WSL Conda 环境配置
- [Install on Windows 10 with WSL2](https://mhm-ufz.org/guides/install-win/) - WSL2 安装官方指南
- [Best Python Setup – WSL and Miniforge Tutorial](https://www.linkedin.com/posts/mariyasha888_python-wsl-miniforge-activity-7327728694846717952-BpFM) - LinkedIn 专业教程
