const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(date: Date) {
  return formatter.format(date);
}
