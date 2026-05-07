import {
  differenceInDays,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  addDays,
  addMonths,
} from "date-fns";
import { ViewMode } from "@/types/gantt";

/** Returns left % position of a date within the view range */
export function getPositionPercent(
  date: Date,
  viewStart: Date,
  viewEnd: Date
): number {
  const total = differenceInDays(viewEnd, viewStart) || 1;
  const offset = differenceInDays(date, viewStart);
  return Math.max(0, Math.min(100, (offset / total) * 100));
}

/** Returns width % of a task bar within the view range */
export function getWidthPercent(
  taskStart: Date,
  taskEnd: Date,
  viewStart: Date,
  viewEnd: Date
): number {
  const total = differenceInDays(viewEnd, viewStart) || 1;
  const clampedStart = taskStart < viewStart ? viewStart : taskStart;
  const clampedEnd = taskEnd > viewEnd ? viewEnd : taskEnd;
  const width = differenceInDays(clampedEnd, clampedStart);
  return Math.max(0.5, (width / total) * 100); // min 0.5% to stay visible
}

/** Build header columns for the timeline based on view mode */
export function buildHeaderColumns(
  viewStart: Date,
  viewEnd: Date,
  viewMode: ViewMode
): Array<{ label: string; start: Date; widthPercent: number }> {
  if (viewMode === "month") {
    const months = eachMonthOfInterval({ start: viewStart, end: viewEnd });
    return months.map((m) => {
      const mStart = m < viewStart ? viewStart : m;
      const mEnd = endOfMonth(m) > viewEnd ? viewEnd : endOfMonth(m);
      return {
        label: format(m, "MMM yyyy"),
        start: mStart,
        widthPercent: getWidthPercent(mStart, mEnd, viewStart, viewEnd),
      };
    });
  }

  if (viewMode === "week") {
    const weeks = eachWeekOfInterval({ start: viewStart, end: viewEnd });
    return weeks.map((w) => {
      const wStart = w < viewStart ? viewStart : w;
      const wEnd = addDays(w, 6) > viewEnd ? viewEnd : addDays(w, 6);
      return {
        label: format(w, "MMM dd"),
        start: wStart,
        widthPercent: getWidthPercent(wStart, wEnd, viewStart, viewEnd),
      };
    });
  }

  // Day mode: group by month, show day numbers as sub-header
  const months = eachMonthOfInterval({ start: viewStart, end: viewEnd });
  return months.map((m) => {
    const mStart = m < viewStart ? viewStart : m;
    const mEnd = endOfMonth(m) > viewEnd ? viewEnd : endOfMonth(m);
    return {
      label: format(m, "MMMM yyyy"),
      start: mStart,
      widthPercent: getWidthPercent(mStart, mEnd, viewStart, viewEnd),
    };
  });
}

/** Extend date range by padding months for better UX */
export function buildViewRange(
  tasks: Array<{ start: string; end: string }>,
  milestones: Array<{ date: string }>
): { viewStart: Date; viewEnd: Date } {
  const allDates = [
    ...tasks.map((t) => new Date(t.start)),
    ...tasks.map((t) => new Date(t.end)),
    ...milestones.map((m) => new Date(m.date)),
  ];
  const minDate = allDates.reduce((a, b) => (a < b ? a : b));
  const maxDate = allDates.reduce((a, b) => (a > b ? a : b));
  return {
    viewStart: startOfMonth(addMonths(minDate, -1)),
    viewEnd: endOfMonth(addMonths(maxDate, 1)),
  };
}
