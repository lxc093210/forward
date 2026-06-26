# Forward 自用主页模块

这是一个给 Forward 使用的个人主页模块。

## 订阅地址

```text
https://cdn.jsdelivr.net/gh/lxc093210/forward@main/forward-widgets.fwd
```

## 模块内容

- 首页推荐
- 电影
- 剧集
- 动画
- 一个自定义直链播放示例

## 修改片单

编辑 `widgets/home.js`：

- `MOVIES`：电影片单
- `TV`：剧集片单
- `ANIME`：动画片单
- `CUSTOM`：自定义直链条目

TMDB 条目只需要改：

```js
{ id: 27205, type: "tmdb", title: "Inception", mediaType: "movie" }
```

自定义直链条目主要改：

```js
{
  id: "sample",
  type: "url",
  title: "标题",
  mediaType: "movie",
  posterPath: "竖版封面地址",
  backdropPath: "横版封面地址",
  videoUrl: "视频直链"
}
```
