import type { BookSearchItem, FilterKey, FilterOption, WheelOption } from "./types";

const bookImage = require("@/assets/images/book.png");

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

export const searchBooks: BookSearchItem[] = [
  {
    isbn: "1",
    title: "불편한 편의점",
    author: "김호연",
    publisher: "나무옆의자",
    publishedAt: "2021-04-20",
    category: "novel",
    pageCount: 268,
    isInterested: false,
    image: bookImage,
  },
  {
    isbn: "2",
    title: "불편한 편의점2",
    author: "김호연",
    publisher: "나무옆의자",
    publishedAt: "2022-08-10",
    category: "novel",
    pageCount: 320,
    isInterested: true,
    image: bookImage,
  },
  {
    isbn: "9791161571188",
    title: "내 남편을 팝니다",
    author: "고요한",
    publisher: "나무옆의자",
    publishedAt: "2023-06-30",
    category: "novel",
    pageCount: 236,
    isInterested: false,
    image: bookImage,
  },
  {
    isbn: "4",
    title: "괴테는 모든 것을 말했다",
    author: "구병모",
    publisher: "창비",
    publishedAt: "2024-09-10",
    category: "humanities",
    pageCount: 356,
    isInterested: true,
    image: bookImage,
  },
  {
    isbn: "5",
    title: "어린왕자",
    author: "앙투안 드 생텍쥐페리",
    publisher: "열린책들",
    publishedAt: "2015-10-20",
    category: "classic",
    pageCount: 160,
    isInterested: false,
    image: bookImage,
  },
  {
    isbn: "6",
    title: "아무튼, 메모",
    author: "정혜윤",
    publisher: "위고",
    publishedAt: "2020-03-05",
    category: "essay",
    pageCount: 184,
    isInterested: false,
    image: bookImage,
  },
];
