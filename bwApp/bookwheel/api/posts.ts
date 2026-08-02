import type { CursorParams } from "@/types/api";
import type {
  CreatePostCommentResponse,
  PostCommentListResponse,
  PostDetailResponse,
  SavePostRequest,
  SavePostResponse,
  TogglePostLikeResponse,
} from "@/types/posts";
import api from "./axios";

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

export const getPostComments = (
  postId: number,
  params?: CursorParams,
) => {
  return api.get<PostCommentListResponse>(`/posts/${postId}/comments`, {
    params,
  });
};

export const createPostComment = (postId: number, content: string) => {
  return api.post<CreatePostCommentResponse>(`/posts/${postId}/comments`, {
    content,
  });
};
