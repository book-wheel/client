import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { getGroupDetail, updateGroup } from "@/api/group";
import type {
  GroupDetail,
  GroupRegion,
  GroupUpdateRequest,
} from "@/types/group";

const COLORS = {
  brown: "#513A11",
  amber: "#E4A54E",
  cream: "#FCF5D7",
  muted: "#A99E8A",
  border: "#D8C9AB",
  danger: "#D94A45",
  dangerBackground: "#FFE1DE",
};

const STEPS = ["정보입력", "운영방식", "기타"] as const;

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
  helper,
}: FieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {maxLength ? (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        ) : null}
      </View>
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
        style={[
          styles.input,
          multiline && styles.textArea,
          !editable && styles.readOnlyInput,
        ]}
      />
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

type RegionModalProps = {
  visible: boolean;
  selected: GroupRegion | null;
  onSelect: (region: GroupRegion) => void;
  onClose: () => void;
};

function RegionModal({
  visible,
  selected,
  onSelect,
  onClose,
}: RegionModalProps) {
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
          <Text style={styles.modalTitle}>지역 선택</Text>
          <View style={styles.regionGrid}>
            {REGION_OPTIONS.map((region) => {
              const active = selected === region.value;
              return (
                <Pressable
                  key={region.value}
                  onPress={() => {
                    onSelect(region.value);
                    onClose();
                  }}
                  style={[styles.regionChip, active && styles.regionChipActive]}
                >
                  <Text
                    style={[
                      styles.regionChipText,
                      active && styles.regionChipTextActive,
                    ]}
                  >
                    {region.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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

export default function GroupSettings() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(0);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);

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
  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  const validate = () => {
    if (!form.groupName.trim()) return "모임 이름을 입력해주세요.";
    if (!form.groupComment.trim()) return "모임 한줄 소개를 입력해주세요.";
    if (!form.groupRule.trim()) return "모임 규칙을 입력해주세요.";
    if (!form.groupPublic && !form.groupPassword.trim()) {
      return "비공개 모임을 저장하려면 새 비밀번호를 입력해주세요.";
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
    if (!id || !group || saving) return;

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
      keyboardVerticalOffset={96}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.steps}>
          {STEPS.map((label, index) => (
            <View key={label} style={styles.stepItem}>
              <Pressable onPress={() => setStep(index)} hitSlop={8}>
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

        {!canEdit ? (
          <View style={styles.permissionBanner}>
            <Ionicons name="lock-closed-outline" size={16} color="#8C6D35" />
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
              editable={canEdit && !saving}
            />
            <Field
              label="한줄 소개"
              value={form.groupComment}
              onChangeText={(value) => updateForm("groupComment", value)}
              maxLength={50}
              placeholder="모임을 소개해주세요"
              editable={canEdit && !saving}
            />

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>최대 인원</Text>
              <View style={styles.memberStepper}>
                <TouchableOpacity
                  disabled={!canEdit || saving || form.maxMembers <= 2}
                  onPress={() =>
                    updateForm("maxMembers", Math.max(2, form.maxMembers - 1))
                  }
                  style={styles.stepperButton}
                >
                  <Ionicons name="remove" size={18} color={COLORS.brown} />
                </TouchableOpacity>
                <Text style={styles.memberCount}>{form.maxMembers}명</Text>
                <TouchableOpacity
                  disabled={!canEdit || saving || form.maxMembers >= 12}
                  onPress={() =>
                    updateForm("maxMembers", Math.min(12, form.maxMembers + 1))
                  }
                  style={styles.stepperButton}
                >
                  <Ionicons name="add" size={18} color={COLORS.brown} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>
                현재 {group.currentMembers}명이 참여하고 있어요. 최대 12명까지 설정할 수
                있어요.
              </Text>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View>
            <Text style={styles.pageTitle}>운영 방식</Text>
            <Field
              label="모임 규칙"
              value={form.groupRule}
              onChangeText={(value) => updateForm("groupRule", value)}
              placeholder="모임 규칙을 입력해주세요"
              multiline
              editable={canEdit && !saving}
            />

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>공개 여부</Text>
              <Choice
                value={form.groupPublic}
                options={[
                  { value: false, label: "비공개" },
                  { value: true, label: "공개" },
                ]}
                disabled={!canEdit || saving}
                onChange={(value) => {
                  updateForm("groupPublic", value);
                  if (value) updateForm("groupPassword", "");
                }}
              />
            </View>

            {!form.groupPublic && canEdit ? (
              <Field
                label="새 비밀번호"
                value={form.groupPassword}
                onChangeText={(value) => updateForm("groupPassword", value)}
                placeholder="저장할 때 사용할 새 비밀번호"
                secureTextEntry
                editable={!saving}
                helper="보안을 위해 기존 비밀번호는 표시되지 않습니다."
              />
            ) : null}
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text style={styles.pageTitle}>기타</Text>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>모임 방식</Text>
              <Choice
                value={form.groupOffline}
                options={[
                  { value: true, label: "오프라인" },
                  { value: false, label: "온라인" },
                ]}
                disabled={!canEdit || saving}
                onChange={(value) => {
                  updateForm("groupOffline", value);
                  if (!value) updateForm("groupRegion", null);
                }}
              />
            </View>

            {form.groupOffline ? (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>지역</Text>
                <Pressable
                  disabled={!canEdit || saving}
                  onPress={() => setRegionModalVisible(true)}
                  style={[
                    styles.selectInput,
                    (!canEdit || saving) && styles.readOnlyInput,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectText,
                      !form.groupRegion && styles.placeholderText,
                    ]}
                  >
                    {regionLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.brown} />
                </Pressable>
              </View>
            ) : null}

            <Field
              label="독서 기간"
              value={group.readingPeriod ? `${group.readingPeriod}일` : "설정되지 않음"}
              editable={false}
              helper="독서 기간과 시작일은 일정 설정에서 변경할 수 있어요."
            />
            <Field
              label="시작일"
              value={group.startDate ?? "설정되지 않음"}
              editable={false}
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

        <View style={styles.footer}>
          {step > 0 ? (
            <TouchableOpacity
              disabled={saving}
              onPress={() => setStep((current) => current - 1)}
              style={[styles.footerButton, styles.secondaryButton]}
            >
              <Ionicons name="chevron-back" size={18} color="#B8873D" />
              <Text style={styles.secondaryButtonText}>이전</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButton} />
          )}

          {step < STEPS.length - 1 ? (
            <TouchableOpacity
              onPress={() => setStep((current) => current + 1)}
              style={[styles.footerButton, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>다음</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.brown} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!canEdit || saving}
              onPress={() => void handleSave()}
              style={[
                styles.footerButton,
                styles.primaryButton,
                (!canEdit || saving) && styles.disabledButton,
              ]}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.brown} />
              ) : (
                <Text style={styles.primaryButtonText}>저장하기</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <RegionModal
        visible={regionModalVisible}
        selected={form.groupRegion}
        onSelect={(region) => updateForm("groupRegion", region)}
        onClose={() => setRegionModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 13,
  },
  errorTitle: {
    color: COLORS.brown,
    fontSize: 16,
    fontWeight: "700",
  },
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
  retryText: {
    color: COLORS.brown,
    fontWeight: "700",
  },
  steps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepText: {
    color: "#B5B5B5",
    fontSize: 13,
  },
  stepTextActive: {
    color: COLORS.amber,
    fontWeight: "800",
  },
  stepDivider: {
    marginHorizontal: 12,
    color: "#DDD3C1",
  },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
    padding: 12,
  },
  permissionText: {
    flex: 1,
    color: "#8C6D35",
    fontSize: 12,
    lineHeight: 17,
  },
  pageTitle: {
    marginBottom: 24,
    color: COLORS.brown,
    fontSize: 19,
    fontWeight: "800",
  },
  fieldBlock: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    marginBottom: 8,
    color: COLORS.brown,
    fontSize: 13,
    fontWeight: "600",
  },
  counter: {
    color: COLORS.muted,
    fontSize: 11,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: COLORS.brown,
    fontSize: 14,
  },
  textArea: {
    minHeight: 132,
    borderRadius: 22,
    paddingTop: 16,
  },
  readOnlyInput: {
    borderColor: COLORS.border,
    backgroundColor: "#F7F5F0",
    color: "#796F60",
  },
  helper: {
    marginTop: 7,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 12,
  },
  choice: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: "#FFFCF4",
  },
  choiceSelected: {
    borderColor: COLORS.brown,
    backgroundColor: COLORS.amber,
  },
  choiceText: {
    color: "#9B8B6B",
    fontSize: 13,
    fontWeight: "600",
  },
  choiceTextSelected: {
    color: COLORS.brown,
  },
  disabledControl: {
    opacity: 0.65,
  },
  memberStepper: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    backgroundColor: "#F7F2E8",
    paddingHorizontal: 10,
  },
  stepperButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: COLORS.cream,
  },
  memberCount: {
    color: COLORS.brown,
    fontSize: 18,
    fontWeight: "800",
  },
  selectInput: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },
  selectText: {
    color: COLORS.brown,
    fontSize: 14,
  },
  placeholderText: {
    color: "#B8AE9B",
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    borderRadius: 12,
    padding: 12,
  },
  errorBox: {
    backgroundColor: COLORS.dangerBackground,
  },
  successBox: {
    backgroundColor: "#EDF5E7",
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  errorText: {
    color: COLORS.danger,
  },
  successText: {
    color: "#5B7B46",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
    paddingTop: 28,
  },
  footerButton: {
    minHeight: 46,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.cream,
  },
  primaryButton: {
    borderWidth: 1,
    borderColor: COLORS.brown,
    backgroundColor: COLORS.amber,
  },
  secondaryButtonText: {
    color: "#B8873D",
    fontSize: 13,
    fontWeight: "700",
  },
  primaryButtonText: {
    color: COLORS.brown,
    fontSize: 13,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.45,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalSheet: {
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
  regionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  regionChip: {
    width: "23%",
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: "#FFFCF4",
  },
  regionChipActive: {
    borderColor: COLORS.amber,
    backgroundColor: COLORS.amber,
  },
  regionChipText: {
    color: "#7B6A4A",
    fontSize: 12,
  },
  regionChipTextActive: {
    color: COLORS.brown,
    fontWeight: "700",
  },
  modalClose: {
    alignItems: "center",
    marginTop: 22,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    paddingVertical: 12,
  },
  modalCloseText: {
    color: COLORS.brown,
    fontWeight: "700",
  },
});
