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

export const savePost = (body: SavePostRequest) => {
  return api.post<SavePostResponse>(
    `/posts/${encodeURIComponent(body.isbn)}/save`,
    body,
  );
};
