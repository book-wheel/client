import type { ApiResponse } from "@/types/api";
import api from "./axios";

type SavePostRequest = {
  isbn: string;
  content: string;
  objectKeys: string[];
};

type SavePostData = {
  postId: number;
  isbn: string;
  content: string;
  objectKeys: string[];
  createdAt: string;
};

type SavePostResponse = ApiResponse<SavePostData>;

export type PostDetailData = {
  postId: number;
  isbn: string;
  author: string;
  profileImageUrl: string | null;
  groupName: string | null;
  title: string | null;
  content: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  createdAt: string;
};

type PostDetailResponse = ApiResponse<PostDetailData>;
type TogglePostLikeResponse = ApiResponse<string>;

export const savePost = (body: SavePostRequest) => {
  return api.post<SavePostResponse>(
    `/posts/${encodeURIComponent(body.isbn)}/save`,
    body,
  );
};

export const getPostDetail = (postId: number) => {
  return api.get<PostDetailResponse>(`/posts/${postId}`);
};

export const togglePostLike = (postId: number) => {
  return api.post<TogglePostLikeResponse>(`/posts/${postId}/likes`);
};
