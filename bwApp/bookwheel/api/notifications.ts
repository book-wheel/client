import api from "@/api/axios";
import type { PageParams } from "@/types/api";
import type {
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  NotificationListResponse,
  NotificationPreferencesResponse,
  UnreadNotificationCountResponse,
  UpdateNotificationPreferencesRequest,
} from "@/types/notifications";

export const getNotifications = (params?: PageParams) => {
  return api.get<NotificationListResponse>("/notifications", { params });
};

export const getUnreadNotificationCount = () => {
  return api.get<UnreadNotificationCountResponse>(
    "/notifications/unread-count",
  );
};

export const markNotificationRead = (notificationId: number) => {
  return api.patch<MarkNotificationReadResponse>(
    `/notifications/${notificationId}/read`,
  );
};

export const markAllNotificationsRead = () => {
  return api.patch<MarkAllNotificationsReadResponse>(
    "/notifications/read-all",
  );
};

export const getNotificationPreferences = () => {
  return api.get<NotificationPreferencesResponse>(
    "/notifications/preferences",
  );
};

export const updateNotificationPreferences = (
  body: UpdateNotificationPreferencesRequest,
) => {
  return api.put<NotificationPreferencesResponse>(
    "/notifications/preferences",
    body,
  );
};
