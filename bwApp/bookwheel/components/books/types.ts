import type { ImageSourcePropType } from "react-native";

export type BookItem = {
  id: string;
  title: string;
  author: string;
  image: ImageSourcePropType;
};

export type GalleryItem = {
  id: string;
  isbn: string;
  image?: ImageSourcePropType;
  extraCount?: number;
};