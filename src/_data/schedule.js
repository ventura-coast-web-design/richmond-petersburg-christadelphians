const fs = require("fs");
const path = require("path");

const CONTACT_HEADINGS = {
  Sunday: "Sunday Morning",
  Thursday: "Thursday Evening",
  Wednesday: "Wednesday Evening",
};

const DAY_ORDER = ["Sunday", "Thursday", "Wednesday"];

function loadRaw() {
  const filePath = path.join(__dirname, "schedule.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function heroLabel(title) {
  return title.endsWith(":") ? title : `${title}:`;
}

function buildFromServices(services) {
  const heroSchedule = services.map((s) => ({
    label: heroLabel(s.title),
    time: s.time,
  }));

  const homepageServices = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    timeLine: `${s.day} ${s.time}`,
    description: s.description || "",
  }));

  const footerServiceTimes = services.map((s) => ({
    title: s.title,
    time: s.footerTime || s.time,
  }));

  const visitEventTimes = services.map((s) => ({ time: s.time }));

  const grouped = new Map();
  for (const s of services) {
    const day = s.day || "Other";
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day).push({
      label: s.title,
      time: s.footerTime || s.time,
    });
  }

  const sortedDays = [...grouped.keys()].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  const contactGroups = sortedDays.map((day) => ({
    heading: CONTACT_HEADINGS[day] || day,
    items: grouped.get(day),
  }));

  return {
    services,
    heroSchedule,
    homepageServices,
    footerServiceTimes,
    visitEventTimes,
    contactGroups,
  };
}

module.exports = function () {
  const raw = loadRaw();
  if (Array.isArray(raw.services) && raw.services.length) {
    return buildFromServices(raw.services);
  }
  return raw;
};
