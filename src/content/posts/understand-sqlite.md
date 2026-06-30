---
date: 2026-06-30
draft: false
slug: understand-sqlite
title: "一个文件就是一个数据库：SQLite 凭什么成为地球上装机量最高的数据库"
tags:
  - SQLite
  - 数据库
  - SQL
  - 教程
  - 后端
categories:
  - 技术教程
author: "王云卿"
description: "从\"很多人以为 SQLite 只是玩具\"的偏见讲起，用图书馆管理员和口袋笔记本的对比讲透它的单文件心智模型，再带你实战建表、CRUD、动态类型，以及什么时候该用它、什么时候别用。"
comments: true
---

先抛一个可能颠覆你认知的事实：

**SQLite 很可能是人类历史上装机量最大的软件之一。** 官方估算，全球有超过**一万亿**个 SQLite 数据库正在运行。它藏在你的每一部手机里（iOS 和 Android 的几乎每个 App 都在用它）、你的浏览器里（Chrome、Safari 用它存书签、cookies、历史记录）、你电脑里的 countless 软件里、甚至飞机的飞行控制系统和车载娱乐系统里。

但诡异的是，很多开发者提起 SQLite，第一反应是："哦，那个学习用的玩具数据库吧。"

这是对 SQLite 最深的误解。它不是玩具，恰恰相反，它是被工程界最信任、最依赖的数据库之一——只不过它工作的方式，和你印象里的"数据库"完全不一样。

这篇文章，我们要破除这个偏见，看清楚 SQLite 到底是什么、凭什么无处不在，以及——更重要的是——**为什么你很多折腾半天的数据库问题，它一个文件就能解决。**

## SQLite 到底是什么？先破除三个偏见

偏见一：**"数据库就得装 MySQL / PostgreSQL 才正经。"**

偏见二：**"SQLite 只能用来学习，扛不住真业务。"**

偏见三：**"用数据库得先启动服务、配连接、开端口。"**

这三句话，在 SQLite 的世界里，**全部不成立**。

SQLite 的官方定义是：一个**自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎**。每一个修饰词都值得玩味，但我们先用一句话抓住它的灵魂：

**SQLite 是一个"嵌进程序里"的数据库。整个数据库，就是磁盘上的一个普通文件。**

你不需要"安装"一个数据库服务器，不需要"启动"什么服务，不需要配连接字符串、开端口、设密码。你只需要一个 `.db` 文件——这个文件里装着所有的表、数据、索引、触发器。把它拷贝到 U 盘、发到邮件里、塞进 git 仓库，都不影响它正常工作。拷到另一台电脑，照样能打开。

这就是 SQLite 最革命性的设计：**把"数据库"从"一个独立的服务"降维成了"一个文件"。**

## 一个核心比喻：图书馆管理员 vs 口袋笔记本

要理解 SQLite 和 MySQL/PostgreSQL 的根本区别，我们用两个比喻。

**MySQL / PostgreSQL 像一座"图书馆 + 图书管理员"。**

图书馆是独立的机构，有自己的地址（服务器）、开门时间（服务进程）、规章制度。你想找一本书、存一份资料，不能自己冲进书库翻——你得走到前台，填一张借书单（发一条 SQL 请求），交给管理员，他替你去取，再把结果递给你。多个读者同时来，得排队、挂号、遵守馆规（并发控制、连接池）。

这套机制强大、规范、能服务成千上万人，但代价是**重**：你要建馆、雇管理员、维护秩序。为了存几条数据，搭一整套服务，往往杀鸡用牛刀。

**SQLite 像一本"你自己口袋里的笔记本"。**

笔记本就在你兜里，是你的私人财产。你想记点什么，掏出来直接写；想查什么，翻一翻直接看。没有前台、没有管理员、没有排队。你和笔记本之间是**直接接触**，没有任何中间人。

技术上翻译一下：MySQL/PostgreSQL 是 **C/S 架构（客户端-服务器）**——你的程序是客户端，通过网络或 socket，向一个独立运行的数据库服务器进程发请求。而 SQLite 是**嵌入式架构**——数据库引擎是一段代码，直接编译进你的程序里，和你的程序跑在同一个进程。你的程序调用一个函数，直接读写那个 `.db` 文件，全程没有网络往返、没有跨进程通信。

| | MySQL / PostgreSQL | SQLite |
|---|---|---|
| 架构 | 独立的服务器进程 | 嵌入应用程序内部 |
| 数据存储 | 多个文件 + 配置 | **单个跨平台文件** |
| 如何访问 | 通过网络/socket连接 | 直接读写文件 |
| 是否需要安装配置 | 需要（装服务、配端口、建用户） | **不需要**（大多数系统已自带） |
| 并发 | 多客户端高并发 | 单进程为主，写操作需协调 |
| 适合规模 | 大型、多人共享系统 | 单机、嵌入式、中小型应用 |

记住这张对比，你就理解了为什么 SQLite 不需要"启动"——因为**它根本就不是一个独立的服务，而是你程序的一部分**。

## 第一次实战：连"安装"都省了

学 MySQL 的第一步是什么？下载安装包、配置 root 密码、启动服务、排查端口冲突……经常折腾一晚上。SQLite 的第一步呢？

**打开终端，敲一行命令。**

而且更可能的情况是——你的电脑里早就装好了。

```bash
sqlite3 --version
```

如果输出了版本号，恭喜，你已经可以用了。Mac 自带 SQLite，大多数 Linux 发行版自带，Windows 10+ 也内置了。Python 标准库更是直接内置了 `sqlite3` 模块——这意味着**任何能跑 Python 的地方，都能直接用 SQLite，无需安装任何东西。**

### 创建你的第一个数据库

```bash
sqlite3 mydb.sqlite
```

这一行命令做了两件事：在当前目录**创建（或打开）**一个叫 `mydb.sqlite` 的文件，并进入 SQLite 的交互式命令行（提示符变成 `sqlite>`）。

退出时按 `Ctrl+D`（Mac/Linux）或输入 `.exit`。你会发现当前目录下多了一个 `mydb.sqlite` 文件——**这就是你的整个数据库**。往后退一步看，是不是很奇妙？一个数据库，就是一个文件。

### 建表、插数据、查询

在 `sqlite>` 提示符里，你可以直接写 SQL。SQLite 用的是标准 SQL，和 MySQL 几乎一样：

```sql
-- 建一张表
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    age INTEGER
);

-- 插入几条数据
INSERT INTO users (name, email, age) VALUES ('张三', 'zhangsan@example.com', 28);
INSERT INTO users (name, email, age) VALUES ('李四', 'lisi@example.com', 34);
INSERT INTO users (name, email, age) VALUES ('王五', 'wangwu@example.com', 22);

-- 查询
SELECT * FROM users;
SELECT name, age FROM users WHERE age > 25 ORDER BY age DESC;
```

退出后再想操作这个库，还是 `sqlite3 mydb.sqlite` 打开它——数据都还在那个文件里，不会丢。

几个常用的"点命令"（SQLite 特有，以 `.` 开头，不是 SQL）：

```sql
.tables              -- 列出所有表
.schema users        -- 查看 users 表的结构
.headers on          -- 查询结果显示列名
.mode column         -- 让输出对齐成列，更好看
.quit                -- 退出
```

> 小提示：`.headers on` 和 `.mode column` 配合使用，能让 `SELECT` 的输出从一堆挤在一起的字符串，变成整齐的表格。第一次玩 SQLite 觉得输出难看，多半是没开这两个。

## SQLite 最反直觉的特色：动态类型

如果你用过 MySQL，你会记得 `age` 必须是 `INT`，`name` 必须是 `VARCHAR(50)`，存错类型会报错。

SQLite 在这点上**故意不同**。它用的是"**动态类型系统**"。

你在 `users` 表里声明 `age INTEGER`，然后偷偷插一条 `INSERT INTO users (name, age) VALUES ('捣蛋鬼', '我偏要写字符串')`——SQLite **不会报错，真的让你存进去**。

这不是 bug，而是设计哲学。SQLite 认为：**类型声明更多是一种"建议"而非"强制"**。声明 `INTEGER` 只是告诉 SQLite"我倾向于在这里存整数"，方便它优化存储和索引，但并不阻止你存别的。

这种宽松是一把双刃剑：

- 好处是**极其灵活**，迁移数据、对接乱七八糟的数据源时不会因为类型问题卡住。
- 坏处是**约束变弱**，如果你的代码本身有 bug 存了脏数据，SQLite 不会替你拦住。

实际项目中，如果你想要严格的类型检查，SQLite 也提供了 `STRICT` 模式（5.0+），建表时写 `CREATE TABLE ... STRICT` 就能强制类型。但对于大多数场景，享受它的灵活就好——反正你的应用层本来也该做校验。

## 它到底装在哪里？你可能每天都在用它

正因为 SQLite 是"一个文件 + 嵌入式"，它才能钻进那些 MySQL 永远去不了的地方。举几个让你重新认识它的例子：

- **每一部手机**：iOS 和 Android 的几乎所有 App，本地数据存储默认就是 SQLite。你微信的聊天记录缓存、备忘录、待办事项 App、健身记录……底层大多是 SQLite。
- **每一个浏览器**：Chrome、Firefox、Safari 用 SQLite 存书签、历史记录、cookies、表单自动填充。
- **每一个 Python 程序员**：Python 标准库自带 `sqlite3`，意味着你 `import sqlite3` 就能立刻用，做数据分析、爬虫存数据、写小工具，零依赖。
- **飞机和汽车**：空客 A350 的飞行数据记录、特斯拉的车载系统，都用到 SQLite——因为它的可靠性经过了极端环境验证，且几乎不依赖外部环境。
- **智能电视、IoT 设备、甚至一些卫星**：只要是个能跑代码的小设备，几乎都装着 SQLite。

你会发现，SQLite 不是"上不了台面"，而是**它工作的舞台，根本不需要被看见**。它像一个沉默可靠的齿轮，嵌在世界各地的设备里默默运转。

## 什么时候该用 SQLite，什么时候别用？

这是最关键的一节。SQLite 不是万能药，用对场景是神器，用错场景就是灾难。

### ✅ 这些场景，SQLite 是最佳选择

**1. 单机应用和桌面软件。** 你的程序只在一台电脑上跑，数据存在本地——配置、缓存、用户偏好、单机版工具。SQLite 完美。

**2. 移动端 App。** 这本来就是 SQLite 的主战场，原生支持。

**3. 原型开发和小项目。** 刚开始做个网站或工具，数据量不大、并发不高。用 SQLite 五秒钟就能起步，等真的做大了再迁移到 PostgreSQL 也来得及。**别一上来就为装 MySQL 折腾半天**——这是我见过新手最浪费时间的事。

**4. 数据分析和脚本。** 用 Python 处理数据，把中间结果存进 SQLite 文件，比维护一堆 CSV 强得多，还能用 SQL 查询。

**5. 测试。** 单元测试/集成测试用 SQLite（尤其内存模式），速度快、不污染环境，测完即弃。

**6. 中小型网站。** 一个反常识的事实：**SQLite 完全能扛住很多中小型网站的流量**。开启 WAL 模式（下面会讲）后，每天几万到几十万次访问的博客、企业官网、小型 SaaS，SQLite 绰绰有余。

### ❌ 这些场景，请老老实实用 MySQL / PostgreSQL

**1. 多台服务器要共享同一个数据库。** 这是 SQLite 的硬伤。因为它是单文件，而文件没法被多台机器同时高效读写。如果你的架构是"多台 Web 服务器 + 一个共享数据库"，必须用 C/S 数据库。

**2. 高并发写入。** SQLite 默认下，**同一时刻只能有一个写操作**（读可以并发）。如果你的应用有大量用户同时在写（比如高并发的计数器、实时消息系统），SQLite 会成为瓶颈。虽然 WAL 模式缓解了很多，但本质限制还在。

**3. 海量数据 + 复杂权限管理。** 几十 TB 级别、需要细粒度用户权限控制、需要复杂的主从复制，这些是专用数据库服务器的领地。

一句话总结判断标准：**如果"一个文件"就能装下你的需求，用 SQLite；如果需要"一个独立的服务"，用 MySQL/PostgreSQL。**

## 一个重要开关：WAL 模式

如果你决定用 SQLite 做稍微正经一点的应用（比如一个网站），有一个设置几乎是必开的——**WAL 模式**（Write-Ahead Logging，预写日志）。

默认情况下，SQLite 用的是"回滚日志"模式，读写会互相阻塞：有人写的时候，读者得等着。这在并发稍高的场景下会很卡。

WAL 模式改变了这个机制：写入先记到一个单独的日志文件里，不阻塞读操作。**读者和写者可以真正并行**，大幅提升了并发性能。

开启方式极简，执行一次就永久生效（设置存在数据库文件里）：

```sql
PRAGMA journal_mode=WAL;
```

配合另外两个常用设置，能让 SQLite 更稳更快：

```sql
PRAGMA synchronous=NORMAL;   -- 在 WAL 下既安全又快
PRAGMA foreign_keys=ON;      -- 默认关闭外键约束，需要手动开
```

> 顺带一提：`PRAGMA` 是 SQLite 特有的"配置命令"前缀，用来调整引擎的各种行为。SQLite 有几十个 pragma，但日常用得上的就那么几个，不用全记。

## 在代码里用 SQLite：以 Python 为例

命令行玩够了，真正用起来是在代码里。Python 是最舒服的选择，因为标准库自带：

```python
import sqlite3

# 连接（打开）数据库文件，不存在则自动创建
conn = sqlite3.connect('mydb.sqlite')

# 拿到游标，用来执行 SQL
cur = conn.cursor()

# 建表、插数据
cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER
    )
''')
cur.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('张三', 28))
conn.commit()   # 别忘了提交，否则数据不落盘

# 查询
cur.execute('SELECT name, age FROM users WHERE age > 25')
for row in cur.fetchall():
    print(row)

conn.close()
```

几个新手必知的点：

- **`?` 是占位符**，永远用它传参，**绝不要用字符串拼接拼 SQL**——那是 SQL 注入漏洞的根源，是安全大忌。
- **写操作要 `commit()`**。SQLite 默认开启事务，`execute` 之后不 `commit`，数据只在内存里，程序一退出就没了。
- 推荐用 `with` 语法管理连接，能自动提交或回滚：

```python
with sqlite3.connect('mydb.sqlite') as conn:
    conn.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('李四', 34))
    # 退出 with 块时自动 commit；出错则自动 rollback
```

## 几个好习惯

**第一，把 `.db` 文件加进备份，但视情况决定是否进 Git。** 数据库文件是二进制的，git diff 看不出有意义的变化，还会让仓库膨胀。小型的、初始化用的种子数据可以进 git；运行时产生的大数据库不要进。

**第二，用参数化查询，永远不要拼 SQL 字符串。** 上面说过，再说一遍，因为太重要。

**第三，长连接优于频繁开关。** 每次操作都 `connect`/`close` 有开销，尤其是写入。在 Web 应用里，一个请求复用一个连接，或用连接池。

**第四，定期备份。** 最简单的备份——**直接复制那个 `.db` 文件**（前提是没有写入在进行）。这是 SQLite 单文件架构带来的额外红利：备份和迁移简单到不可思议。

**第五，善用 `.dump` 导出纯文本。** 想把整个数据库导成 SQL 脚本（方便迁移到别的数据库，或做版本化的种子数据）：

```bash
sqlite3 mydb.sqlite .dump > backup.sql
```

反过来，从 SQL 脚本恢复：

```bash
sqlite3 newdb.sqlite < backup.sql
```

## 日常命令速查表

```bash
# ========== 命令行 ==========
sqlite3 test.db              # 打开/创建数据库
sqlite3 test.db ".tables"    # 非交互模式直接执行命令后退出
sqlite3 :memory:             # 创建一个纯内存数据库（程序退出即消失，适合测试）

# ========== 交互式点命令 ==========
.tables                      # 列出所有表
.schema 表名                 # 查看建表语句
.headers on                  # 显示列名
.mode column                 # 列对齐输出
.mode csv                    # 导出为 CSV 格式
.dump                        # 导出整个库为 SQL 脚本
.read script.sql             # 执行一个 SQL 文件
.quit                        # 退出

# ========== 常用 SQL（和标准 SQL 一致） ==========
CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO t (name) VALUES ('hello');
SELECT * FROM t WHERE id = 1;
UPDATE t SET name = 'world' WHERE id = 1;
DELETE FROM t WHERE id = 1;

# ========== 关键 PRAGMA ==========
PRAGMA journal_mode=WAL;       # 开启 WAL，提升并发
PRAGMA synchronous=NORMAL;     # 配合 WAL，平衡速度与安全
PRAGMA foreign_keys=ON;        # 开启外键约束
PRAGMA table_info(表名);       # 查看表的列信息
```

## 写在最后

回头看，SQLite 讲的其实就一件事：**把数据库这件事，简化到一个文件。**

它放弃了"独立服务、高并发、多机共享"这些重型能力，换来的是"零配置、单文件、到处能跑"的极致轻便。这不是妥协，而是一种清醒的取舍——它精准地服务了世界上数量最庞大的一类需求：**那些不需要一个独立数据库服务器、却需要可靠存储的场景。**

下次当你纠结"要不要为这个小项目装个 MySQL"时，先问自己一个问题：**我的需求，一个文件能装下吗？**

如果能——你手上早就有了一个比 MySQL 装机量高出一万倍的、最可靠的答案。它就藏在你的手机里、浏览器里、Python 解释器里，安安静静地等着你 `import sqlite3`。

而它之所以能无处不在，恰恰是因为它足够小、足够简单、足够不引人注目。

**这，又是好技术的样子。**

## 参考资料

- [SQLite 官方网站（含完整文档）— sqlite.org](https://www.sqlite.org/)
- [SQLite Most Widely Deployed — 官方装机量统计](https://www.sqlite.org/mostdeployed.html)
- [Appropriate Uses for SQLite — 官方适用场景指南](https://www.sqlite.org/whentouse.html)
- [Write-Ahead Logging — 官方 WAL 模式文档](https://www.sqlite.org/wal.html)
- [Datatypes in SQLite — 官方动态类型说明](https://www.sqlite.org/datatype3.html)
- [sqlite3 — Python 标准库文档](https://docs.python.org/3/library/sqlite3.html)
