---
date: 2026-04-06T15:00:00+08:00
draft: false
title: "Linux 查询硬件信息：9 个命令带你透视你的电脑"
tags:
  - Linux
  - 命令行
  - 硬件
categories:
  - Linux
comments: true
author: "王云卿"
slug: linux-hardware-info-9-commands
description: "不用装任何软件，9 个 Linux 自带命令就能把你的 CPU、内存、硬盘、显卡、网络全部查清楚。"
---

你有没有过这样的时刻——别人问你"你电脑什么配置"，你愣了一下，然后默默打开系统设置翻了半天？

或者你想装个软件，它写着"至少需要 8GB 内存"，你不确定自己够不够？

又或者你刚买了一台云服务器，想搞清楚商家到底给你分配了什么硬件？

在 Windows 上，你可以用"设备管理器"或"任务管理器"点几下鼠标搞定。但在 Linux 上，没有那些花花绿绿的窗口，你得靠**命令**。

别怕。这些命令不需要你懂编程，每个都是一行文字，敲进去、回车，结果就出来了。

下面这 9 个命令，涵盖了系统、CPU、内存、硬盘、显卡、网络、实时监控——基本上你关心的硬件信息，它们全包了。

---

## 先从全局开始：我的电脑到底是什么？

### `uname -a` —— 系统的身份证

这是最基础也最快速的一个命令。它会告诉你：内核名称、主机名、内核版本、系统架构、操作系统。

```bash
uname -a
```

输出大概是这个样子：

```
Linux myserver 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux
```

这些信息乍一看像天书，但其实拆开来很简单：

- **Linux** —— 内核名称，说明你跑的是 Linux 系统
- **myserver** —— 这台机器的主机名
- **5.15.0-91-generic** —— 内核版本号，就像软件的版本号一样
- **x86_64** —— 系统架构，说明你的是 64 位系统
- **GNU/Linux** —— 完整的操作系统描述

**什么时候用？** 当你需要确认"这台机器跑的是什么系统、什么版本"的时候，比如安装驱动、排查兼容性问题，别人第一句话通常就是"先跑个 `uname -a` 看看"。

### `hostnamectl` —— 系统的户口本

如果你觉得 `uname -a` 的输出太技术化了，`hostnamectl` 会让你舒服很多。它的输出更像是一份"人类可读"的系统档案：

```bash
hostnamectl
```

```
   Static hostname: myserver
         Icon name: computer-vm
           Chassis: vm
        Machine ID: abc123...
           Boot ID: def456...
    Virtualization: kvm
  Operating System: Ubuntu 22.04.3 LTS
            Kernel: Linux 5.15.0-91-generic
      Architecture: x86_64
```

这里你能一眼看出几件重要的事：

- **Operating System** —— 具体是什么发行版（Ubuntu、CentOS、Debian……）
- **Virtualization** —— 这台机器是物理机还是虚拟机（kvm、vmware、wsl 都会在这里显示）
- **Chassis** —— 机器类型（desktop 台式机、laptop 笔记本、vm 虚拟机）

**什么时候用？** 刚登录一台陌生的服务器，先敲这个，30 秒内了解全局。

---

## 看看 CPU：你的大脑几核几线程？

### `lscpu` —— CPU 的详细简历

CPU 是电脑的大脑，`lscpu` 会把它的一切都告诉你：

```bash
lscpu
```

```
Architecture:          x86_64
CPU(s):                4
Thread(s) per core:    2
Core(s) per socket:    2
Model name:            Intel(R) Core(TM) i5-4210U CPU @ 1.70GHz
CPU MHz:               768.000
L3 cache:              3072K
```

关键信息解读：

- **CPU(s): 4** —— 系统识别到 4 个逻辑 CPU（4 个线程）
- **Core(s) per socket: 2** —— 实际物理核心只有 2 个
- **Thread(s) per core: 2** —— 每个核心 2 个线程（这就是 Intel 的超线程技术）
- **Model name** —— CPU 型号，决定性能天花板
- **CPU MHz** —— 当前实际运行的频率

这里有个容易混淆的地方：**4 个 CPU ≠ 4 个物理核心**。上面这个例子实际上是 2 核心 4 线程，物理核心只有两个，但每个核心能同时处理两个线程，所以操作系统"看到"4 个 CPU。

打个比方：2 个厨师，每人有 2 只手，看起来像 4 个人在干活。

**什么时候用？** 编译代码、跑虚拟机、部署数据库之前，先看看 CPU 够不够用。

---

## 内存够不够用？

### `free -h` —— 一眼看清内存使用情况

内存（RAM）决定了你的系统能同时处理多少事情。`free -h` 的输出非常直观：

```bash
free -h
```

```
              total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.1Gi       3.5Gi       128Mi       2.1Gi       5.2Gi
Swap:          8.0Gi          0B       8.0Gi
```

这里最需要关注的就两行：

- **Mem 那一行**：物理内存的情况
- **Swap 那一行**：交换空间（相当于内存不够时借用的硬盘空间）

很多人看到 `free` 很小、`used` 很大就慌了，觉得内存快用完了。其实不用慌，关键看 **available** 这一列——它才是系统真正还能用的内存。Linux 会把空闲内存拿去做缓存（buff/cache），加速系统运行，但这些内存随时可以回收。

所以在这个例子里：总共 7.7G，看起来只"剩" 5.2G 可用，其实完全不用担心。

`-h` 这个参数的意思是"human-readable"（人类可读），把字节数自动换算成 KB、MB、GB。没有它你会看到一堆裸数字，比如 `8091236` 而不是 `7.7Gi`。

**什么时候用？** 程序跑起来卡了、报内存错误了，或者部署新服务之前评估剩余空间。

---

## 硬盘还剩多少空间？

### `df -h` —— 磁盘空间的仪表盘

```bash
df -h
```

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda2       328G   16G  298G   6% /
/dev/vda1       511M  6.2M  505M   2% /boot/efi
```

每一行代表一个分区（或者叫"挂载点"），关键看这些：

- **Size** —— 总大小
- **Used** —— 已用
- **Avail** —— 还剩多少
- **Use%** —— 使用百分比
- **Mounted on** —— 挂载路径（`/` 是根目录，`/boot/efi` 是启动分区）

一个实用的小经验：**当 Use% 超过 85%，你就该注意了**；超过 95%，系统可能会出问题，因为很多程序需要临时写文件才能正常工作。

`df` 的名字来自 "disk free"（磁盘剩余空间）。它只显示已挂载的文件系统——如果一块硬盘插上了但没有挂载，`df` 是看不到的。

**什么时候用？** 系统报 "No space left on device" 错误、定时检查服务器健康状态、上传大文件之前。

---

## 显卡什么情况？

### `nvidia-smi` —— NVIDIA 显卡的监控台

如果你有 NVIDIA 显卡（大多数 AI 开发者、游戏玩家、挖矿的人都用），这个命令就是你的好朋友：

```bash
nvidia-smi
```

它会输出一个相当漂亮的表格，包含：

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.85.05    Driver Version: 525.85.05    CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  On   | 00000000:01:00.0  On |                  N/A |
| 45%   62C    P0    55W / 170W |    512MiB /  8192MiB |     12%      Default |
+-------------------------------+----------------------+----------------------+
```

关键信息：

- **GPU Name** —— 显卡型号
- **Driver Version** —— 驱动版本
- **CUDA Version** —— 支持的 CUDA 版本（跑 AI 模型一定要看这个）
- **Temp** —— 显卡温度（长期超过 85°C 要小心）
- **Memory-Usage** —— 显存使用情况（512MiB / 8192MiB = 用了 512M，总共 8G）
- **GPU-Util** —— GPU 利用率（12% 说明基本在摸鱼）

如果你用的是 AMD 显卡或者没有独立显卡，这个命令会报错，那没关系，你可以用 `lspci | grep -i vga` 来查看基本显卡信息。

**什么时候用？** 跑 AI 模型训练、挖矿、玩游戏之前；排查显卡驱动问题；监控训练过程中的显存占用。

---

## 网络连上了没？

### `ip link` —— 网络接口一览

```bash
ip link
```

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT
    link/ether 56:00:05:ba:75:dd brd ff:ff:ff:ff:ff:ff
```

你会看到每个网络接口的信息：

- **lo** —— 回环接口（loopback），指向自己（127.0.0.1），每个系统都有，不用管它
- **eth0** —— 这才是真正的网卡（有些系统叫 `ens33`、`enp0s3` 等名字，原理一样）
- **state UP** —— 网卡已启用且连接正常
- **state DOWN** —— 网卡没启用或没插网线

`ip` 命令是现代 Linux 的网络管理工具，用来替代老旧的 `ifconfig`。`link` 子命令只显示链路层信息（网卡状态、MAC 地址），不涉及 IP 地址。想看 IP 地址的话，用 `ip addr`。

**什么时候用？** 网络连不上、配置网卡、排查网络故障。

---

## 一键看全貌：所有硬件总览

### `lshw -short` —— 硬件的完整清单

前面每个命令各管一块，如果你想要一份完整的硬件清单，`lshw -short` 一次搞定：

```bash
sudo lshw -short
```

```
H/W path       Device      Class          Description
=====================================================
                           system         20354 (LENOVO)
/0                         bus            Lancer 5A5
/0/0                       memory         128KiB BIOS
/0/4                       processor      Intel(R) Core(TM) i5-4210U CPU @ 1.70GHz
/0/12                      memory         8GiB System Memory
/0/100/2                   display        Haswell-ULT Integrated Graphics Controller
/0/100/3                   multimedia     Haswell-ULT HD Audio Controller
/1                         bus            Realtek RTS5129 Card Reader Controller
```

这就像拿到了一张电脑的"配件清单"——CPU 什么型号、内存多大、显卡是什么、声卡是什么，一目了然。

注意这个命令需要 `sudo`（管理员权限），因为它要读取底层的硬件信息。如果不加 `sudo`，部分信息可能显示不全。

`lshw` 的名字来自 "list hardware"（列出硬件）。它不加 `-short` 时会输出极其详细的信息（多到可以滚动好几屏），加上 `-short` 就是精简版，适合快速浏览。

**什么时候用？** 你想快速了解一台机器的全部硬件配置，或者给技术支持提供硬件信息。

---

## 系统正在干什么？

### `top` —— 实时监控台

前面那些命令都是"拍一张照片"，给你看某一时刻的硬件信息。而 `top` 是"直播"——它实时刷新，让你看到系统此刻正在干什么：

```bash
top
```

```
top - 15:30:01 up 42 days,  3:21,  2 users,  load average: 0.52, 0.38, 0.29
Tasks: 156 total,   2 running, 154 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.2 us,  1.3 sy,  0.0 ni, 93.1 id,  0.2 wa,  0.0 hi,  0.2 si
MiB Mem :   7879.9 total,    3122.0 free,   3122.0 used,   1635.9 buff/cache
MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.   4557.9 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 mysql     20   0  1256724 285620  19876 S  12.5   3.5   1234:56 mysqld
 5678 www-data  20   0   456788  98760  12345 S   5.3   1.2    456:78 nginx
 9012 root      20   0        0      0      0 I   2.1   0.0     12:34 kworker/0:1
```

上半部分是系统概况，下半部分是按 CPU 使用率排序的进程列表。

重点关注：

- **load average** —— 系统负载，三个数字分别是过去 1 分钟、5 分钟、15 分钟的平均值。简单理解：数值小于你的 CPU 核心数就正常（4 核 CPU，负载 3 以下没问题）
- **%Cpu(s)** —— CPU 使用率分布，`id`（idle）是空闲百分比，93.1% id 说明 CPU 基本在休息
- **%MEM** —— 进程占用的内存比例
- **COMMAND** —— 进程名，帮你定位是哪个程序在吃资源

退出 `top` 按 `q` 键。

**什么时候用？** 服务器变慢了、风扇突然转得飞快、想看看哪个进程在捣乱。

---

## 速查表

把 9 个命令放在一起，方便你以后查阅：

| 命令 | 查什么 | 需要 root 权限？ |
|------|--------|:---:|
| `uname -a` | 内核版本、系统架构 | 否 |
| `hostnamectl` | 操作系统、主机名、是否虚拟机 | 否 |
| `lscpu` | CPU 型号、核心数、线程数 | 否 |
| `free -h` | 内存总量、已用、可用 | 否 |
| `df -h` | 磁盘分区、使用率 | 否 |
| `nvidia-smi` | NVIDIA 显卡信息、显存、温度 | 否 |
| `ip link` | 网卡状态、MAC 地址 | 否 |
| `lshw -short` | 全部硬件总览 | 是（建议加 sudo） |
| `top` | 实时 CPU、内存、进程监控 | 否 |

每个命令都可以加 `--help` 查看更多参数，比如 `free --help`、`lscpu --help`。

---

## 参考资料

- [11 Commands to Collect System and Hardware Info in Linux - TecMint](https://www.tecmint.com/commands-to-collect-system-and-hardware-information-in-linux/)
- [How to Generate System Hardware Report in Linux - Vultr Docs](https://docs.vultr.com/how-to-generate-system-hardware-report-in-linux)
- [Find Out System Hardware Info From the Linux Command Line - Baeldung](https://www.baeldung.com/linux/cli-hardware-info)
- [Displaying Full GPU Details With nvidia-smi - Baeldung](https://www.baeldung.com/linux/nvidia-smi-full-gpu-details)
