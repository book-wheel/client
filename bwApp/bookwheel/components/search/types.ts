import type { ImageSourcePropType } from "react-native";

export type BookSearchItem = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  category: "novel" | "essay" | "classic" | "humanities";
  pageCount: number;
  isInterested: boolean;
  image: ImageSourcePropType;
};

export type FilterKey = "category" | "publishedAt" | "volume";

export type FilterOption = {
  value: string;
  label: string;
};

export type DateRange = {
  active: boolean;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
};

export type PageRange = {
  min: string;
  max: string;
};

export type WheelOption = {
  value: number;
  label: string;
};
