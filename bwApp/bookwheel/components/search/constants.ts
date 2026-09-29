import type { FilterKey, FilterOption, WheelOption } from "./types";

export const minPublishedYear = 1400;
export const maxPublishedYear = 2026;
export const maxPageCount = 2000;
export const wheelItemHeight = 34;

export const yearWheelOptions: WheelOption[] = Array.from(
  { length: maxPublishedYear - minPublishedYear + 1 },
  (_, index) => {
    const year = minPublishedYear + index;

    return { value: year, label: `${year}년` };
  },
);

export const monthWheelOptions: WheelOption[] = Array.from(
  { length: 12 },
  (_, index) => {
    const month = index + 1;

    return { value: month, label: `${month}월` };
  },
);

export const filterLabels: Record<FilterKey, string> = {
  category: "카테고리",
  publishedAt: "출간일",
  volume: "분량",
};

export const categoryOptions: FilterOption[] = [
  { value: "all", label: "전체" },
  { value: "novel", label: "소설" },
  { value: "essay", label: "에세이" },
  { value: "classic", label: "고전" },
  { value: "humanities", label: "인문" },
];

export const filterKeys: FilterKey[] = ["category", "publishedAt", "volume"];
