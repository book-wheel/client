import type { GalleryItem } from "@/components/books/types";
import type { PostGalleryResponse } from "@/types/posts";

const galleryImage = require("@/assets/images/comment.png");

export const mockBookGalleryResponse: PostGalleryResponse = {
  success: true,
  data: {
    content: Array.from({ length: 18 }, (_, index) => {
      const postId = index + 1;

      return {
        postId,
        isbn: "9788936434120",
        thumbnailUrl: `https://cdn.example.com/gallery/${postId}-1.jpg`,
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
    id: String(item.postId),
    isbn: item.isbn,
    image: galleryImage,
    extraCount: item.imageCount > 1 ? item.imageCount - 1 : undefined,
  }));
