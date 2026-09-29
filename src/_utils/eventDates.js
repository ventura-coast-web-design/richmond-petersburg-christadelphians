// Date-only CMS values are stored as UTC midnight. Compare them to the
// calendar day in Richmond (Eastern) so an event stays "upcoming" through
// the day it ends.
function calendarDay(dateValue) {
  if (!dateValue) return "";
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayInEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function eventLastDay(data) {
  const start = calendarDay(data.date || data.page?.date);
  const end = calendarDay(data.endDate);
  if (start && end) return end > start ? end : start;
  return start || end;
}

function isUpcoming(data, today = todayInEastern()) {
  const last = data.eventLastDay || eventLastDay(data);
  return Boolean(last) && last >= today;
}

module.exports = {
  calendarDay,
  todayInEastern,
  eventLastDay,
  isUpcoming,
};
