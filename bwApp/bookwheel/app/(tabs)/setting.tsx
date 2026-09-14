import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { logout, deleteAccount, getMyInfo, type MyProfile } from "@/api/auth";
import { getApiErrorMessage } from "@/api/axios";
import ProfileImage from "@/components/profile/image";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { unregisterPushNotifications } from "@/services/pushNotifications";

export default function Settings() {
  const [user, setUser] = useState<MyProfile | null>(null);
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMyInfo = async () => {
    try {
      setLoading(true);
      const res = await getMyInfo();

      if (res.data.success && res.data.data) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMyInfo();
  }, []);

  //로그아웃----------------------------------------
  const handleLogout = async () => {
    try {
      await unregisterPushNotifications();
    } catch (error) {
      console.log("푸시 토큰 해제 실패", error);
    }

    try {
      await logout();
    } catch (error) {
      console.log("서버 로그아웃 실패", error);
    } finally {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      router.replace("/auth/login");
    }
  };

  //회원탈퇴--------------------------------------
  const handleDelete = async () => {
    if (!user || deleting) return;

    const requiresPassword = user.social === "NONE";
    if (requiresPassword && !password) {
      setDeleteError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const res = await deleteAccount(requiresPassword ? password : undefined);
      if (!res.data.success) {
        throw new Error(res.data.error?.message ?? "회원탈퇴에 실패했습니다.");
      }

      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      setPassword("");
      setModalVisible(false);
      setUser(null);
      router.replace("/auth/login");
    } catch (error) {
      setPassword("");
      setDeleteError(
        getApiErrorMessage(error, "회원탈퇴에 실패했습니다. 다시 시도해주세요."),
      );
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!user) return;

    if (user.social === "NONE" && !password) {
      setDeleteError("비밀번호를 입력해주세요.");
      return;
    }

    Alert.alert("회원탈퇴", "탈퇴하면 계정을 복구할 수 없습니다. 정말 탈퇴하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
        onPress: () => setPassword(""),
      },
      { text: "탈퇴", style: "destructive", onPress: () => void handleDelete() },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#E4A54E" />
        <Text style={{ marginTop: 8 }}>불러오는 중...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>유저 정보를 불러올 수 없어요</Text>
        <TouchableOpacity onPress={() => void fetchMyInfo()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#E4A54E" }}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 120,
        backgroundColor: "#fff",
      }}
    >
      {/* 프로필 */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <ProfileImage uri={user.profileImageKey ?? undefined} showCamera={false} size={90} />

        <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 1 }}>
          {user.nickname}
        </Text>

        <Text style={{ color: "#999", marginTop: 6, fontSize: 13 }}>
          {user.comment || "한 줄 소개가 없어요"}
        </Text>

        <TouchableOpacity onPress={() => setEditVisible(true)} style={{ marginTop: 14 }}>
          <Text style={{ color: "#E4A54E", fontSize: 13 }}>프로필 수정</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 1, backgroundColor: "#eee", marginBottom: 30 }} />

      {/* 정보 카드 */}
      <View
        style={{
          backgroundColor: "#F8F8F8",
          borderRadius: 14,
          padding: 18,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#aaa", fontSize: 11 }}>아이디</Text>
        <Text style={{ marginBottom: 14, fontSize: 14 }}>{user.loginId}</Text>

        <Text style={{ color: "#aaa", fontSize: 11 }}>이메일</Text>
        <Text style={{ fontSize: 14 }}>{user.mail}</Text>
      </View>

      {/* 로그아웃/회원탈퇴 액션 */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#eee",
          }}
          onPress={() => void handleLogout()}
        >
          <Text style={{ fontWeight: "500" }}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => {
            setPassword("");
            setDeleteError("");
            setModalVisible(true);
          }}
        >
          <Text style={{ color: "#E4A54E", fontWeight: "500" }}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      <EditProfileModal
        visible={editVisible}
        user={user}
        onClose={() => setEditVisible(false)}
        onSaved={fetchMyInfo}
      />

      {/* 탈퇴 확인 */}
      <DeleteAccountModal
        visible={modalVisible}
        password={password}
        requiresPassword={user.social === "NONE"}
        loading={deleting}
        errorMessage={deleteError}
        onChangePassword={(value) => {
          setPassword(value);
          setDeleteError("");
        }}
        onForgotPassword={() => {
          setPassword("");
          setDeleteError("");
          setModalVisible(false);
          router.push("/auth/(tabs)/pwfind");
        }}
        onClose={() => {
          if (deleting) return;
          setPassword("");
          setDeleteError("");
          setModalVisible(false);
        }}
        onConfirm={confirmDelete}
      />
    </View>
  );
}
