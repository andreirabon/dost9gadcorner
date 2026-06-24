function formatPublishedAt(raw) {
  if (!raw) {
    return null;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }
  return date.toLocaleString(void 0, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}
export {
  formatPublishedAt as f
};
