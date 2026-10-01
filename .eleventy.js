const sass = require("sass");
const { todayInEastern, eventLastDay, isUpcoming } = require("./src/_utils/eventDates");

function publishedEvents(collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/events/*.md")
    .filter((item) => item.data.published !== false);
}

function lastDayOf(item) {
  return item.data.eventLastDay || eventLastDay({
    date: item.date,
    endDate: item.data.endDate,
  });
}

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  // Icons are linked from the site root in base.njk (e.g. /favicon.ico).
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("events", function (collectionApi) {
    return publishedEvents(collectionApi).sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("upcomingEvents", function (collectionApi) {
    const today = todayInEastern();
    return publishedEvents(collectionApi)
      .filter((item) => isUpcoming({ eventLastDay: lastDayOf(item) }, today))
      .sort((a, b) => a.date - b.date);
  });

  eleventyConfig.addCollection("pastEvents", function (collectionApi) {
    const today = todayInEastern();
    return publishedEvents(collectionApi)
      .filter((item) => !isUpcoming({ eventLastDay: lastDayOf(item) }, today))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("postDate", function (dateValue) {
    const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("htmlDate", function (dateValue) {
    const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("eventDate", function (dateValue) {
    const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(d);
  });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("./src/css/main.css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}; 