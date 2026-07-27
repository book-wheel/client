import type { GalleryItem } from "@/components/books/types";
import type { BookGalleryResponse } from "@/types/books";

const galleryImage = require("@/assets/images/comment.png");

export const mockBookGalleryResponse: BookGalleryResponse = {
  success: true,
  data: {
    content: Array.from({ length: 18 }, (_, index) => {
      const galleryId = index + 1;

      return {
        galleryId,
        bookId: 1,
        thumbnailUrl: `https://cdn.example.com/gallery/${galleryId}-1.jpg`,
        imageCount: index % 3 === 0 ? 4 : 1,
        createdAt: "2026-05-09T12:30:00Z",
      };
    }),
    size: 18,
    totalElements: 41,
    hasNext: true,
    nextCursor: "eyJnYWxsZXJ5SWQiOjJ9",
  },
  error: null,
};

export const mockGalleryItems: GalleryItem[] =
  (mockBookGalleryResponse.data?.content ?? []).map((item) => ({
    id: String(item.galleryId),
    image: galleryImage,
    extraCount: item.imageCount > 1 ? item.imageCount - 1 : undefined,
  }));
