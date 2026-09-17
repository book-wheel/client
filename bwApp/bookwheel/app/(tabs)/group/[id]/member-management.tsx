import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { getMyInfo } from "@/api/auth";
import { getApiErrorMessage } from "@/api/axios";
import {
  changeGroupMemberRole,
  getGroupMembers,
  kickGroupMember,
  transferGroupLeadership,
} from "@/api/group";
import GroupSettingsTabs from "@/components/group/settings/GroupSettingsTabs";
import type {
  GroupMember,
  GroupMemberRole,
  GroupMembersData,
} from "@/types/groupMembers";

const COLORS = {
  brown: "#513A11",
  amber: "#E4A54E",
  cream: "#FFF8DD",
  line: "#DDD0B7",
  danger: "#4E390E",
};

function normalizeRole(role: GroupMemberRole) {
  return role === "VICE" ? "SUB_LEADER" : role;
}

type RoleDraft = Record<string, "SUB_LEADER" | "MEMBER">;

export default function MemberManagement() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [myUserPK, setMyUserPK] = useState("");
  const [draftRoles, setDraftRoles] = useState<RoleDraft>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedKickMember, setSelectedKickMember] =
    useState<GroupMember | null>(null);

  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [memberData, profileResponse] = await Promise.all([
        getGroupMembers(id) as Promise<GroupMembersData>,
        getMyInfo(),
      ]);
      setMembers(memberData.members);
      setMyUserPK(profileResponse.data.data?.userPK ?? "");
      setDraftRoles(
        Object.fromEntries(
          memberData.members
            .filter((member) => normalizeRole(member.role) !== "LEADER")
            .map((member) => [
              member.userPK,
              normalizeRole(member.role) === "SUB_LEADER"
                ? "SUB_LEADER"
                : "MEMBER",
            ]),
        ),
      );
    } catch (error) {
      Alert.alert(
        "멤버 조회 실패",
        getApiErrorMessage(error, "멤버 정보를 불러오지 못했습니다."),
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

  const currentMember = members.find((member) => member.userPK === myUserPK);
  const canManage = normalizeRole(currentMember?.role ?? "MEMBER") === "LEADER";

  const changedRoles = useMemo(
    () =>
      members.filter((member) => {
        const role = normalizeRole(member.role);
        return role !== "LEADER" && draftRoles[member.userPK] !== role;
      }),
    [draftRoles, members],
  );

  const toggleDeputy = (member: GroupMember) => {
    if (!canManage) return;
    setDraftRoles((current) => ({
      ...current,
      [member.userPK]:
        current[member.userPK] === "SUB_LEADER" ? "MEMBER" : "SUB_LEADER",
    }));
  };

  const handleSave = async () => {
    if (!id || !canManage || saving) return;

    try {
      setSaving(true);
      await Promise.all(
        changedRoles.map((member) =>
          changeGroupMemberRole(id, member.userPK, draftRoles[member.userPK]),
        ),
      );
      await load();
      Toast.show({ type: "success", text1: "멤버 설정이 저장되었습니다." });
    } catch (error) {
      Alert.alert(
        "저장 실패",
        getApiErrorMessage(error, "멤버 설정을 저장하지 못했습니다."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTransfer = (member: GroupMember) => {
    if (!id || !canManage) return;
    Alert.alert(
      "방장 위임",
      `${member.nickname}님에게 방장을 위임하시겠습니까? 위임하면 나는 일반 멤버가 됩니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          onPress: async () => {
            try {
              await transferGroupLeadership(id, member.userPK);
              await load();
              Toast.show({ type: "success", text1: "방장을 위임했습니다." });
            } catch (error) {
              Alert.alert(
                "위임 실패",
                getApiErrorMessage(error, "방장을 위임하지 못했습니다."),
              );
            }
          },
        },
      ],
    );
  };

  const confirmKick = async () => {
    if (!id || !selectedKickMember) return;
    try {
      setSaving(true);
      await kickGroupMember(id, selectedKickMember.userPK);
      setSelectedKickMember(null);
      await load();
      Toast.show({ type: "success", text1: "멤버를 강제탈퇴 처리했습니다." });
    } catch (error) {
      Alert.alert(
        "강제탈퇴 실패",
        getApiErrorMessage(error, "멤버를 강제탈퇴시키지 못했습니다."),
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
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>멤버 관리</Text>

            {members.map((member) => {
              const role = normalizeRole(member.role);
              const isLeader = role === "LEADER";
              const draftRole = draftRoles[member.userPK] ?? "MEMBER";

              return (
                <View key={member.memberId} style={styles.memberRow}>
                  <Image
                    source={
                      member.profileImageUrl
                        ? { uri: member.profileImageUrl }
                        : require("@/assets/images/logo.png")
                    }
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.nameArea}>
                    <Text style={styles.nickname}>{member.nickname}</Text>
                    {isLeader || draftRole === "SUB_LEADER" ? (
                      <Text style={styles.roleText}>
                        ({isLeader ? "방장" : "부방장"})
                      </Text>
                    ) : null}
                  </View>

                  {!isLeader && canManage ? (
                    <View style={styles.actions}>
                      <ActionButton
                        label={
                          draftRole === "SUB_LEADER"
                            ? "부방장 해제"
                            : "부방장 등록"
                        }
                        tone="cream"
                        onPress={() => toggleDeputy(member)}
                      />
                      <ActionButton
                        label="방장 위임"
                        tone="amber"
                        onPress={() => handleTransfer(member)}
                      />
                      <ActionButton
                        label="강제탈퇴"
                        tone="brown"
                        onPress={() => setSelectedKickMember(member)}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}

            <View style={styles.noteRow}>
              <Ionicons name="information-circle" size={13} color={COLORS.brown} />
              <Text style={styles.note}>부방장이 갖는 권한은 그룹 운영 권한입니다.</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              disabled={!canManage || saving}
              onPress={() => void handleSave()}
              style={[
                styles.saveButton,
                (!canManage || saving) && styles.disabled,
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

      <Modal
        visible={Boolean(selectedKickMember)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedKickMember(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedKickMember(null)}
        >
          <Pressable style={styles.dialog} onPress={() => {}}>
            <Image
              source={
                selectedKickMember?.profileImageUrl
                  ? { uri: selectedKickMember.profileImageUrl }
                  : require("@/assets/images/logo.png")
              }
              style={styles.dialogAvatar}
            />
            <Text style={styles.dialogName}>{selectedKickMember?.nickname}</Text>
            <Text style={styles.dialogText}>해당 멤버를 강제탈퇴시키겠습니까?</Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton]}
                onPress={() => setSelectedKickMember(null)}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.confirmButton]}
                onPress={() => void confirmKick()}
              >
                <Text style={styles.confirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function ActionButton({
  label,
  tone,
  onPress,
}: {
  label: string;
  tone: "cream" | "amber" | "brown";
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.actionButton,
        tone === "cream" && styles.creamAction,
        tone === "amber" && styles.amberAction,
        tone === "brown" && styles.brownAction,
      ]}
    >
      <Text
        style={[
          styles.actionText,
          tone === "brown" && styles.brownActionText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 26, paddingTop: 30, paddingBottom: 120 },
  title: { color: COLORS.brown, fontSize: 17, fontWeight: "800", marginBottom: 20 },
  memberRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.brown,
  },
  nameArea: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 10 },
  nickname: { color: COLORS.brown, fontSize: 14, fontWeight: "700" },
  roleText: { marginLeft: 5, color: COLORS.brown, fontSize: 9, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 5 },
  actionButton: {
    minWidth: 52,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 7,
  },
  creamAction: { backgroundColor: COLORS.cream },
  amberAction: { backgroundColor: COLORS.amber },
  brownAction: { backgroundColor: COLORS.brown },
  actionText: { color: COLORS.brown, fontSize: 9, fontWeight: "800" },
  brownActionText: { color: "#FFFFFF" },
  noteRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 20 },
  note: { color: COLORS.brown, fontSize: 10 },
  footer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 26,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: 24,
    backgroundColor: COLORS.amber,
  },
  saveText: { color: COLORS.brown, fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.45 },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 48,
  },
  dialog: {
    width: "100%",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  dialogAvatar: { width: 44, height: 44, borderRadius: 22 },
  dialogName: { marginTop: 7, color: COLORS.brown, fontSize: 17, fontWeight: "800" },
  dialogText: { marginTop: 16, color: COLORS.brown, fontSize: 13 },
  dialogActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  dialogButton: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  cancelButton: { backgroundColor: COLORS.cream },
  confirmButton: { backgroundColor: COLORS.amber },
  cancelText: { color: COLORS.amber, fontWeight: "700" },
  confirmText: { color: "#FFFFFF", fontWeight: "700" },
});
