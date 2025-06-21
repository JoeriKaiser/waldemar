import { DateTime } from "luxon";

export function formatDate(date: Date) {
  return DateTime.fromJSDate(date).toFormat("MMMM yyyy");
}
