import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { getApiErrorMessage } from "@/api/axios";
import { getGroupDetail } from "@/api/group";
import {
  createFutureSchedule,
  createSchedule,
  getGroupSchedule,
} from "@/api/group-dashboard";
import GroupSettingsTabs from "@/components/group/settings/GroupSettingsTabs";
import type { GroupScheduleData } from "@/types/groupDashboard";

const COLORS = {
  brown: "#513A11",
  amber: "#E4A54E",
  cream: "#FFF7DF",
  muted: "#A99E8A",
  line: "#DDD0B7",
};

type PickerTarget = "start" | "end" | null;

function toDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayDate(value: Date) {
  return toIsoDate(value).replaceAll("-", " / ");
}

export default function ScheduleSettings() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [schedule, setSchedule] = useState<GroupScheduleData | null>(null);
  const [vacationStart, setVacationStart] = useState(new Date());
  const [vacationEnd, setVacationEnd] = useState(new Date());
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [targetMemberCount, setTargetMemberCount] = useState(2);
  const [scheduleStartDate, setScheduleStartDate] = useState(new Date());
  const [startDateWasAdjusted, setStartDateWasAdjusted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [data, group] = await Promise.all([
        getGroupSchedule(id) as Promise<GroupScheduleData>,
        getGroupDetail(id),
      ]);
      setSchedule(data);
      setCanEdit(group.bottomButtonType === "LEADER_SETTING");
      setTargetMemberCount(data.targetMemberCount ?? group.maxMembers);
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const savedScheduleStart = toDateOnly(data.startDate);
      const shouldAdjustStart =
        data.scheduleStatus !== "IN_PROGRESS" &&
        savedScheduleStart < tomorrow;
      setScheduleStartDate(shouldAdjustStart ? tomorrow : savedScheduleStart);
      setStartDateWasAdjusted(shouldAdjustStart);
      const initialStart = data.excludedDateRanges?.at(-1)?.startDate;
      const initialEnd = data.excludedDateRanges?.at(-1)?.endDate;
      setVacationStart(initialStart ? toDateOnly(initialStart) : tomorrow);
      setVacationEnd(initialEnd ? toDateOnly(initialEnd) : tomorrow);
    } catch (error) {
      Alert.alert(
        "일정 조회 실패",
        getApiErrorMessage(error, "모임 일정을 불러오지 못했습니다."),
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const handleDateChange = (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === "android") setPickerTarget(null);
    if (event.type !== "set" || !value) return;

    if (pickerTarget === "start") {
      setVacationStart(value);
      if (value > vacationEnd) setVacationEnd(value);
    } else if (pickerTarget === "end") {
      setVacationEnd(value);
    }
  };

  const handleSave = async () => {
    if (!id || !schedule || saving || !canEdit) return;
    if (vacationStart > vacationEnd) {
      Alert.alert("날짜 확인", "종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }
    if (schedule.scheduleStatus === "COMPLETE") {
      Alert.alert("변경 불가", "완료된 모임의 일정은 변경할 수 없습니다.");
      return;
    }

    const range = {
      startDate: toIsoDate(vacationStart),
      endDate: toIsoDate(vacationEnd),
    };
    const ranges = [
      ...(schedule.excludedDateRanges ?? []).filter(
        (item) =>
          item.startDate !== range.startDate || item.endDate !== range.endDate,
      ),
      range,
    ];
    try {
      setSaving(true);
      if (schedule.scheduleStatus === "IN_PROGRESS") {
        await createFutureSchedule(id, {
          totalRoundCount: Math.max(
            schedule.minTotalRoundCount ?? 1,
            schedule.plannedRoundCount ?? 1,
          ),
          readingPeriod: schedule.readingPeriod,
          ...(schedule.endDate ? { endDate: schedule.endDate } : {}),
          excludedDates: schedule.excludedDates ?? [],
          excludedDateRanges: ranges,
        });
      } else {
        await createSchedule(id, {
          startDate: toIsoDate(scheduleStartDate),
          readingPeriod: schedule.readingPeriod,
          ...(schedule.endDate ? { endDate: schedule.endDate } : {}),
          excludedDates: schedule.excludedDates ?? [],
          excludedDateRanges: ranges,
          targetMemberCount,
        });
      }
      await load();
      Toast.show({ type: "success", text1: "일정 설정이 저장되었습니다." });
    } catch (error) {
      Alert.alert(
        "저장 실패",
        getApiErrorMessage(error, "일정 설정을 저장하지 못했습니다."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <GroupSettingsTabs groupId={id} groupName={name} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.amber} />
        </View>
      ) : !schedule ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>설정된 일정을 찾을 수 없습니다.</Text>
          <TouchableOpacity onPress={() => void load()}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>일정 관리</Text>

            {!canEdit ? (
              <View style={styles.permissionBanner}>
                <Ionicons name="lock-closed-outline" size={14} color="#8C6D35" />
                <Text style={styles.permissionText}>
                  일정은 그룹장만 수정할 수 있습니다.
                </Text>
              </View>
            ) : null}

            {startDateWasAdjusted ? (
              <View style={styles.adjustmentBanner}>
                <Ionicons name="calendar-outline" size={14} color="#8C6D35" />
                <Text style={styles.permissionText}>
                  기존 시작일이 지나 새 일정은 {displayDate(scheduleStartDate)}부터
                  시작합니다.
                </Text>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>방학 가지기</Text>
              <View style={styles.dateRow}>
                <DateField
                  label="시작일"
                  value={displayDate(vacationStart)}
                  disabled={!canEdit}
                  onPress={() => setPickerTarget("start")}
                />
                <DateField
                  label="종료일"
                  value={displayDate(vacationEnd)}
                  disabled={!canEdit}
                  onPress={() => setPickerTarget("end")}
                />
              </View>
              <View style={styles.rangeSummaryRow}>
                <Text style={styles.rangeSummary}>
                  {toIsoDate(vacationStart)} ~ {toIsoDate(vacationEnd)}
                </Text>
                <Pressable disabled={!canEdit} onPress={() => setVacationEnd(vacationStart)}>
                  <Ionicons name="close" size={13} color={COLORS.muted} />
                </Pressable>
              </View>
              <Text style={styles.helpText}>
                선택한 날짜는 쉬어가는 날짜로, 일정에 포함하지 않아요.
              </Text>
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              disabled={
                !canEdit || saving || schedule.scheduleStatus === "COMPLETE"
              }
              onPress={() => void handleSave()}
              style={[
                styles.saveButton,
                (!canEdit || saving || schedule.scheduleStatus === "COMPLETE") &&
                  styles.disabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.brown} />
              ) : (
                <Text style={styles.saveText}>저장하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {pickerTarget && Platform.OS === "android" ? (
        <DateTimePicker
          value={pickerTarget === "start" ? vacationStart : vacationEnd}
          mode="date"
          minimumDate={pickerTarget === "end" ? vacationStart : undefined}
          display="default"
          onChange={handleDateChange}
        />
      ) : null}

      <Modal
        visible={Boolean(pickerTarget) && Platform.OS === "ios"}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerTarget(null)}
      >
        <Pressable
          style={styles.pickerOverlay}
          onPress={() => setPickerTarget(null)}
        >
          <Pressable style={styles.pickerSheet} onPress={() => {}}>
            {pickerTarget ? (
              <DateTimePicker
                value={pickerTarget === "start" ? vacationStart : vacationEnd}
                mode="date"
                minimumDate={pickerTarget === "end" ? vacationStart : undefined}
                display="spinner"
                onChange={handleDateChange}
              />
            ) : null}
            <TouchableOpacity
              style={styles.pickerDone}
              onPress={() => setPickerTarget(null)}
            >
              <Text style={styles.pickerDoneText}>완료</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function DateField({
  label,
  value,
  disabled,
  onPress,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.dateFieldWrap}>
      <Text style={styles.dateLabel}>{label}</Text>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.dateField, disabled && styles.disabled]}
        onPress={onPress}
      >
        <Ionicons name="calendar-outline" size={17} color={COLORS.brown} />
        <Text style={styles.dateValue}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { color: COLORS.brown, fontSize: 14 },
  retryText: { color: COLORS.amber, fontWeight: "700" },
  content: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 120 },
  title: { color: COLORS.brown, fontSize: 17, fontWeight: "800", marginBottom: 16 },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 18,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    padding: 12,
  },
  permissionText: { color: "#8C6D35", fontSize: 11 },
  adjustmentBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 18,
    borderRadius: 10,
    backgroundColor: "#FFF8E7",
    padding: 12,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.line,
    paddingTop: 16,
    paddingBottom: 22,
  },
  sectionTitle: { color: COLORS.brown, fontSize: 14, fontWeight: "700", marginBottom: 12 },
  dateRow: { flexDirection: "row", gap: 12 },
  dateFieldWrap: { flex: 1 },
  dateLabel: { marginBottom: 8, color: COLORS.brown, fontSize: 12, fontWeight: "600" },
  dateField: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: 23,
    paddingHorizontal: 14,
  },
  dateValue: { color: COLORS.muted, fontSize: 11 },
  rangeSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rangeSummary: { color: COLORS.muted, fontSize: 10 },
  helpText: { marginTop: 14, color: COLORS.muted, fontSize: 11 },
  footer: { position: "absolute", right: 0, bottom: 0, left: 0, padding: 20, backgroundColor: "#FFFFFF" },
  saveButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: 25,
    backgroundColor: COLORS.amber,
  },
  saveText: { color: COLORS.brown, fontSize: 17, fontWeight: "700" },
  disabled: { opacity: 0.45 },
  pickerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  pickerSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  pickerDone: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: COLORS.amber,
  },
  pickerDoneText: { color: COLORS.brown, fontWeight: "700" },
});
