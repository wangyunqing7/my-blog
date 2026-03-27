---
title: "Carla 仿真器坐标系与智能体控制详解"
date: 2026-03-11T10:00:00+08:00
draft: false
slug: carla-coordinate-system-and-agent-control
tags: ["自动驾驶", "Carla", "仿真器", "坐标系"]
categories: ["技术"]
author: "Yunqing"
comments: true
---

自动驾驶仿真器 Carla 是一款基于 Unreal Engine 开发的开源仿真平台，广泛应用于自动驾驶算法的训练与测试。然而，许多初学者在使用 Carla 时会遇到一个令人困惑的问题：**Carla 的坐标系与常见的车辆动力学标准不一致**。本文将深入剖析 Carla 的坐标系统、智能体控制方式，以及与官方标准的差异。

## 一、为什么会有不同的坐标系？

在深入 Carla 之前，有必要先理解一个根本性问题：为什么计算机图形学和传统工程学使用不同的坐标系？

### 左手系 vs 右手系

坐标系的"手性"（chirality）由三个坐标轴的相对方向决定：

```
右手坐标系: X → Y → Z  顺时针排列 (右手拇指指向 X，食指指向 Y，中指指向 Z)
左手坐标系: X → Y → Z  逆时针排列
```

**传统工程领域的统一选择**：数学、物理学、机械工程等领域**普遍采用右手坐标系**。国际标准 **ISO 8855:2011**（道路车辆动力学术语）明确规定使用右手坐标系，Z 轴向上。ASAM OpenDRIVE、OpenSCENARIO 等交通仿真标准也都遵循这一约定。

**计算机图形学的混乱局面**：计算机图形学领域没有形成统一标准。
- **DirectX**（Microsoft）：传统上使用左手坐标系
- **OpenGL**：传统上使用右手坐标系
- **Unreal Engine**：采用左手坐标系，Z 轴向上

这种差异源于历史原因：不同图形 API 在设计时做出了不同的选择，而现代图形管道实际上支持两种坐标系，关键在于投影矩阵的设置。但作为后果，整个计算机图形学领域形成了一个"各种坐标系混杂"的局面。

## 二、Carla 的坐标系统详解

Carla 完全继承了 Unreal Engine 的左手坐标系约定。

### 全局坐标系

```
        Z (Up)
        ↑
        |
        |
        |------→ Y (Right)
       /
      /
     ↙ X (Forward)
```

对于站在原点、面向正 X 方向的观察者：

| 轴 | 方向 | 说明 |
|---|---|---|
| **X** | Forward | 前方 |
| **Y** | Right | 右侧 |
| **Z** | Up | 上方 |

**关键约定**：
- 距离单位：**米 (meters)**
- 角度单位：**度 (degrees)**，而非弧度！

### 智能体局部坐标系

每个 Actor（车辆、行人）都有自己的局部坐标系：

- 车头指向 **+X 方向**
- 车身右侧指向 **+Y 方向**
- 车顶指向 **+Z 方向**

## 三、与官方标准的冲突

### ISO 8855:2011 标准

ISO 8855 定义的车辆坐标系：

```
        Z (Up)
        ↑
        |
        |
        |←------ Y (Left)
       /
      /
     ↙ X (Forward)
```

**对比发现**：X 轴和 Z 轴方向相同，但 **Y 轴方向相反**！

### 对比表格

| 标准/工具 | 坐标系类型 | Z轴方向 | Y轴方向 |
|-----------|-----------|---------|----------|
| **Carla** | 左手坐标系 | Up | Right |
| **ISO 8855:2011** | 右手坐标系 | Up | Left |
| **ASAM OpenDRIVE** | 右手坐标系 | Up | Left |
| **ASAM OpenSCENARIO** | 右手坐标系 | Up | Left |
| **SUMO** | 右手坐标系 | Up | Left |

### 实际影响

当 Carla 与遵循 ISO 标准的工具对接时（如导入 OpenSCENARIO 场景、输出 ROS 数据），必须进行坐标转换。

**坐标转换公式**：

```python
# Carla (左手) → ISO 标准 (右手)
def carla_to_iso(x, y, z):
    return (x, -y, z)

# ISO 标准 (右手) → Carla (左手)
def iso_to_carla(x, y, z):
    return (x, -y, z)
```

## 四、智能体控制方式

### 1. 车辆控制

Carla 通过 `carla.VehicleControl` 类控制车辆行为：

```python
control = carla.VehicleControl(
    throttle=0.5,      # 油门 [0.0, 1.0]
    steer=-0.2,        # 转向 [-1.0, 1.0]，负值左转，正值右转
    brake=0.0,         # 刹车 [0.0, 1.0]
    hand_brake=False,  # 手刹
    reverse=False,     # 倒档
    manual_gear_shift=False,  # 手动换挡模式
    gear=1             # 档位
)

vehicle.apply_control(control)
```

### 2. 行人控制

行人（Walker）有两种控制方式：

#### 2.1 手动直接控制

```python
control = carla.WalkerControl(
    direction=carla.Vector3D(x=1.0, y=0.0, z=0.0),  # 移动方向（世界坐标系）
    speed=1.5,                                      # 速度 m/s
    jump=False                                      # 是否跳跃
)

walker.apply_control(control)
```

#### 2.2 AI 自动导航

```python
# 生成行人
walker_bp = world.get_blueprint_library().filter("walker.pedestrian.*")[0]
walker = world.spawn_actor(walker_bp, spawn_point)

# 生成 AI 控制器
controller_bp = world.get_blueprint_library().find('controller.ai.walker')
controller = world.spawn_actor(controller_bp, carla.Transform(), walker)

# 控制行人行为
controller.start()                          # 开始移动
controller.go_to_location(destination)      # 设置目标点
controller.set_max_speed(1.5)              # 设置最大速度
```

### 3. 两轮车辆

Carla 内置了摩托车和自行车：

**摩托车**：
- `vehicle.yamaha.yzf` - Yamaha YZF
- `vehicle.kawasaki.ninja` - Kawasaki Ninja
- `vehicle.harley-davidson.low_rider` - Harley Davidson Low Rider
- `vehicle.vespa.zx125` - Vespa ZX 125

**自行车**：
- `vehicle.gazelle.omafiets` - Gazelle Omafiets
- `vehicle.diamondback.century` - Diamondback Century
- `vehicle.bh.crossbike` - BH Crossbike

筛选特定轮数车辆：

```python
vehicles = world.get_blueprint_library().filter('vehicle.*')
bikes = [v for v in vehicles if int(v.get_attribute('number_of_wheels')) == 2]
```

## 五、常见陷阱与注意事项

### 1. 角度单位陷阱

Carla 使用**度**而非弧度，与 NumPy、数学库默认使用弧度不同：

```python
import numpy as np
# 错误示例
rotation = carla.Rotation(pitch=np.pi/4)  # 期望 45 度，实际传入的是弧度值

# 正确示例
rotation = carla.Rotation(pitch=45)  # 直接使用度
```

### 2. 控制信号互斥性

`throttle` 和 `brake` 不应同时为非零值：

```python
# 错误示例
control.throttle = 0.8
control.brake = 0.5  # 同时油门和刹车

# 正确示例
control.brake = 0.0  # 先释放刹车
control.throttle = 0.8  # 再应用油门
```

### 3. ROS 集成时的坐标系转换

ROS 使用右手坐标系，carla-ros-bridge 需要手动转换坐标：

```python
# Carla IMU 数据 → ROS 标准格式
def transform_imu_for_ros(carla_imu):
    return {
        'linear_acceleration': {
            'x': carla_imu.accelerometer.x,
            'y': -carla_imu.accelerometer.y,  # Y 轴取反
            'z': carla_imu.accelerometer.z
        },
        'angular_velocity': {
            'x': carla_imu.gyroscope.x,
            'y': -carla_imu.gyroscope.y,  # Y 轴取反
            'z': -carla_imu.gyroscope.z   # Z 轴也要取反（右手定则）
        }
    }
```

## 六、未来展望

Unreal Engine 5 已宣布计划迁移到右手坐标系（Y-up），这可能会影响未来版本的 Carla。同时，Carla 社区也在积极改进与标准格式的兼容性。

## 总结

Carla 的左手坐标系源于其底层引擎 Unreal Engine 的选择，与传统工程标准（右手系）存在根本性差异。这在使用 Carla 时需要特别注意：

1. **与 ISO 8855 标准不兼容**：Y 轴方向相反
2. **单位差异**：角度使用度而非弧度
3. **对接外部工具时需要坐标转换**

理解这些差异并正确处理坐标转换，是使用 Carla 进行自动驾驶仿真研究的基础。

---

## 参考资料

### 官方文档

1. **CARLA Simulator - Coordinates and transformations**
   https://carla.readthedocs.io/en/latest/coordinates/
   Carla 官方坐标系文档，详细说明了左手坐标系的使用约定和 API 操作

2. **CARLA Simulator - Python API tutorial**
   https://carla.readthedocs.io/en/latest/python_api_tutorial/
   Carla Python API 基础教程，涵盖 Actor、Blueprint、World 等核心概念

3. **CARLA Simulator - Vehicle catalogue**
   https://carla.readthedocs.io/en/latest/catalogue_vehicles/
   Carla 内置车辆目录，包含所有可用车辆的 Blueprint ID

4. **CARLA Simulator - Blueprint library**
   https://carla.readthedocs.io/en/latest/bp_library/
   Carla 蓝图库完整参考

### 国际标准

5. **ISO 8855:2011 - Road vehicles - Vehicle dynamics and road-holding ability**
   https://www.iso.org/standard/51180.html
   道路车辆动力学术语国际标准，定义了右手坐标系车辆动力学规范

6. **ASAM OpenSCENARIO - Coordinate Systems**
   https://publications.pages.asam.net/standards/ASAM_OpenSCENARIO/ASAM_OpenSCENARIO_DSL/latest/domain-model/dm_coordinate_systems.html
   ASAM OpenSCENARIO 坐标系统规范，遵循 ISO 8855:2011 右手坐标系定义

7. **ASAM OpenDRIVE**
   https://www.asam.net/fileadmin/standards/OpenDRIVE/ASAM_OpenDRIVE_BS_V1-7-0.html
   道路描述格式标准，使用右手坐标系

### 计算机图形学参考

8. **LearnOpenGL - Coordinate Systems**
   https://learnopengl.com/Getting-started/Coordinate-Systems
   OpenGL 坐标系统教程，解释右手坐标系在图形学中的应用

9. **Real-Time Rendering - Left-Handed vs Right-Handed Viewing**
   https://www.realtimerendering.com/blog/left-handed-vs-right-handed-viewing/
   实时渲染领域对左右手坐标系的深入分析

10. **Coordinate Systems And Cascading Stupidity - Erik McClure**
    https://erikmcclure.com/blog/coordinate-systems-and-cascading/
    计算机图形学坐标系混乱局面的批判性分析

### 相关工具

11. **SUMO Documentation**
    https://sumo.dlr.de/docs/index.html
    交通仿真工具 SUMO 文档，使用右手坐标系

12. **Unreal Engine - Coordinate System and Spaces**
    https://dev.epicgames.com/documentation/en-us/unreal-engine/coordinate-system-and-spaces-in-unreal-engine
    Unreal Engine 坐标系统文档，说明左手坐标系的使用
