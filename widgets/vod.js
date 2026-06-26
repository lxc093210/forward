WidgetMetadata = {
  id: "my.vod.demo",
  title: "VOD 示例",
  icon: "https://raw.githubusercontent.com/InchStudio/ForwardWidgets/master/icon.png",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "使用公开测试视频的 VOD 模块示例",
  author: "lxc093210",
  site: "https://github.com/lxc093210/forward",
  detailCacheDuration: 60,
  modules: [
    {
      id: "loadList",
      title: "测试片源",
      functionName: "loadList",
      params: [
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "count",
          title: "数量",
          type: "count",
          value: "24"
        }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      {
        name: "keyword",
        title: "关键词",
        type: "input"
      },
      {
        name: "page",
        title: "页码",
        type: "page"
      }
    ]
  }
};

var VODS = [
  {
    id: "sintel",
    title: "Sintel",
    year: "2010",
    genre: "动画 / 短片",
    description: "Blender Foundation 公开测试短片。这个条目用于验证 Forward 的 VOD 列表、详情和播放链路。",
    posterPath: "https://picsum.photos/seed/forward-vod-sintel-poster/600/900",
    backdropPath: "https://picsum.photos/seed/forward-vod-sintel-backdrop/1280/720",
    rating: 8.1,
    episodes: [
      {
        title: "正片",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
      }
    ]
  },
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    year: "2008",
    genre: "动画 / 喜剧",
    description: "公开视频示例，适合测试播放、海报和详情页展示。",
    posterPath: "https://picsum.photos/seed/forward-vod-bunny-poster/600/900",
    backdropPath: "https://picsum.photos/seed/forward-vod-bunny-backdrop/1280/720",
    rating: 7.8,
    episodes: [
      {
        title: "正片",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ]
  },
  {
    id: "elephants-dream",
    title: "Elephants Dream",
    year: "2006",
    genre: "动画 / 科幻",
    description: "公开视频示例，使用 type=url 和 loadDetail 返回可播放地址。",
    posterPath: "https://picsum.photos/seed/forward-vod-elephant-poster/600/900",
    backdropPath: "https://picsum.photos/seed/forward-vod-elephant-backdrop/1280/720",
    rating: 7.2,
    episodes: [
      {
        title: "正片",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      }
    ]
  }
];

async function loadList(params) {
  return paginate(VODS.map(toListItem), params);
}

async function search(params) {
  var keyword = String(params.keyword || "").toLowerCase();
  var matched = VODS.filter(function (vod) {
    return !keyword || String(vod.title).toLowerCase().indexOf(keyword) >= 0;
  });
  return paginate(matched.map(toListItem), params);
}

async function loadDetail(link) {
  var id = String(link || "").replace("vod:", "");
  var vod = findVod(id);
  if (!vod) {
    return null;
  }

  return {
    id: vod.id,
    type: "url",
    title: vod.title,
    description: vod.description,
    posterPath: vod.posterPath,
    detailPoster: vod.posterPath,
    backdropPath: vod.backdropPath,
    backdropPaths: [
      vod.backdropPath,
      "https://picsum.photos/seed/forward-vod-" + vod.id + "-still-1/1280/720",
      "https://picsum.photos/seed/forward-vod-" + vod.id + "-still-2/1280/720"
    ],
    releaseDate: vod.year,
    mediaType: "movie",
    rating: vod.rating,
    genreTitle: vod.genre,
    genreItems: [
      {
        id: "demo",
        title: "测试片源"
      }
    ],
    episodeItems: vod.episodes.map(function (episode, index) {
      return {
        id: vod.id + "-" + index,
        type: "url",
        title: episode.title,
        mediaType: "movie",
        episode: index + 1,
        videoUrl: episode.url,
        playerType: "system"
      };
    }),
    videoUrl: vod.episodes[0] ? vod.episodes[0].url : "",
    relatedItems: VODS.filter(function (item) {
      return item.id !== vod.id;
    }).map(toListItem),
    link: "vod:" + vod.id
  };
}

function toListItem(vod) {
  return {
    id: vod.id,
    type: "url",
    title: vod.title,
    description: vod.description,
    posterPath: vod.posterPath,
    backdropPath: vod.backdropPath,
    releaseDate: vod.year,
    mediaType: "movie",
    rating: vod.rating,
    genreTitle: vod.genre,
    link: "vod:" + vod.id
  };
}

function findVod(id) {
  for (var i = 0; i < VODS.length; i++) {
    if (VODS[i].id === id) {
      return VODS[i];
    }
  }
  return null;
}

function paginate(items, params) {
  var page = Number(params && params.page ? params.page : 1);
  var count = Number(params && params.count ? params.count : 24);
  var start = (page - 1) * count;
  return items.slice(start, start + count);
}
