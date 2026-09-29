const { eventLastDay } = require("../_utils/eventDates");

module.exports = {
  layout: "event.njk",
  published: true,
  eleventyComputed: {
    eventLastDay(data) {
      return eventLastDay(data);
    },
    permalink(data) {
      if (data.published === false) return false;
      return `/events/${data.page.fileSlug}/`;
    },
    eleventyExcludeFromCollections(data) {
      return data.published === false;
    },
  },
};
