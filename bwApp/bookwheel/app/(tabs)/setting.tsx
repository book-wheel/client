import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, deleteAccount, getMyInfo } from "@/api/auth";
import { useState, useEffect } from "react";
import ProfileImage from "@/components/profile/image";
import DeleteAccountModal from "@/components/DeleteAccountModal";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await getMyInfo();

        console.log("유저정보:", res.data.data);

        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  //로그아웃----------------------------------------
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("서버 로그아웃 실패", e);
    } finally {
      //프론트에선 무조건 토큰 제거
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      router.replace("/auth/login");
    }
  };

  //회원탈퇴--------------------------------------
  const handleDelete = async () => {
    try {
      await deleteAccount(password);
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      router.replace("/auth/login");
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDelete = () => {
    if (!password) return;

    Alert.alert("회원탈퇴", "정말로 탈퇴하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "탈퇴", style: "destructive", onPress: handleDelete },
    ]);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>불러오는 중...</Text>
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
        <ProfileImage uri={user.profileImageKey} showCamera={false} size={90} />

        <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 1 }}>
          {user.nickname}
        </Text>

        <Text style={{ color: "#999", marginTop: 6, fontSize: 13 }}>
          {user.comment || "한 줄 소개가 없어요"}
        </Text>
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
          onPress={handleLogout}
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
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#E4A54E", fontWeight: "500" }}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 탈퇴 확인 */}
      <DeleteAccountModal
        visible={modalVisible}
        password={password}
        onChangePassword={setPassword}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          confirmDelete();
        }}
      />
    </View>
  );
}
