import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  uri?: string;
  onPress?: () => void; // 전체 눌렀을 때
  onCameraPress?: () => void; // 카메라 버튼
  size?: number;
};

export default function ProfileImage({
  uri,
  onPress,
  onCameraPress,
  size = 120,
}: Props) {
  const source = uri ? { uri } : require("@/assets/images/logo.png");

  return (
    <View style={{ position: "relative", marginBottom: 25 }}>
      {/* 프로필 사진 */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.wrapper,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: "#513A11",
            borderWidth: 1,
          }}
        />
      </TouchableOpacity>

      {/* 카메라 버튼 */}
      <TouchableOpacity
        style={[
          styles.camera,
          {
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: (size * 0.3) / 2,
            bottom: 0,
            right: 0,
          },
        ]}
        onPress={onCameraPress}
        activeOpacity={0.8}
      >
        <Image
          source={require("@/assets/images/camera.png")}
          style={{ resizeMode: "contain", width: "90%", height: "90%" }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
});
