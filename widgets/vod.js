WidgetMetadata = {
  id: "my.vod.demo",
  title: "VOD 示例",
  icon: "https://raw.githubusercontent.com/InchStudio/ForwardWidgets/master/icon.png",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  description: "VOD 模块示例，包含公开测试视频和 TV/AV 资源站清单适配",
  author: "lxc093210",
  site: "https://github.com/lxc093210/forward",
  detailCacheDuration: 60,
  modules: [
    {
      id: "demoList",
      title: "公开视频测试",
      functionName: "loadDemoList",
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
    },
    {
      id: "tvList",
      title: "TV 资源",
      functionName: "loadTVList",
      params: [
        {
          name: "sourceIndex",
          title: "源序号",
          type: "count",
          value: "1"
        },
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
    },
    {
      id: "avList",
      title: "AV 资源",
      functionName: "loadAVList",
      params: [
        {
          name: "sourceIndex",
          title: "源序号",
          type: "count",
          value: "1"
        },
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
        name: "group",
        title: "资源组",
        type: "enumeration",
        value: "tv",
        enumOptions: [
          {
            title: "TV",
            value: "tv"
          },
          {
            title: "AV",
            value: "av"
          },
          {
            title: "测试",
            value: "demo"
          }
        ]
      },
      {
        name: "sourceIndex",
        title: "源序号",
        type: "count",
        value: "1"
      },
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

var TV_SOURCE_URL = "https://raw.githubusercontent.com/fangkuia/XPTV/main/CMS/TV.json";
var AV_SOURCE_URL = "https://raw.githubusercontent.com/fangkuia/XPTV/main/CMS/AV.json";

var DEMO_VODS = [
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

async function loadDemoList(params) {
  return paginate(DEMO_VODS.map(toDemoListItem), params);
}

async function loadTVList(params) {
  return loadRemoteList("tv", params);
}

async function loadAVList(params) {
  return loadRemoteList("av", params);
}

async function search(params) {
  var group = String(params.group || "tv");
  if (group === "demo") {
    var keyword = String(params.keyword || "").toLowerCase();
    var matched = DEMO_VODS.filter(function (vod) {
      return !keyword || String(vod.title).toLowerCase().indexOf(keyword) >= 0;
    });
    return paginate(matched.map(toDemoListItem), params);
  }
  return loadRemoteList(group, params);
}

async function loadDetail(link) {
  var parts = String(link || "").split(":");
  if (parts.length < 3 || parts[0] !== "vod") {
    return null;
  }

  if (parts[1] === "demo") {
    return loadDemoDetail(parts[2]);
  }

  var group = parts[1];
  var sourceIndex = Number(parts[2] || 1);
  var vodId = parts.slice(3).join(":");
  var source = await getSource(group, sourceIndex);
  if (!source || !vodId) {
    return null;
  }

  var data = await requestVodApi(source.api, {
    ac: "detail",
    ids: vodId
  });
  var list = data && data.list ? data.list : [];
  if (!list.length) {
    return null;
  }

  return toRemoteDetail(list[0], group, sourceIndex, source);
}

async function loadRemoteList(group, params) {
  var page = Number(params.page || 1);
  var keyword = String(params.keyword || "");
  var sourceIndex = Number(params.sourceIndex || 1);
  var source = await getSource(group, sourceIndex);
  if (!source) {
    return [];
  }

  var apiParams = {
    ac: "detail",
    pg: page
  };
  if (keyword) {
    apiParams.wd = keyword;
  }

  var data = await requestVodApi(source.api, apiParams);
  var list = data && data.list ? data.list : [];
  return list.map(function (vod) {
    return toRemoteListItem(vod, group, sourceIndex, source);
  });
}

async function getSource(group, sourceIndex) {
  var sources = await fetchSources(group);
  if (!sources.length) {
    return null;
  }
  var index = Math.max(1, sourceIndex || 1) - 1;
  return sources[index] || sources[0];
}

async function fetchSources(group) {
  var url = group === "av" ? AV_SOURCE_URL : TV_SOURCE_URL;
  var response = await Widget.http.get(url);
  var data = response && response.data ? response.data : [];
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error("[fetchSources] JSON 解析失败:", error.message || error);
      return [];
    }
  }
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(function (source) {
    return source && source.api;
  });
}

async function requestVodApi(api, params) {
  var response = await Widget.http.get(api, {
    params: params,
    headers: {
      "User-Agent": "ForwardWidgets/1.0.0",
      "Accept": "application/json,text/plain,*/*"
    }
  });
  var data = response && response.data ? response.data : {};
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error("[requestVodApi] JSON 解析失败:", error.message || error);
      return {};
    }
  }
  return data || {};
}

function toRemoteListItem(vod, group, sourceIndex, source) {
  var id = String(vod.vod_id || vod.id || "");
  return {
    id: id,
    type: "url",
    title: vod.vod_name || vod.name || "未命名",
    description: cleanText(vod.vod_blurb || vod.vod_content || ""),
    posterPath: vod.vod_pic || "",
    backdropPath: vod.vod_pic_slide || vod.vod_pic || "",
    releaseDate: String(vod.vod_year || ""),
    mediaType: guessMediaType(vod),
    rating: Number(vod.vod_score || 0),
    genreTitle: vod.type_name || source.name || "",
    link: "vod:" + group + ":" + sourceIndex + ":" + id
  };
}

function toRemoteDetail(vod, group, sourceIndex, source) {
  var item = toRemoteListItem(vod, group, sourceIndex, source);
  var episodeItems = parseEpisodes(vod, item.mediaType);
  item.description = cleanText(vod.vod_content || vod.vod_blurb || "");
  item.detailPoster = item.posterPath;
  item.backdropPaths = [
    item.backdropPath || item.posterPath
  ].filter(Boolean);
  item.episodeItems = episodeItems;
  item.videoUrl = episodeItems.length ? episodeItems[0].videoUrl : "";
  item.playerType = "system";
  return item;
}

function parseEpisodes(vod, mediaType) {
  var playUrl = String(vod.vod_play_url || "");
  var playFrom = String(vod.vod_play_from || "");
  var groups = playUrl.split("$$$");
  var froms = playFrom.split("$$$");
  var episodes = [];

  for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    var groupName = froms[groupIndex] || "播放";
    var entries = groups[groupIndex].split("#");
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (!entry) {
        continue;
      }
      var dollarIndex = entry.indexOf("$");
      var title = dollarIndex >= 0 ? entry.slice(0, dollarIndex) : "第 " + (i + 1) + " 集";
      var url = dollarIndex >= 0 ? entry.slice(dollarIndex + 1) : entry;
      if (!url) {
        continue;
      }
      episodes.push({
        id: String(vod.vod_id || "") + "-" + groupIndex + "-" + i,
        type: "url",
        title: groups.length > 1 ? groupName + " · " + title : title,
        mediaType: mediaType,
        episode: i + 1,
        videoUrl: url,
        playerType: "system"
      });
    }
  }

  return episodes;
}

function toDemoListItem(vod) {
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
    link: "vod:demo:" + vod.id
  };
}

function loadDemoDetail(id) {
  var vod = findDemoVod(id);
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
    relatedItems: DEMO_VODS.filter(function (item) {
      return item.id !== vod.id;
    }).map(toDemoListItem),
    link: "vod:demo:" + vod.id
  };
}

function findDemoVod(id) {
  for (var i = 0; i < DEMO_VODS.length; i++) {
    if (DEMO_VODS[i].id === id) {
      return DEMO_VODS[i];
    }
  }
  return null;
}

function guessMediaType(vod) {
  var typeName = String(vod.type_name || vod.vod_class || "");
  if (typeName.indexOf("电视剧") >= 0 || typeName.indexOf("连续剧") >= 0 || typeName.indexOf("动漫") >= 0 || typeName.indexOf("剧集") >= 0) {
    return "tv";
  }
  return "movie";
}

function cleanText(text) {
  return String(text || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function paginate(items, params) {
  var page = Number(params && params.page ? params.page : 1);
  var count = Number(params && params.count ? params.count : 24);
  var start = (page - 1) * count;
  return items.slice(start, start + count);
}
