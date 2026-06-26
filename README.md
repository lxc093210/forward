# Forward CMS 资源模块

这是一个给 Forward 使用的资源模块，按照 `type: "stream"` 的方式为当前影片加载播放资源。

## 订阅地址

```text
https://raw.githubusercontent.com/lxc093210/forward/main/forward-widgets.fwd
```

## 模块内容

- 加载资源
- 支持 TV / AV 两个资源站清单
- 支持单源或聚合搜索

## 使用方式

在 Forward 的资源模块里添加订阅：

```text
https://cdn.jsdelivr.net/gh/lxc093210/forward@main/forward-widgets.json
```

然后在影片详情页使用资源模块的“加载资源”。

## 全局参数

- `资源分组`：TV 或 AV
- `源序号`：使用资源站清单里的第几个源
- `是否启用聚合搜索`：启用后会依次尝试前几个源
