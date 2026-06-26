WidgetMetadata = {
  id: "my.home",
  title: "我的主页",
  icon: "https://raw.githubusercontent.com/InchStudio/ForwardWidgets/master/icon.png",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "个人自用首页模块",
  author: "lxc093210",
  site: "https://github.com/lxc093210/forward",
  modules: [
    {
      id: "loadList",
      title: "首页推荐",
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
  ]
};

var VIDEO_ITEMS = [
  {
    id: 27205,
    type: "tmdb",
    title: "Inception",
    mediaType: "movie"
  },
  {
    id: 603,
    type: "tmdb",
    title: "The Matrix",
    mediaType: "movie"
  },
  {
    id: 550,
    type: "tmdb",
    title: "Fight Club",
    mediaType: "movie"
  },
  {
    id: 157336,
    type: "tmdb",
    title: "Interstellar",
    mediaType: "movie"
  },
  {
    id: 155,
    type: "tmdb",
    title: "The Dark Knight",
    mediaType: "movie"
  },
  {
    id: 19995,
    type: "tmdb",
    title: "Avatar",
    mediaType: "movie"
  },
  {
    id: 496243,
    type: "tmdb",
    title: "Parasite",
    mediaType: "movie"
  },
  {
    id: 98,
    type: "tmdb",
    title: "Gladiator",
    mediaType: "movie"
  }
];

async function loadList(params) {
  var page = Number(params.page || 1);
  var count = Number(params.count || 24);
  var start = (page - 1) * count;
  return VIDEO_ITEMS.slice(start, start + count);
}
