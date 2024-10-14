import { DateTime } from "luxon";

export function formatDate(date: Date) {
  console.log(date);
  return DateTime.fromJSDate(date).toFormat("MMMM yyyy");
}