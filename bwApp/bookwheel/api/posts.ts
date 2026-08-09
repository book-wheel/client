import type { CursorParams } from "@/types/api";
import type {
  CreatePostCommentResponse,
  DeletePostCommentResponse,
  DeletePostResponse,
  PostCommentListResponse,
  PostDetailResponse,
  PostImagePresignedRequest,
  PostImagePresignedResponse,
  SavePostRequest,
  SavePostResponse,
  TogglePostLikeResponse,
} from "@/types/posts";
import api from "./axios";

export const savePost = (
  isbn: string,
  body: SavePostRequest,
) => {
  return api.post<SavePostResponse>(
    `/posts/${encodeURIComponent(isbn)}/save`,
    body,
  );
};

export const getPostImagePresignedUrls = (
  isbn: string,
  body: PostImagePresignedRequest,
) => {
  return api.post<PostImagePresignedResponse>(
    `/posts/${encodeURIComponent(isbn)}/images/presigned-urls`,
    body,
  );
};

export const getPostDetail = (postId: number) => {
  return api.get<PostDetailResponse>(`/posts/${postId}`);
};

export const deletePost = (postId: number) => {
  return api.delete<DeletePostResponse>(`/posts/${postId}`);
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

export const deletePostComment = (postId: number, commentId: number) => {
  return api.delete<DeletePostCommentResponse>(
    `/posts/${postId}/comments/${commentId}`,
  );
};
