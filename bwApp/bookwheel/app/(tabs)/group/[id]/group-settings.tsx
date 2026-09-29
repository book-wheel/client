import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { getApiErrorMessage } from "@/api/axios";
import {
  deleteGroup,
  getGroupDetail,
  leaveGroup,
  updateGroup,
} from "@/api/group";
import type {
  GroupDetail,
  GroupRegion,
  GroupUpdateRequest,
} from "@/types/group";

const COLORS = {
  brown: "#513A11",
  amber: "#E4A54E",
  cream: "#FFF8E7",
  muted: "#A99E8A",
  border: "#9B8B6B",
  line: "#E8DECB",
  danger: "#F04B43",
  dangerBackground: "#FFD2CD",
};

const STEPS = ["정보입력", "운영방식", "기타"] as const;
const MEMBER_OPTIONS = Array.from({ length: 11 }, (_, index) => index + 2);
const REGION_OPTIONS: { value: GroupRegion; label: string }[] = [
  { value: "SEOUL", label: "서울" },
  { value: "GYEONGGI", label: "경기" },
  { value: "INCHEON", label: "인천" },
  { value: "GANGWON", label: "강원" },
  { value: "CHUNG_BUK", label: "충북" },
  { value: "CHUNG_NAM", label: "충남" },
  { value: "DAEJEON", label: "대전" },
  { value: "SEJONG", label: "세종" },
  { value: "JEON_BUK", label: "전북" },
  { value: "JEON_NAM", label: "전남" },
  { value: "GWANGJU", label: "광주" },
  { value: "GYEONG_BUK", label: "경북" },
  { value: "GYEONG_NAM", label: "경남" },
  { value: "DAEGU", label: "대구" },
  { value: "ULSAN", label: "울산" },
  { value: "BUSAN", label: "부산" },
  { value: "JEJU", label: "제주" },
];

type FormState = {
  groupName: string;
  groupComment: string;
  groupRule: string;
  groupPublic: boolean;
  groupPassword: string;
  groupOffline: boolean;
  groupRegion: GroupRegion | null;
  maxMembers: number;
};

const EMPTY_FORM: FormState = {
  groupName: "",
  groupComment: "",
  groupRule: "",
  groupPublic: true,
  groupPassword: "",
  groupOffline: false,
  groupRegion: null,
  maxMembers: 2,
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  helper?: string;
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  multiline = false,
  secureTextEntry = false,
  editable = true,
  icon,
  helper,
}: FieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>
        {label}
        {maxLength ? (
          <Text style={styles.counter}> ({value.length}/{maxLength})</Text>
        ) : null}
      </Text>
      <View
        style={[
          styles.inputShell,
          multiline && styles.textAreaShell,
          !editable && styles.readOnlyInput,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={COLORS.brown}
            style={styles.inputIcon}
          />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B8AE9B"
          maxLength={maxLength}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          editable={editable}
          textAlignVertical={multiline ? "top" : "center"}
          style={[styles.input, multiline && styles.textArea]}
        />
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

type ChoiceProps<T> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

function Choice<T extends string | boolean>({
  value,
  options,
  onChange,
  disabled = false,
}: ChoiceProps<T>) {
  return (
    <View style={styles.choiceRow}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={[
              styles.choice,
              selected && styles.choiceSelected,
              disabled && styles.disabledControl,
            ]}
          >
            <Text
              style={[
                styles.choiceText,
                selected && styles.choiceTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

function SelectField({
  label,
  value,
  placeholder = false,
  disabled = false,
  onPress,
}: SelectFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={[styles.selectInput, disabled && styles.readOnlyInput]}
      >
        <Text style={[styles.selectText, placeholder && styles.placeholderText]}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.brown} />
      </Pressable>
    </View>
  );
}

type SelectionModalProps<T extends string | number> = {
  visible: boolean;
  title: string;
  selected: T;
  options: { value: T; label: string }[];
  onSelect: (value: T) => void;
  onClose: () => void;
};

function SelectionModal<T extends string | number>({
  visible,
  title,
  selected,
  options,
  onSelect,
  onClose,
}: SelectionModalProps<T>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView
            style={styles.modalList}
            contentContainerStyle={styles.optionGrid}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const active = selected === option.value;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={[styles.optionChip, active && styles.optionChipActive]}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      active && styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>닫기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function formFromDetail(group: GroupDetail): FormState {
  return {
    groupName: group.groupName,
    groupComment: group.groupComment,
    groupRule: group.groupRule,
    groupPublic: group.groupPublic,
    groupPassword: "",
    groupOffline: group.groupOffline,
    groupRegion: group.groupRegion,
    maxMembers: group.maxMembers,
  };
}

function formatDate(date: string | null) {
  if (!date) return "설정되지 않음";
  return date.replaceAll("-", " / ");
}

export default function GroupSettings() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(0);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);

  const loadGroup = useCallback(async () => {
    if (!id) {
      setLoadError("모임 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError("");
      const detail = await getGroupDetail(id);
      setGroup(detail);
      setForm(formFromDetail(detail));
    } catch (error) {
      setLoadError(
        getApiErrorMessage(error, "모임 설정을 불러오지 못했습니다."),
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadGroup();
    }, [loadGroup]),
  );

  const canEdit = group?.bottomButtonType === "LEADER_SETTING";
  const canLeave = group?.bottomButtonType === "JOINED";
  const busy = saving || deleting || leaving;

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  const validate = () => {
    if (!form.groupName.trim()) return "모임 이름을 입력해주세요.";
    if (!form.groupComment.trim()) return "코멘트를 입력해주세요.";
    if (!form.groupRule.trim()) return "모임 규칙을 입력해주세요.";
    if (!form.groupPublic && !form.groupPassword.trim()) {
      return "비공개 모임은 비밀번호를 입력해주세요.";
    }
    if (form.groupOffline && !form.groupRegion) {
      return "오프라인 모임의 지역을 선택해주세요.";
    }
    if (group && form.maxMembers < group.currentMembers) {
      return `현재 참여 인원(${group.currentMembers}명)보다 최대 인원을 줄일 수 없습니다.`;
    }
    return null;
  };

  const handleSave = async () => {
    if (!id || !group || busy) return;
    if (!canEdit) {
      setMessageIsError(true);
      setMessage("그룹장만 모임 설정을 수정할 수 있습니다.");
      return;
    }

    const validationMessage = validate();
    if (validationMessage) {
      setMessageIsError(true);
      setMessage(validationMessage);
      return;
    }

    const payload: GroupUpdateRequest = {
      groupName: form.groupName.trim(),
      groupComment: form.groupComment.trim(),
      groupRule: form.groupRule.trim(),
      groupPublic: form.groupPublic,
      groupOffline: form.groupOffline,
      groupRegion: form.groupOffline ? form.groupRegion : null,
      maxMembers: form.maxMembers,
      ...(form.groupPublic
        ? {}
        : { groupPassword: form.groupPassword.trim() }),
    };

    try {
      setSaving(true);
      setMessage("");
      const updated = await updateGroup(id, payload);
      setGroup(updated);
      setForm(formFromDetail(updated));
      setMessageIsError(false);
      setMessage("모임 설정이 저장되었습니다.");
      Toast.show({ type: "success", text1: "모임 설정이 저장되었습니다." });
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "모임 설정을 저장하지 못했습니다.",
      );
      setMessageIsError(true);
      setMessage(errorMessage);
      Toast.show({ type: "error", text1: "저장 실패", text2: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const runDelete = async () => {
    if (!id || busy) return;
    try {
      setDeleting(true);
      await deleteGroup(id);
      Toast.show({ type: "success", text1: "모임이 삭제되었습니다." });
      router.replace("/(tabs)/groups");
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "모임을 삭제하지 못했습니다.",
      );
      setMessageIsError(true);
      setMessage(errorMessage);
      Toast.show({ type: "error", text1: "삭제 실패", text2: errorMessage });
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    if (!canEdit) return;
    Alert.alert(
      "그룹 삭제",
      "그룹을 삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => void runDelete() },
      ],
    );
  };

  const runLeave = async () => {
    if (!id || busy) return;
    try {
      setLeaving(true);
      await leaveGroup(id);
      Toast.show({ type: "success", text1: "모임에서 탈퇴했습니다." });
      router.replace("/(tabs)/groups");
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "모임에서 탈퇴하지 못했습니다.",
      );
      setMessageIsError(true);
      setMessage(errorMessage);
      Toast.show({ type: "error", text1: "탈퇴 실패", text2: errorMessage });
    } finally {
      setLeaving(false);
    }
  };

  const handleLeave = () => {
    if (!canLeave) return;
    Alert.alert("모임 탈퇴", "모임에서 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "탈퇴", style: "destructive", onPress: () => void runLeave() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.amber} />
        <Text style={styles.loadingText}>모임 설정을 불러오는 중이에요.</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>모임 설정을 불러오지 못했어요.</Text>
        {loadError ? <Text style={styles.errorDescription}>{loadError}</Text> : null}
        <TouchableOpacity style={styles.retryButton} onPress={() => void loadGroup()}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const regionLabel =
    REGION_OPTIONS.find((region) => region.value === form.groupRegion)?.label ??
    "지역을 선택해주세요";

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={92}
    >
      <View style={styles.steps}>
        {STEPS.map((label, index) => (
          <View key={label} style={styles.stepItem}>
            <Pressable onPress={() => setStep(index)} hitSlop={10}>
              <Text
                style={[styles.stepText, step === index && styles.stepTextActive]}
              >
                {label}
              </Text>
            </Pressable>
            {index < STEPS.length - 1 ? (
              <Text style={styles.stepDivider}>·</Text>
            ) : null}
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!canEdit ? (
          <View style={styles.permissionBanner}>
            <Ionicons name="lock-closed-outline" size={15} color="#8C6D35" />
            <Text style={styles.permissionText}>
              모임 설정을 확인할 수 있지만 수정은 그룹장만 가능합니다.
            </Text>
          </View>
        ) : null}

        {step === 0 ? (
          <View>
            <Text style={styles.pageTitle}>정보 입력</Text>
            <Field
              label="모임 이름"
              value={form.groupName}
              onChangeText={(value) => updateForm("groupName", value)}
              maxLength={20}
              placeholder="모임 이름"
              editable={canEdit && !busy}
            />
            <Field
              label="코멘트"
              value={form.groupComment}
              onChangeText={(value) => updateForm("groupComment", value)}
              maxLength={50}
              placeholder="모임을 소개해주세요"
              editable={canEdit && !busy}
            />
            <SelectField
              label="최대 인원"
              value={`${form.maxMembers}명`}
              disabled={!canEdit || busy}
              onPress={() => setMemberModalVisible(true)}
            />
            <Field
              label="시작 예정일"
              value={formatDate(group.startDate)}
              editable={false}
              icon="calendar-outline"
              helper="시작일은 일정 관리에서 변경할 수 있어요."
            />
          </View>
        ) : null}

        {step === 1 ? (
          <View>
            <Text style={styles.pageTitle}>운영 방식</Text>
            <Field
              label="규칙"
              value={form.groupRule}
              onChangeText={(value) => updateForm("groupRule", value)}
              placeholder="모임 규칙을 입력해주세요"
              multiline
              editable={canEdit && !busy}
            />
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>공개여부</Text>
              <Choice
                value={form.groupPublic}
                options={[
                  { value: false, label: "비공개" },
                  { value: true, label: "공개" },
                ]}
                disabled={!canEdit || busy}
                onChange={(value) => {
                  updateForm("groupPublic", value);
                  if (value) updateForm("groupPassword", "");
                }}
              />
            </View>
            {!form.groupPublic ? (
              <Field
                label="비밀번호 설정"
                value={form.groupPassword}
                onChangeText={(value) => updateForm("groupPassword", value)}
                placeholder="비밀번호를 입력해주세요"
                secureTextEntry
                editable={canEdit && !busy}
                helper="비공개 모임 정보를 저장할 때 비밀번호가 필요해요."
              />
            ) : null}
          </View>
        ) : null}

        {step === 2 && (canEdit || canLeave) ? (
          <View>
            <Text style={styles.pageTitle}>기타</Text>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>방식</Text>
              <Choice
                value={form.groupOffline}
                options={[
                  { value: true, label: "오프라인" },
                  { value: false, label: "온라인" },
                ]}
                disabled={!canEdit || busy}
                onChange={(value) => {
                  updateForm("groupOffline", value);
                  if (!value) updateForm("groupRegion", null);
                }}
              />
            </View>
            {form.groupOffline ? (
              <SelectField
                label="지역"
                value={regionLabel}
                placeholder={!form.groupRegion}
                disabled={!canEdit || busy}
                onPress={() => setRegionModalVisible(true)}
              />
            ) : null}
            <Field
              label="독서 기간"
              value={group.readingPeriod ? `${group.readingPeriod}일` : "설정되지 않음"}
              editable={false}
              helper="독서 기간은 일정 관리에서 변경할 수 있어요."
            />
          </View>
        ) : null}

        {message ? (
          <View
            style={[
              styles.messageBox,
              messageIsError ? styles.errorBox : styles.successBox,
            ]}
          >
            <Ionicons
              name={messageIsError ? "alert-circle-outline" : "checkmark-circle-outline"}
              size={17}
              color={messageIsError ? COLORS.danger : "#5B7B46"}
            />
            <Text
              style={[
                styles.messageText,
                messageIsError ? styles.errorText : styles.successText,
              ]}
            >
              {message}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomArea}>
        {step === 2 ? (
          <TouchableOpacity
            disabled={busy}
            onPress={canEdit ? handleDelete : handleLeave}
            style={[styles.deleteButton, busy && styles.disabledButton]}
          >
            {deleting || leaving ? (
              <ActivityIndicator color={COLORS.danger} />
            ) : (
              <Text style={styles.deleteButtonText}>
                {canEdit ? "그룹 삭제하기" : "그룹 탈퇴하기"}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        <View style={styles.footer}>
          {step > 0 ? (
            <TouchableOpacity
              disabled={busy}
              onPress={() => setStep((current) => current - 1)}
              style={[styles.footerButton, styles.secondaryButton]}
            >
              <Ionicons name="chevron-back" size={18} color="#D79B42" />
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButton} />
          )}

          {step < STEPS.length - 1 ? (
            <TouchableOpacity
              disabled={busy}
              onPress={() => setStep((current) => current + 1)}
              style={[styles.footerButton, styles.primaryButton]}
            >
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!canEdit || busy}
              onPress={() => void handleSave()}
              style={[
                styles.footerButton,
                styles.primaryButton,
                (!canEdit || busy) && styles.disabledButton,
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>저장</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SelectionModal
        visible={memberModalVisible}
        title="최대 인원"
        selected={form.maxMembers}
        options={MEMBER_OPTIONS.map((value) => ({ value, label: `${value}명` }))}
        onSelect={(value) => updateForm("maxMembers", value)}
        onClose={() => setMemberModalVisible(false)}
      />
      <SelectionModal<GroupRegion | "">
        visible={regionModalVisible}
        title="지역 선택"
        selected={form.groupRegion ?? ""}
        options={REGION_OPTIONS}
        onSelect={(value) => {
          if (value) updateForm("groupRegion", value);
        }}
        onClose={() => setRegionModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  loadingText: { marginTop: 12, color: COLORS.muted, fontSize: 13 },
  errorTitle: { color: COLORS.brown, fontSize: 16, fontWeight: "700" },
  errorDescription: {
    marginTop: 8,
    color: COLORS.danger,
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: COLORS.amber,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  retryText: { color: COLORS.brown, fontWeight: "700" },
  steps: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
    backgroundColor: "#FFFFFF",
  },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepText: { color: "#D8D0C2", fontSize: 12, fontWeight: "500" },
  stepTextActive: { color: COLORS.amber, fontWeight: "800" },
  stepDivider: { marginHorizontal: 20, color: COLORS.amber, fontSize: 12 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 20,
  },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    padding: 11,
  },
  permissionText: {
    flex: 1,
    color: "#8C6D35",
    fontSize: 11,
    lineHeight: 16,
  },
  pageTitle: {
    marginBottom: 28,
    color: COLORS.brown,
    fontSize: 18,
    fontWeight: "800",
  },
  fieldBlock: { marginBottom: 22 },
  fieldLabel: {
    marginBottom: 8,
    marginLeft: 12,
    color: COLORS.brown,
    fontSize: 13,
    fontWeight: "600",
  },
  counter: { color: COLORS.muted, fontSize: 11, fontWeight: "400" },
  inputShell: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
  },
  textAreaShell: {
    minHeight: 150,
    alignItems: "stretch",
    borderRadius: 22,
    paddingVertical: 4,
  },
  inputIcon: { marginRight: 10 },
  input: {
    minWidth: 0,
    flex: 1,
    paddingVertical: 11,
    color: COLORS.brown,
    fontSize: 13,
  },
  textArea: { minHeight: 140, paddingTop: 12 },
  readOnlyInput: { backgroundColor: "#F7F7F7", opacity: 0.82 },
  helper: {
    marginTop: 6,
    marginLeft: 12,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
  },
  choiceRow: { flexDirection: "row", gap: 22 },
  choice: {
    minHeight: 43,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
  },
  choiceSelected: { borderColor: COLORS.amber, backgroundColor: COLORS.amber },
  choiceText: { color: "#8E816B", fontSize: 12, fontWeight: "600" },
  choiceTextSelected: { color: COLORS.brown },
  disabledControl: { opacity: 0.62 },
  selectInput: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },
  selectText: { color: COLORS.brown, fontSize: 13 },
  placeholderText: { color: "#B8AE9B" },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 11,
  },
  errorBox: { backgroundColor: COLORS.dangerBackground },
  successBox: { backgroundColor: "#EDF5E7" },
  messageText: { flex: 1, fontSize: 11, lineHeight: 16 },
  errorText: { color: COLORS.danger },
  successText: { color: "#5B7B46" },
  bottomArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.line,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 14,
  },
  deleteButton: {
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "#FF928A",
    borderRadius: 4,
    backgroundColor: COLORS.dangerBackground,
  },
  deleteButtonText: { color: COLORS.danger, fontSize: 12, fontWeight: "700" },
  footer: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 70,
  },
  footerButton: {
    minHeight: 42,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  secondaryButton: { backgroundColor: "#FFF8D9" },
  primaryButton: { backgroundColor: COLORS.amber },
  saveButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  disabledButton: { opacity: 0.45 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalSheet: {
    maxHeight: "72%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  modalHandle: {
    width: 36,
    height: 4,
    alignSelf: "center",
    borderRadius: 2,
    backgroundColor: "#D8D0C2",
  },
  modalTitle: {
    marginTop: 18,
    marginBottom: 18,
    color: COLORS.brown,
    fontSize: 17,
    fontWeight: "800",
  },
  modalList: { flexGrow: 0 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  optionChip: {
    width: "23%",
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    backgroundColor: "#FFFCF4",
  },
  optionChipActive: { borderColor: COLORS.amber, backgroundColor: COLORS.amber },
  optionChipText: { color: "#7B6A4A", fontSize: 12 },
  optionChipTextActive: { color: COLORS.brown, fontWeight: "700" },
  modalClose: {
    alignItems: "center",
    marginTop: 22,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    paddingVertical: 12,
  },
  modalCloseText: { color: COLORS.brown, fontWeight: "700" },
});
