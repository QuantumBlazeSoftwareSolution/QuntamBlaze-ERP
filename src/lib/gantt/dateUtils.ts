import {
  addDays,
  differenceInDays,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";

export function getDaysInPeriod(start: Date, end: Date) {
  return differenceInDays(end, start) + 1;
}

export function getPositionFromDate(date: Date, startDate: Date, dayWidth: number) {
  const daysDiff = differenceInDays(date, startDate);
  return daysDiff * dayWidth;
}

export function generateTimelineDays(start: Date, end: Date) {
  return eachDayOfInterval({ start, end });
}

export function getTaskWidth(start: Date, end: Date, dayWidth: number) {
  const days = getDaysInPeriod(start, end);
  return days * dayWidth;
}
