# Forward VOD 示例模块

这是一个给 Forward 使用的 VOD 示例模块，使用公开测试视频验证列表、详情和播放链路。

## 订阅地址

```text
https://raw.githubusercontent.com/lxc093210/forward/main/forward-widgets.fwd
```

## 模块内容

- 测试片源列表
- 搜索
- 详情页
- episodeItems 播放列表
- videoUrl 直链播放

## 修改片源

编辑 `widgets/vod.js` 里的 `VODS` 数组。

主要改：

```js
{
  id: "sample",
  title: "标题",
  year: "2026",
  genre: "电影",
  description: "简介",
  posterPath: "竖版封面地址",
  backdropPath: "横版封面地址",
  episodes: [
    { title: "第1集", url: "视频直链" }
  ]
}
```
