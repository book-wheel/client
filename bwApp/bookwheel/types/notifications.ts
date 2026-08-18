import type { ApiResponse, NumberPage } from "@/types/api";

// 백엔드 NotificationType과 동일하게 유지한다.
export type NotificationType =
  | "GROUP_JOIN_REQUESTED"
  | "GROUP_JOIN_APPROVED"
  | "GROUP_JOIN_REJECTED"
  | "GROUP_STARTED"
  | "ROUND_STARTED"
  | "ROUND_DEADLINE_APPROACHING"
  | "ROUND_FINISHED_UNFINISHED"
  | "GROUP_COMPLETED"
  | "WHEEL_COMPLETED_BY_PEER"
  | "READ_ORDER_ASSIGNED"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "REVIEW_LIKED"
  | "USER_BANNED"
  | "ACCOUNT_DEACTIVATED";

export type NotificationCategory =
  | "GROUP"
  | "ROUND"
  | "COMMUNITY"
  | "REPORT"
  | "ACCOUNT";

// 알림 종류마다 필요한 값만 선택적으로 들어온다.
export type NotificationData = {
  notificationId?: number | string;
  type?: NotificationType;
  deepLink?: string;
  groupId?: number | string;
  applicantUserPK?: number | string;
  status?: string;
  postId?: number | string;
  likerUserPK?: number | string;
  commenterUserPK?: number | string;
  commentPreview?: string;
  reviewId?: number | string;
  isbn?: string;
  roundNumber?: number | string;
  daysLeft?: number | string;
  wheelStateId?: number | string;
  completedUserPK?: number | string;
  banType?: string;
  reasonMessage?: string;
  permanent?: boolean | string;
  releaseDate?: string;
  mail?: string;
  [key: string]: unknown;
};

export type NotificationItem = {
  id: number;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  deepLink: string | null;
  data: NotificationData | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

export type NotificationListResponse = ApiResponse<
  NumberPage<NotificationItem>
>;

export type UnreadNotificationCount = {
  unreadCount: number;
};

export type UnreadNotificationCountResponse =
  ApiResponse<UnreadNotificationCount>;

export type NotificationPreferences = {
  groupEnabled: boolean;
  roundEnabled: boolean;
  communityEnabled: boolean;
  pushEnabled: boolean;
  expoPushToken: string | null;
};

export type UpdateNotificationPreferencesRequest = Partial<
  Pick<
    NotificationPreferences,
    | "groupEnabled"
    | "roundEnabled"
    | "communityEnabled"
    | "pushEnabled"
    | "expoPushToken"
  >
>;

export type NotificationPreferencesResponse =
  ApiResponse<NotificationPreferences>;

export type MarkNotificationReadResponse = ApiResponse<null>;
export type MarkAllNotificationsReadResponse = ApiResponse<number>;

export type NotificationNavigationPayload = NotificationData & {
  type?: NotificationType;
  deepLink?: string;
};
