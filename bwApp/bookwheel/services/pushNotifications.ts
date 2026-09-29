import { updateNotificationPreferences } from "@/api/notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_NOTIFICATION_CHANNEL_ID = "default";

// Service: 화면 상태와 분리해 OS 권한·Expo 토큰 등록만 담당한다.
// 앱을 보고 있을 때 온 알림도 배너와 소리로 표시한다.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// EAS 빌드 설정을 우선 사용하고, 로컬에서는 환경 변수도 허용한다.
const getExpoProjectId = () => {
  const configuredProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;

  return (
    configuredProjectId ??
    extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    null
  );
};

// 발급받은 Expo 토큰을 백엔드의 현재 사용자 설정에 저장한다.
const saveExpoPushToken = async (expoPushToken: string) => {
  const response = await updateNotificationPreferences({ expoPushToken });

  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? "푸시 토큰 등록에 실패했습니다.",
    );
  }
};

// 로그아웃 전에 현재 사용자와 이 기기의 푸시 토큰 연결을 끊는다.
export const unregisterPushNotifications = async () => {
  await saveExpoPushToken("");
};

export const registerForPushNotifications = async () => {
  if (Platform.OS === "web") return null;

  // Android는 알림 권한 요청 전에 채널을 먼저 만들어야 한다.
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      ANDROID_NOTIFICATION_CHANNEL_ID,
      {
        name: "기본 알림",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#E4A54E",
      },
    );
  }

  if (!Device.isDevice) {
    console.info("원격 푸시 알림은 실제 기기에서만 등록할 수 있습니다.");
    return null;
  }

  // 프로젝트 ID가 있어야 이 앱 전용 Expo 토큰을 발급할 수 있다.
  const projectId = getExpoProjectId();

  if (!projectId) {
    console.warn(
      "Expo 프로젝트 ID가 없어 푸시 토큰을 등록하지 못했습니다. " +
        "EXPO_PUBLIC_EAS_PROJECT_ID 또는 extra.eas.projectId를 설정해주세요.",
    );
    return null;
  }

  // 권한이 없으면 한 번 요청한다.
  const currentPermissions = await Notifications.getPermissionsAsync();
  let permissionStatus = currentPermissions.status;

  if (permissionStatus !== Notifications.PermissionStatus.GRANTED) {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    permissionStatus = requestedPermissions.status;
  }

  if (permissionStatus !== Notifications.PermissionStatus.GRANTED) {
    // 사용자가 권한을 끄면 서버에 남은 이전 기기 토큰도 해제한다.
    await saveExpoPushToken("");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  await saveExpoPushToken(token.data);

  return token.data;
};
