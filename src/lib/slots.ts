import { siteConfig } from "@/config/site";

export type BookableDay = {
  key: string;
  date: Date;
};

/** YYYY-MM-DD in local timezone */
export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getBookableDays(
  count = siteConfig.bookingDaysAhead,
  lastOrderHour = siteConfig.lastOrderHour,
): BookableDay[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (now.getHours() >= lastOrderHour) {
    start.setDate(start.getDate() + 1);
  }

  const days: BookableDay[] = [];
  const cursor = new Date(start);
  while (days.length < count) {
    days.push({ key: toDayKey(cursor), date: new Date(cursor) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function formatDayLabel(
  date: Date,
  locale: string,
): { weekday: string; dayMonth: string } {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    date,
  );
  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
  return { weekday, dayMonth };
}
