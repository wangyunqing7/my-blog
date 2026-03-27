---
date: 2026-03-06T21:30:00+08:00
draft: false
title: CMake、make、GCC 是什么关系？从代码到 exe 的完整流程
tags:
  - CMake
  - make
  - GCC
  - 编译原理
  - 构建工具
categories:
  - 技术指南
slug: cmake-make-gcc-relationship
description: 你知道 CMake 生成 Makefile，make 调用编译器，GCC 真正编译代码。但它们到底怎么协作？这篇文章用最直白的方式，从代码到 exe 的完整流程讲清楚。
comments: true
---

# CMake、make、GCC 是什么关系？

你可能在 Qt Creator 里见过 CMake，在 Linux 教程里见过 make，在安装说明里见过 GCC。

它们到底是什么关系？

一句话：
```
CMake 生成构建文件，make 执行构建，GCC 真正编译代码
```

## 先看关系图

```
你写代码 (main.cpp)
      ↓
CMake 读取 CMakeLists.txt
      ↓
生成 Makefile（或其他构建文件）
      ↓
make 读取 Makefile
      ↓
调用 GCC/编译器
      ↓
生成 exe
```

## 一句话分清三者

| 工具 | 角色 | 一句话 |
|------|------|--------|
| **CMake** | 元构建系统 | 生成 Makefile 的跨平台工具 |
| **make** | 构建工具 | 读取 Makefile，调用编译器 |
| **GCC** | 编译器 | 把代码变成机器码 |

## 用最土的比喻

```
CMake = 写菜谱的人
Makefile = 菜谱
make = 按菜谱做菜的厨师
编译器 (GCC) = 火和锅
```

## 详细区别

### 1. CMake 是干嘛的？

**跨平台元构建系统**

> CMake 不是编译器，不是构建工具 —— 它是生成构建系统的工具。

- **输入**：CMakeLists.txt
- **输出**：Makefile、Ninja build.ninja、Visual Studio 解决方案等
- **特点**：不直接编译代码，只生成平台相关的构建文件

```cmake
# CMakeLists.txt 示例
cmake_minimum_required(VERSION 3.16)
project(MyApp)

add_executable(myapp main.cpp utils.cpp)
```

CMake 读取这个文件，根据平台生成对应的构建文件。

### CMake 的核心价值

| 问题 | 直接写 Makefile | 用 CMake |
|------|----------------|----------|
| **跨平台** | 每个平台写一份 | CMakeLists.txt 通用 |
| **复杂依赖** | 手写很痛苦 | CMake 自动处理 |
| **可读性** | Makefile 语法晦涩 | CMake 更直观 |
| **IDE 支持** | 需手动配置 | 自动生成 IDE 项目文件 |

### Out-of-Source Builds（重要）

CMake 推荐**源外构建**（Out-of-Source Build）：

```bash
# 创建独立构建目录
mkdir build
cd build

# 从构建目录运行 CMake
cmake ..
```

**好处**：
- 构建产物不污染源代码目录
- 可以创建多个构建目录（Debug、Release、不同编译器）
- 清理构建只需删除 build 目录

### 2. make 是干嘛的？

**构建执行工具**

- 只认 Makefile
- 解析依赖关系
- 调用编译器（g++/clang/MSVC）
- 只重新编译修改过的文件（增量构建）

```bash
# 运行 make
make
# make 会读取 Makefile，执行编译命令

# 清理构建产物
make clean
```

### make 的核心机制

```
Makefile 规则格式：
target: prerequisites
	command

例如：
main.o: main.cpp header.h
	g++ -c main.cpp -o main.o
```

含义：要构建 `main.o`，需要 `main.cpp` 和 `header.h`，然后执行 `g++` 命令。

### 3. GCC 是什么？

**GNU Compiler Collection（GNU 编译器套装）**

- **gcc**：编译 C 语言
- **g++**：编译 C++（Qt 用的就是这个）
- 支持多种架构：x86、ARM、RISC-V 等

### GCC 编译过程

```
源文件 (.cpp)
    ↓
预处理 (.i) - 处理 #include、#define
    ↓
编译 (.s) - 生成汇编代码
    ↓
汇编 (.o) - 生成目标文件
    ↓
链接 (exe) - 链接库文件，生成可执行文件
```

## 现代构建：CMake + Ninja

在 2026 年，越来越多的项目使用 **Ninja** 替代 make：

```
CMake 生成
    ↓
Ninja 构建文件 (build.ninja)
    ↓
ninja 执行构建
    ↓
GCC/Clang 编译
```

**Ninja 优势**：
- 速度更快（专注于并行构建）
- 语法更简洁
- 大项目（如 Chrome、LLVM）都在用

## 真实执行顺序

### 传统方式（make）

```bash
1. 写 CMakeLists.txt
2. mkdir build && cd build
3. cmake ..       # 生成 Makefile
4. make           # 编译
5. ./myapp        # 运行
```

### 现代方式（Ninja）

```bash
1. 写 CMakeLists.txt
2. mkdir build && cd build
3. cmake -G Ninja ..  # 生成 build.ninja
4. ninja               # 编译（更快）
5. ./myapp            # 运行
```

### Qt Creator 自动化

你用 Qt Creator 点"运行"，内部自动帮你：

```
1. 运行 CMake 配置
2. 运行 make/ninja 编译
3. 运行程序
```

你看不到中间过程，但顺序不变。

## 常见编译器对照

| 编译器 | 用途 | 常见平台 | 特点 |
|--------|------|----------|------|
| **gcc** | 编译 C | Linux/WSL | GNU 项目标配 |
| **g++** | 编译 C++ | Linux/WSL | Qt 开发常用 |
| **clang** | 编译 C/C++ | macOS/现代 Linux | 错误信息更友好 |
| **cl.exe** | 编译 C/C++ | Windows (MSVC) | Visual Studio 内置 |
| **MinGW** | Windows 移植版 GCC | Windows | 不需要 VS |

## 完整工具链全景

现在你之前学的一串工具可以串起来了：

```
源代码 (main.cpp)
      ↓
CMake（生成构建文件）
      ↓
Makefile / build.ninja
      ↓
make / ninja（调度编译）
      ↓
GCC/g++/Clang（真正编译）
      ↓
可执行文件 (exe)
      ↓
调试器运行
      ↓
运行环境加载
```

## 实战示例

### Linux/WSL 下从零编译 C++ 程序

```bash
# 1. 创建项目目录
mkdir myproject && cd myproject

# 2. 写 CMakeLists.txt
cat > CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.16)
project(MyApp)
set(CMAKE_CXX_STANDARD 17)
add_executable(myapp main.cpp)
EOF

# 3. 写 main.cpp
cat > main.cpp << 'EOF'
#include <iostream>
int main() {
    std::cout << "Hello from CMake + make + GCC!" << std::endl;
    return 0;
}
EOF

# 4. 源外构建
mkdir build && cd build

# 5. 生成 Makefile
cmake ..

# 6. 编译
make

# 7. 运行
./myapp
```

### 使用 Ninja 加速

```bash
# 只需更改生成器
cmake -G Ninja ..
ninja
```

对于大型项目，Ninja 可以比 make 快很多。

## 超简总结（背这三句）

```
CMake 生成构建文件（Makefile 或 Ninja）
make/Ninja 执行构建文件，调用编译器
GCC/g++/Clang 真正把代码编译成机器码
```

## 总结

| 工具 | 角色 | 比喻 |
|------|------|------|
| CMake | 生成构建规则 | 写施工图纸 |
| make/Ninja | 按规则指挥 | 包工头 |
| GCC/g++ | 真正干活 | 搬砖工人 |

理解了这三层关系，你就理解了整个 C/C++ 构建体系的核心。

---

## 参考资料

- [CMake Official Documentation](https://cmake.org/documentation/) - CMake 官方文档
- [Introduction to the C++ Build Process and Tools](https://www.studyplan.dev/cmake/cpp-build-process) - C++ 构建过程详解
- [Hello CMake - Makefile Tutorials](https://hmchung.gitbooks.io/makefile-tutorials/content/hello-cmake.html) - CMake 入门教程
- [How to Build with CMake - Educative](https://www.educative.io/answers/how-to-build-with-cmake) - CMake 构建指南
