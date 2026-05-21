const fs = require("fs");
const path = require("path");

function loadCmsVideos() {
  try {
    const filePath = path.join(__dirname, "manualVideos.json");
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed.videos) ? parsed.videos : [];
  } catch {
    return [];
  }
}

function youtubeIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function normalizeVideo(raw, index) {
  const fromUrl = youtubeIdFromUrl(raw.url);
  const id = raw.id || fromUrl || `video-${index}`;
  const url =
    raw.url ||
    (fromUrl ? `https://www.youtube.com/watch?v=${fromUrl}` : "");
  let thumbnail = raw.thumbnail;
  if (!thumbnail && (raw.id || fromUrl)) {
    const vid = raw.id || fromUrl;
    thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  const date = raw.date ? new Date(raw.date) : null;
  return {
    id,
    title: raw.title || "Video",
    thumbnail: thumbnail || "",
    duration: raw.duration || "",
    url,
    date: date && !Number.isNaN(date.getTime()) ? date : null,
    sortIndex: index,
  };
}

function sortVideos(videos) {
  return [...videos].sort((a, b) => {
    const aTime = a.date ? a.date.getTime() : null;
    const bTime = b.date ? b.date.getTime() : null;
    if (aTime != null && bTime != null) return bTime - aTime;
    if (aTime != null) return -1;
    if (bTime != null) return 1;
    return b.sortIndex - a.sortIndex;
  });
}

module.exports = function () {
  const all = sortVideos(
    loadCmsVideos()
      .map(normalizeVideo)
      .filter((v) => v.url && v.url !== "#")
  );

  return {
    all,
    recent: all.slice(0, 3),
  };
};
