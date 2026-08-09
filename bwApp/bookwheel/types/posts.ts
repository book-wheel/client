import type {
    ApiResponse,
    CursorPage,
    CursorParams,
} from "@/types/api";

export type PostImagePresignedRequest = {
    fileExtensions: string[];
};

export type PostImagePresignedData = {
    presignedUrls: {
        presignedUrl: string;
        objectKey: string;
    }[];
};

export type PostImagePresignedResponse = ApiResponse<PostImagePresignedData>;

export type SavePostRequest = {
  isbn: string;
  content: string;
  objectKeys: string[];
  groupId?: string | null;
};

export type SavePostData = {
  postId: number;
  isbn: string;
  content: string;
  objectKeys: string[];
  createdAt: string;
};

export type SavePostResponse = ApiResponse<SavePostData>;

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
  isMine: boolean;
  createdAt: string;
};

export type PostDetailResponse = ApiResponse<PostDetailData>;
// 서버의 게시글 삭제 응답은 별도 데이터 없이 data: null을 반환한다.
export type DeletePostResponse = ApiResponse<null>;
export type TogglePostLikeResponse = ApiResponse<string>;

export type PostCommentData = {
  commentId: number;
  postId: number;
  author: string;
  profileImageUrl: string | null;
  content: string;
  isMine: boolean;
  createdAt: string;
};

export type PostCommentListResponse = ApiResponse<CursorPage<PostCommentData>>;
export type CreatePostCommentResponse = ApiResponse<string>;
// 서버의 댓글 삭제 응답은 별도 데이터 없이 data: null을 반환한다.
export type DeletePostCommentResponse = ApiResponse<null>;

export type PostGalleryContent = {
  postId: number;
  isbn: string;
  thumbnailUrl: string | null;
  imageCount: number;
  createdAt: string;
};

export type PostGalleryPage = CursorPage<PostGalleryContent>;
export type PostGalleryResponse = ApiResponse<PostGalleryPage>;
export type PostGalleryParams = CursorParams;
