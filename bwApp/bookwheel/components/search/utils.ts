import {
  categoryOptions,
  filterLabels,
  maxPageCount,
  maxPublishedYear,
  minPublishedYear,
} from "./constants";
import type { BookSearchItem, DateRange, FilterKey, PageRange } from "./types";

export const getSingleParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const sanitizeNumber = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export const getTodayDateParts = () => {
  const today = new Date();
  const year = Math.min(
    Math.max(today.getFullYear(), minPublishedYear),
    maxPublishedYear,
  );
  const month = today.getMonth() + 1;
  const day = Math.min(today.getDate(), getDaysInMonth(year, month));

  return { year, month, day };
};

export const createDefaultDateRange = (): DateRange => {
  const todayDateParts = getTodayDateParts();

  return {
    active: false,
    startYear: todayDateParts.year,
    startMonth: todayDateParts.month,
    startDay: todayDateParts.day,
    endYear: todayDateParts.year,
    endMonth: todayDateParts.month,
    endDay: todayDateParts.day,
  };
};

export const createEmptyPageRange = (): PageRange => ({
  min: "",
  max: "",
});

export const hasDateRange = (range: DateRange) => range.active;

export const hasPageRange = (range: PageRange) =>
  range.min.length > 0 || range.max.length > 0;

export const formatDateLabel = (year: number, month: number, day: number) =>
  `${year}년 ${month}월 ${day}일`;

export const clampDateRangeDays = (range: DateRange): DateRange => ({
  ...range,
  startDay: Math.min(
    range.startDay,
    getDaysInMonth(range.startYear, range.startMonth),
  ),
  endDay: Math.min(range.endDay, getDaysInMonth(range.endYear, range.endMonth)),
});

export const getFilterChipLabel = (
  key: FilterKey,
  categoryFilter: string,
  publishedAtRange: DateRange,
  pageRange: PageRange,
) => {
  if (key === "category") {
    if (categoryFilter === "all") return filterLabels.category;

    return (
      categoryOptions.find((option) => option.value === categoryFilter)?.label ??
      filterLabels.category
    );
  }

  if (key === "publishedAt") {
    return hasDateRange(publishedAtRange)
      ? `${publishedAtRange.startYear}~${publishedAtRange.endYear}`
      : filterLabels.publishedAt;
  }

  if (!hasPageRange(pageRange)) return filterLabels.volume;
  if (pageRange.min && pageRange.max) return `${pageRange.min}~${pageRange.max}쪽`;
  if (pageRange.min) return `${pageRange.min}쪽~`;

  return `~${pageRange.max}쪽`;
};

const getDateTime = (
  year: number,
  month: number,
  day: number,
  endOfDay = false,
) =>
  new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  ).getTime();

export const matchesPublishedAtFilter = (
  book: BookSearchItem,
  range: DateRange,
) => {
  if (!range.active) return true;

  const bookDate = new Date(book.publishedAt).getTime();
  const startDate = getDateTime(
    range.startYear,
    range.startMonth,
    range.startDay,
  );
  const endDate = getDateTime(range.endYear, range.endMonth, range.endDay);
  const minDate = Math.min(startDate, endDate);
  const maxDate =
    startDate <= endDate
      ? getDateTime(range.endYear, range.endMonth, range.endDay, true)
      : getDateTime(range.startYear, range.startMonth, range.startDay, true);

  return bookDate >= minDate && bookDate <= maxDate;
};

export const matchesVolumeFilter = (book: BookSearchItem, range: PageRange) => {
  const min = range.min ? Number(range.min) : null;
  const max = range.max ? Number(range.max) : null;

  return (
    (min === null || book.pageCount >= min) &&
    (max === null || book.pageCount <= max)
  );
};

export const sanitizePageCount = (value: string) => {
  const sanitized = sanitizeNumber(value, 4);

  if (!sanitized) return "";

  return String(Math.min(Number(sanitized), maxPageCount));
};
