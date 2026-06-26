WidgetMetadata = {
  id: "my.home",
  title: "我的主页",
  icon: "https://raw.githubusercontent.com/InchStudio/ForwardWidgets/master/icon.png",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "个人自用首页模块",
  author: "lxc093210",
  site: "https://github.com/lxc093210/forward",
  modules: [
    {
      id: "home",
      title: "首页推荐",
      functionName: "loadHome",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "count", title: "数量", type: "count", value: "24" }
      ]
    },
    {
      id: "movies",
      title: "电影",
      functionName: "loadMovies",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "count", title: "数量", type: "count", value: "24" }
      ]
    },
    {
      id: "tv",
      title: "剧集",
      functionName: "loadTV",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "count", title: "数量", type: "count", value: "24" }
      ]
    },
    {
      id: "anime",
      title: "动画",
      functionName: "loadAnime",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "count", title: "数量", type: "count", value: "24" }
      ]
    }
  ]
};

var MOVIES = [
  { id: 27205, type: "tmdb", title: "Inception", mediaType: "movie" },
  { id: 603, type: "tmdb", title: "The Matrix", mediaType: "movie" },
  { id: 550, type: "tmdb", title: "Fight Club", mediaType: "movie" },
  { id: 157336, type: "tmdb", title: "Interstellar", mediaType: "movie" },
  { id: 155, type: "tmdb", title: "The Dark Knight", mediaType: "movie" },
  { id: 19995, type: "tmdb", title: "Avatar", mediaType: "movie" },
  { id: 496243, type: "tmdb", title: "Parasite", mediaType: "movie" },
  { id: 98, type: "tmdb", title: "Gladiator", mediaType: "movie" }
];

var TV = [
  { id: 1396, type: "tmdb", title: "Breaking Bad", mediaType: "tv" },
  { id: 1399, type: "tmdb", title: "Game of Thrones", mediaType: "tv" },
  { id: 66732, type: "tmdb", title: "Stranger Things", mediaType: "tv" },
  { id: 60625, type: "tmdb", title: "Rick and Morty", mediaType: "tv" },
  { id: 76479, type: "tmdb", title: "The Boys", mediaType: "tv" },
  { id: 94605, type: "tmdb", title: "Arcane", mediaType: "tv" },
  { id: 120089, type: "tmdb", title: "SPY x FAMILY", mediaType: "tv" },
  { id: 1429, type: "tmdb", title: "Attack on Titan", mediaType: "tv" }
];

var ANIME = [
  { id: 1429, type: "tmdb", title: "Attack on Titan", mediaType: "tv" },
  { id: 37854, type: "tmdb", title: "One Piece", mediaType: "tv" },
  { id: 85937, type: "tmdb", title: "Demon Slayer: Kimetsu no Yaiba", mediaType: "tv" },
  { id: 95479, type: "tmdb", title: "Jujutsu Kaisen", mediaType: "tv" },
  { id: 65930, type: "tmdb", title: "My Hero Academia", mediaType: "tv" },
  { id: 30984, type: "tmdb", title: "Bleach", mediaType: "tv" },
  { id: 46260, type: "tmdb", title: "Naruto", mediaType: "tv" },
  { id: 2098, type: "tmdb", title: "Batman: The Animated Series", mediaType: "tv" }
];

var CUSTOM = [
  {
    id: "sample-sintel",
    type: "url",
    title: "自定义直链示例",
    mediaType: "movie",
    description: "这是一个 type=url 的示例。换成你自己的视频地址、封面和描述即可。",
    posterPath: "https://picsum.photos/seed/forward-home-sintel-poster/600/900",
    backdropPath: "https://picsum.photos/seed/forward-home-sintel-backdrop/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    releaseDate: "2025-01-01",
    rating: 8.1,
    genreItems: [
      { id: "custom", title: "自定义" },
      { id: "demo", title: "示例" }
    ],
    link: "sample-sintel"
  }
];

async function loadHome(params) {
  return paginate(CUSTOM.concat(MOVIES.slice(0, 4), TV.slice(0, 4), ANIME.slice(0, 4)), params);
}

async function loadMovies(params) {
  return paginate(MOVIES, params);
}

async function loadTV(params) {
  return paginate(TV, params);
}

async function loadAnime(params) {
  return paginate(ANIME, params);
}

async function loadDetail(link) {
  if (link !== "sample-sintel") {
    return null;
  }

  return {
    id: "sample-sintel",
    type: "url",
    title: "自定义直链示例",
    mediaType: "movie",
    description: "详情页也可以补充剧照、预告片、相关推荐和播放地址。你以后把这些字段换成自己的内容就行。",
    posterPath: "https://picsum.photos/seed/forward-home-sintel-poster/600/900",
    detailPoster: "https://picsum.photos/seed/forward-home-sintel-detail-poster/600/900",
    backdropPath: "https://picsum.photos/seed/forward-home-sintel-backdrop/1280/720",
    backdropPaths: [
      "https://picsum.photos/seed/forward-home-still-1/1280/720",
      "https://picsum.photos/seed/forward-home-still-2/1280/720",
      "https://picsum.photos/seed/forward-home-still-3/1280/720"
    ],
    trailers: [
      {
        coverUrl: "https://picsum.photos/seed/forward-home-trailer/640/360",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    releaseDate: "2025-01-01",
    rating: 8.1,
    genreItems: [
      { id: "custom", title: "自定义" },
      { id: "demo", title: "示例" }
    ],
    relatedItems: MOVIES.slice(0, 3),
    link: "sample-sintel"
  };
}

function paginate(items, params) {
  var page = Number(params && params.page ? params.page : 1);
  var count = Number(params && params.count ? params.count : 24);
  var start = (page - 1) * count;
  return items.slice(start, start + count);
}
