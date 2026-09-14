import { getPostDetail } from "@/api/posts";
import type {
  NotificationNavigationPayload,
  NotificationType,
} from "@/types/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// 가입 관련 알림은 모임 홈, 진행 관련 알림은 모임 상태 화면으로 보낸다.
const GROUP_HOME_TYPES = new Set<NotificationType>([
  "GROUP_JOIN_REQUESTED",
  "GROUP_JOIN_APPROVED",
  "GROUP_JOIN_REJECTED",
]);

const GROUP_STATE_TYPES = new Set<NotificationType>([
  "GROUP_STARTED",
  "ROUND_STARTED",
  "ROUND_DEADLINE_APPROACHING",
  "ROUND_FINISHED_UNFINISHED",
  "GROUP_COMPLETED",
  "WHEEL_COMPLETED_BY_PEER",
  "READ_ORDER_ASSIGNED",
]);

const toNonEmptyString = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

const getPathId = (deepLink: string | null, segment: string) => {
  if (!deepLink) return null;

  const match = deepLink.match(new RegExp(`/${segment}/([^/?#]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const openGroupScreen = (groupId: string, screen: "home" | "state") => {
  router.push({
    pathname: `/group/[id]/${screen}`,
    params: { id: groupId, name: "모임" },
  });
};

// 게시글 경로에는 ISBN이 필요하므로 상세 API에서 ISBN을 먼저 가져온다.
const openPost = async (postId: string) => {
  const numericPostId = Number(postId);

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    router.push("/notifications");
    return;
  }

  try {
    const response = await getPostDetail(numericPostId);
    const post = response.data.data;

    if (!response.data.success || !post?.isbn) {
      router.push("/notifications");
      return;
    }

    router.push({
      pathname: "/book-detail/[isbn]/[postId]/post",
      params: { isbn: post.isbn, postId },
    });
  } catch (error) {
    console.error("알림 게시글 이동 실패:", error);
    router.push("/notifications");
  }
};

export const navigateFromNotification = async (
  payload: NotificationNavigationPayload,
) => {
  // 목록 알림과 푸시 알림 모두 같은 이동 규칙을 사용한다.
  const type = payload.type;
  const deepLink = toNonEmptyString(payload.deepLink);
  const groupId =
    toNonEmptyString(payload.groupId) ?? getPathId(deepLink, "groups");

  if (type && GROUP_HOME_TYPES.has(type) && groupId) {
    openGroupScreen(groupId, "home");
    return;
  }

  if (type && GROUP_STATE_TYPES.has(type) && groupId) {
    openGroupScreen(groupId, "state");
    return;
  }

  if (type === "POST_LIKED" || type === "POST_COMMENTED") {
    const postId =
      toNonEmptyString(payload.postId) ?? getPathId(deepLink, "posts");

    if (postId) {
      await openPost(postId);
      return;
    }
  }

  if (type === "REVIEW_LIKED") {
    const isbn = toNonEmptyString(payload.isbn);

    if (isbn) {
      router.push({
        pathname: "/book-detail/[isbn]/review",
        params: { isbn },
      });
      return;
    }
  }

  if (type === "ACCOUNT_DEACTIVATED" || deepLink === "/account/recovery") {
    // 계정 비활성화는 로그인 화면 이동 전에 현재 세션을 명시적으로 끝낸다.
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    router.replace("/auth/login");
    return;
  }

  if (type === "USER_BANNED" || deepLink === "/account/penalties") {
    router.push("/notifications");
    return;
  }

  // 전용 화면이 없는 order·wheels 주소는 모임 상태 화면으로 대체한다.
  if (groupId) {
    const stateScreen =
      deepLink?.includes("/order") || deepLink?.includes("/wheels/");

    openGroupScreen(groupId, stateScreen ? "state" : "home");
    return;
  }

  const postId = getPathId(deepLink, "posts");
  if (postId) {
    await openPost(postId);
    return;
  }

  // 알 수 없는 주소는 존재하지 않는 화면 대신 알림함에 머무르게 한다.
  router.push("/notifications");
};
