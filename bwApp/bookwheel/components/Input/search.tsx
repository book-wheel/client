import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchProps = {
  value: string; // 현재 검색어
  onChange: (text: string) => void; // 입력 변경
  placeholder?: string; // 힌트 텍스트
  onSubmit?: () => void; // 엔터/검색 버튼 눌렀을 때
  loading?: boolean; // 서버 요청중일 때
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "검색",
  onSubmit,
  loading = false,
}: SearchProps) {
  return (
    <View style={styles.wrapper}>
      {/* 아이콘 */}
      <Ionicons name="search" size={18} color="#999" style={styles.icon} />

      {/* 입력창 */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      {/* 로딩 or 지우기 버튼 */}
      {loading ? (
        <ActivityIndicator size="small" />
      ) : value.length > 0 ? (
        <TouchableOpacity onPress={() => onChange("")}>
          <Ionicons name="close-circle" size={18} color="#bbb" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    height: 42,
    width: "96%",
    borderColor: "#513A11",
    borderWidth: 1,
    alignSelf: "center",
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#513A11",
  },
});
