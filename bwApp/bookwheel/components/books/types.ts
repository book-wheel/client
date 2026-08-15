import type { ImageSourcePropType } from "react-native";

export type BookItem = {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  image?: ImageSourcePropType;
};

export type GalleryItem = {
  id: string;
  isbn: string;
  image?: ImageSourcePropType;
  extraCount?: number;
};

export type RecommendBookItem = {
  isbn: string;
  title: string;
  author: string;
  image?: ImageSourcePropType;
  likeCount: number;
  isInterested: boolean;
  review: {
    reviewerName: string;
    comment: string;
  } | null;
};
