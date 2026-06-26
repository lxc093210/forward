WidgetMetadata = {
  id: "my.cms.resource",
  title: "CMS 资源",
  icon: "https://raw.githubusercontent.com/InchStudio/ForwardWidgets/master/icon.png",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  description: "从 TV/AV CMS 资源站清单中为当前影片加载播放资源",
  author: "lxc093210",
  site: "https://github.com/lxc093210/forward",
  globalParams: [
    {
      name: "group",
      title: "资源分组",
      type: "enumeration",
      value: "tv",
      enumOptions: [
        { title: "TV", value: "tv" },
        { title: "AV", value: "av" }
      ]
    },
    {
      name: "sourceIndex",
      title: "源序号",
      type: "count",
      value: "1"
    },
    {
      name: "multiSource",
      title: "是否启用聚合搜索",
      type: "enumeration",
      value: "disabled",
      enumOptions: [
        { title: "启用", value: "enabled" },
        { title: "禁用", value: "disabled" }
      ]
    }
  ],
  modules: [
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: []
    }
  ]
};

var TV_SOURCE_URL = "https://raw.githubusercontent.com/fangkuia/XPTV/main/CMS/TV.json";
var AV_SOURCE_URL = "https://raw.githubusercontent.com/fangkuia/XPTV/main/CMS/AV.json";

async function loadResource(params) {
  var title = params.seriesName || params.title || "";
  if (!title) {
    return [];
  }

  var group = params.group === "av" ? "av" : "tv";
  var sourceIndex = Number(params.sourceIndex || 1);
  var sources = await fetchSources(group);
  if (!sources.length) {
    return [];
  }

  if (params.multiSource === "enabled") {
    return await loadFromMultipleSources(sources, title, params);
  }

  var source = sources[Math.max(1, sourceIndex) - 1] || sources[0];
  return await loadFromSource(source, title, params);
}

async function loadFromMultipleSources(sources, title, params) {
  var results = [];
  var maxSources = Math.min(sources.length, 8);

  for (var i = 0; i < maxSources; i++) {
    try {
      var items = await loadFromSource(sources[i], title, params);
      for (var j = 0; j < items.length; j++) {
        results.push(items[j]);
      }
      if (results.length >= 12) {
        return results.slice(0, 12);
      }
    } catch (error) {
      console.log("[loadFromMultipleSources] 跳过源:", sources[i].name, error.message || error);
    }
  }

  return results;
}

async function loadFromSource(source, title, params) {
  var data = await requestVodApi(source.api, {
    ac: "detail",
    wd: title,
    pg: 1
  });

  var list = data && data.list ? data.list : [];
  if (!list.length) {
    return [];
  }

  var matched = findMatchedVod(list, title, params);
  if (!matched) {
    return [];
  }

  return parsePlayResources(matched, source, params);
}

async function fetchSources(group) {
  var url = group === "av" ? AV_SOURCE_URL : TV_SOURCE_URL;
  var response = await Widget.http.get(url, {
    headers: {
      "Accept": "application/json,text/plain,*/*",
      "User-Agent": "ForwardWidgets/1.0.0"
    }
  });

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
      "Accept": "application/json,text/plain,*/*",
      "User-Agent": "ForwardWidgets/1.0.0"
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

function findMatchedVod(list, title, params) {
  var target = normalizeTitle(title);
  var type = params.type || "";

  var exact = list.find(function (item) {
    return normalizeTitle(item.vod_name || item.name || "") === target;
  });
  if (exact) {
    return exact;
  }

  var contains = list.find(function (item) {
    var itemTitle = normalizeTitle(item.vod_name || item.name || "");
    if (!itemTitle || itemTitle.indexOf(target) < 0) {
      return false;
    }
    if (type === "movie") {
      return guessMediaType(item) === "movie";
    }
    if (type === "tv") {
      return guessMediaType(item) === "tv";
    }
    return true;
  });
  if (contains) {
    return contains;
  }

  return list[0];
}

function parsePlayResources(vod, source, params) {
  var playUrl = String(vod.vod_play_url || "");
  var playFrom = String(vod.vod_play_from || "");
  if (!playUrl) {
    return [];
  }

  var mediaType = params.type || guessMediaType(vod);
  var targetEpisode = mediaType === "movie" ? 1 : Number(params.episode || 1);
  var groups = playUrl.split("$$$");
  var froms = playFrom.split("$$$");
  var resources = [];

  for (var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    var lineName = froms[groupIndex] || "播放";
    var entries = groups[groupIndex].split("#");
    for (var i = 0; i < entries.length; i++) {
      var parsed = parsePlayEntry(entries[i], i + 1);
      if (!parsed.url) {
        continue;
      }
      if (mediaType !== "movie" && !isEpisodeMatch(parsed.title, i + 1, targetEpisode)) {
        continue;
      }

      resources.push({
        name: buildResourceName(source.name, lineName, parsed.title),
        description: cleanText(vod.vod_name || "") + "\n" + cleanText(vod.type_name || ""),
        url: parsed.url
      });
    }
  }

  return resources;
}

function parsePlayEntry(entry, fallbackEpisode) {
  var text = String(entry || "");
  if (!text) {
    return { title: "", url: "" };
  }

  var dollarIndex = text.indexOf("$");
  if (dollarIndex < 0) {
    return {
      title: "第" + fallbackEpisode + "集",
      url: text
    };
  }

  return {
    title: text.slice(0, dollarIndex) || "第" + fallbackEpisode + "集",
    url: text.slice(dollarIndex + 1)
  };
}

function isEpisodeMatch(title, fallbackEpisode, targetEpisode) {
  if (!targetEpisode) {
    return true;
  }

  var text = String(title || "");
  var numbers = text.match(/\d+/g);
  if (numbers && numbers.length) {
    return Number(numbers[numbers.length - 1]) === Number(targetEpisode);
  }

  return Number(fallbackEpisode) === Number(targetEpisode);
}

function buildResourceName(sourceName, lineName, episodeTitle) {
  var name = String(sourceName || "CMS").replace(/\|点播|\|AV/g, "");
  var parts = [name, lineName, episodeTitle].filter(Boolean);
  return parts.join(" · ");
}

function normalizeTitle(title) {
  return String(title || "")
    .replace(/第[一二三四五六七八九十0-9]+季/g, "")
    .replace(/[\s：:·\-\.!！?？\/\\_]/g, "")
    .toLowerCase();
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
