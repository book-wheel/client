import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { checkNicknameDuplicate, setupProfile, type MyProfile } from "@/api/auth";
import { getApiErrorMessage } from "@/api/axios";
import { uploadImage } from "@/api/images";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ProfileImage from "@/components/profile/image";

type ImageMode = "unchanged" | "removed" | "new";

type Props = {
  visible: boolean;
  user: MyProfile;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export default function EditProfileModal({
  visible,
  user,
  onClose,
  onSaved,
}: Props) {
  const [nickname, setNickname] = useState(user.nickname);
  const [comment, setComment] = useState(user.comment ?? "");
  const [imageMode, setImageMode] = useState<ImageMode>("unchanged");
  const [newImageUri, setNewImageUri] = useState<string>();
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setNickname(user.nickname);
    setComment(user.comment ?? "");
    setImageMode("unchanged");
    setNewImageUri(undefined);
    setNicknameChecked(false);
    setNicknameMessage("");
    setErrorMessage("");
  }, [user, visible]);

  const trimmedNickname = nickname.trim();
  const nicknameChanged = trimmedNickname !== user.nickname;
  const displayedImageUri = useMemo(() => {
    if (imageMode === "removed") return undefined;
    if (imageMode === "new") return newImageUri;
    return user.profileImageKey ?? undefined;
  }, [imageMode, newImageUri, user.profileImageKey]);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameChecked(false);
    setNicknameMessage("");
    setErrorMessage("");
  };

  const handleCheckNickname = async () => {
    if (!trimmedNickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }

    if (!nicknameChanged) {
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      return;
    }

    try {
      setCheckingNickname(true);
      await checkNicknameDuplicate(trimmedNickname);
      setNicknameChecked(true);
      setNicknameMessage("사용 가능한 닉네임입니다.");
    } catch (error) {
      setNicknameChecked(false);
      setNicknameMessage(
        getApiErrorMessage(error, "닉네임 확인 중 오류가 발생했습니다."),
      );
    } finally {
      setCheckingNickname(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("사진 권한 필요", "프로필 사진을 변경하려면 사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    setNewImageUri(result.assets[0].uri);
    setImageMode("new");
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (saving) return;

    if (!trimmedNickname) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }

    if (nicknameChanged && !nicknameChecked) {
      setErrorMessage("변경한 닉네임의 중복 확인을 해주세요.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const payload: {
        nickname: string;
        comment: string;
        profileImageKey?: string;
      } = {
        nickname: trimmedNickname,
        comment,
      };

      if (imageMode === "removed") {
        payload.profileImageKey = "";
      } else if (imageMode === "new") {
        if (!newImageUri) {
          throw new Error("선택한 이미지를 찾을 수 없습니다.");
        }

        payload.profileImageKey = await uploadImage(
          newImageUri,
          `profile_${Date.now()}.jpg`,
          "profiles",
          "image/jpeg",
        );
      }

      const response = await setupProfile(payload);
      if (!response.data.success) {
        throw new Error(response.data.error?.message ?? "프로필 수정에 실패했습니다.");
      }

      await onSaved();
      onClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "프로필 수정에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>프로필 수정</Text>

            <View style={styles.imageSection}>
              <ProfileImage
                uri={displayedImageUri}
                onCameraPress={handlePickImage}
                size={100}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity onPress={handlePickImage} disabled={saving}>
                  <Text style={styles.actionText}>사진 변경</Text>
                </TouchableOpacity>
                {imageMode !== "removed" && displayedImageUri && (
                  <TouchableOpacity
                    onPress={() => {
                      setImageMode("removed");
                      setNewImageUri(undefined);
                    }}
                    disabled={saving}
                  >
                    <Text style={styles.removeText}>사진 삭제</Text>
                  </TouchableOpacity>
                )}
                {imageMode === "removed" && (
                  <TouchableOpacity
                    onPress={() => setImageMode("unchanged")}
                    disabled={saving}
                  >
                    <Text style={styles.actionText}>기존 사진 유지</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {nicknameMessage && (
              <Text style={nicknameChecked ? styles.successText : styles.messageText}>
                {nicknameMessage}
              </Text>
            )}
            <Input
              value={nickname}
              onChangeText={handleNicknameChange}
              placeholder="닉네임"
              rightButton={{
                label: checkingNickname ? "확인 중" : "중복확인",
                onPress: handleCheckNickname,
                disabled: saving || checkingNickname || !nicknameChanged,
              }}
            />
            <Input
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="나와 나의 독서 취향을 한 줄로 적어보세요!"
              multiline
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={saving}
              >
                <Text>취소</Text>
              </TouchableOpacity>
              <View style={styles.saveButton}>
                <Button
                  title={saving ? "저장 중..." : "저장"}
                  onPress={handleSave}
                  disabled={saving}
                  style={{ width: "100%", marginBottom: 0 }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    maxHeight: "88%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#513A11",
    marginBottom: 20,
  },
  imageSection: {
    alignItems: "center",
  },
  imageActions: {
    flexDirection: "row",
    gap: 14,
    marginTop: -14,
    marginBottom: 20,
  },
  actionText: {
    color: "#513A11",
    fontSize: 13,
    fontWeight: "600",
  },
  removeText: {
    color: "#C65B5B",
    fontSize: 13,
    fontWeight: "600",
  },
  commentInput: {
    height: 93,
    textAlignVertical: "top",
  },
  messageText: {
    color: "#E4A54E",
    fontSize: 13,
    marginBottom: 4,
  },
  successText: {
    color: "#6BA368",
    fontSize: 13,
    marginBottom: 4,
  },
  errorText: {
    color: "#C65B5B",
    fontSize: 13,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6DDCF",
    borderRadius: 12,
  },
  saveButton: {
    flex: 1,
  },
});
