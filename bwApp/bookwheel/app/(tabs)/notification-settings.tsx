import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getApiErrorMessage } from "@/api/axios";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/api/notifications";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "@/types/notifications";

const ROWS: {
  key: keyof Pick<
    NotificationPreferences,
    | "groupEnabled"
    | "roundEnabled"
    | "communityEnabled"
    | "chatEnabled"
    | "pushEnabled"
  >;
  label: string;
}[] = [
  { key: "groupEnabled", label: "초대 알림" },
  { key: "roundEnabled", label: "독서 일정 알림" },
  { key: "communityEnabled", label: "커뮤니티 알림" },
  { key: "chatEnabled", label: "채팅 알림" },
  { key: "pushEnabled", label: "푸시 알림" },
];

export default function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotificationPreferences();
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message ?? "알림 설정을 불러오지 못했습니다.",
        );
      }
      setPreferences(response.data.data);
    } catch (error) {
      Alert.alert(
        "알림 설정 조회 실패",
        getApiErrorMessage(error, "알림 설정을 불러오지 못했습니다."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const toggle = async (
    key: keyof UpdateNotificationPreferencesRequest,
    value: boolean,
  ) => {
    if (!preferences || savingKey) return;
    const previous = preferences;
    setPreferences({ ...preferences, [key]: value });
    setSavingKey(key);

    try {
      const response = await updateNotificationPreferences({ [key]: value });
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message ?? "알림 설정을 저장하지 못했습니다.",
        );
      }
      setPreferences(response.data.data);
    } catch (error) {
      setPreferences(previous);
      Alert.alert(
        "저장 실패",
        getApiErrorMessage(error, "알림 설정을 저장하지 못했습니다."),
      );
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#E4A54E" />
        </View>
      ) : !preferences ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>알림 설정을 불러오지 못했어요.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>알림 설정</Text>
          {ROWS.map((row) => (
            <View key={row.key} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Toggle
                value={preferences[row.key]}
                disabled={Boolean(savingKey)}
                onValueChange={(value) => void toggle(row.key, value)}
              />
            </View>
          ))}
          <Text style={styles.helpText}>
            이 설정은 현재 모임뿐 아니라 내 계정의 전체 알림에 적용됩니다.
          </Text>
        </View>
      )}
    </View>
  );
}

function Toggle({
  value,
  disabled,
  onValueChange,
}: {
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.toggle,
        value ? styles.toggleOn : styles.toggleOff,
        disabled && styles.toggleDisabled,
      ]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 28, paddingTop: 30 },
  title: {
    marginBottom: 18,
    color: "#513A11",
    fontSize: 17,
    fontWeight: "800",
  },
  row: {
    height: 57,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CDBD9E",
  },
  label: { color: "#513A11", fontSize: 13, fontWeight: "600" },
  toggle: {
    width: 58,
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
    paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: "#00C91E" },
  toggleOff: { backgroundColor: "#BDBDBD" },
  toggleDisabled: { opacity: 0.55 },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  toggleThumbOn: { alignSelf: "flex-end" },
  helpText: { marginTop: 20, color: "#A99E8A", fontSize: 11, lineHeight: 17 },
  errorText: { color: "#513A11", fontSize: 14 },
});
