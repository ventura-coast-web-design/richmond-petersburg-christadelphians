const fs = require("fs");
const path = require("path");
const EleventyFetch = require("@11ty/eleventy-fetch");

require("dotenv").config();

const CHANNEL_ID = "UCNhfznzhfLYfHUtsxivtciQ";

function loadManualVideos() {
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

function normalizeManualVideo(raw, index) {
  const fromUrl = youtubeIdFromUrl(raw.url);
  const id = raw.id || fromUrl || `manual-${index}`;
  const url =
    raw.url ||
    (fromUrl ? `https://www.youtube.com/shorts/${fromUrl}` : "");
  let thumbnail = raw.thumbnail;
  if (!thumbnail && (raw.id || fromUrl)) {
    const vid = raw.id || fromUrl;
    thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  return {
    id,
    title: raw.title || "Video",
    thumbnail: thumbnail || "",
    duration: raw.duration || "",
    url,
  };
}

function parseDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function placeholderVideos() {
  const id = "dQw4w9WgXcQ";
  const base = {
    id,
    thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    url: `https://www.youtube.com/shorts/${id}`,
  };
  return [
    { ...base, title: "Biblically Accurate Angels, Explained", duration: "5:45" },
    { ...base, title: "A Beginner's Guide to Bible Prophecy", duration: "6:41" },
    { ...base, title: "What is Faith?", duration: "4:35" },
    { ...base, title: "God's Involvement in Suffering | Part 3", duration: "4:13" },
    { ...base, title: "God's Purpose in Suffering | Part 2", duration: "5:22" },
  ];
}

async function fetchYouTubeVideos() {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    console.warn(
      "⚠️  YOUTUBE_API_KEY not set. Using placeholder data for Bible Unlocked videos."
    );
    return placeholderVideos();
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video&videoDuration=short`;

    const searchData = await EleventyFetch(searchUrl, {
      duration: "1h",
      type: "json",
    });

    if (!searchData.items || searchData.items.length === 0) {
      console.warn("⚠️  No videos found from Bible Unlocked channel");
      return [];
    }

    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails`;

    const videosData = await EleventyFetch(videosUrl, {
      duration: "1h",
      type: "json",
    });

    const videos = videosData.items.map((video) => ({
      id: video.id,
      title: video.snippet.title,
      thumbnail:
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.default?.url,
      duration: parseDuration(video.contentDetails.duration),
      url: `https://www.youtube.com/shorts/${video.id}`,
    }));

    console.log(`✅ Fetched ${videos.length} videos from Bible Unlocked`);
    return videos;
  } catch (error) {
    console.error("❌ Error fetching Bible Unlocked videos:", error.message);
    return [];
  }
}

module.exports = async function () {
  const manualRaw = loadManualVideos();
  const manualVideos = manualRaw
    .map(normalizeManualVideo)
    .filter((v) => v.url && v.url !== "#");

  const manualIds = new Set(manualVideos.map((v) => String(v.id)));
  const fromYouTube = await fetchYouTubeVideos();
  const rest = fromYouTube.filter((v) => !manualIds.has(String(v.id)));

  return [...manualVideos, ...rest];
};
