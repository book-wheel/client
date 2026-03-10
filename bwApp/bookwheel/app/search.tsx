import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { common } from "@/styles/common";

export default function Search() {
  const { from, id: rawId } = useLocalSearchParams<{
    from?: string;
    id?: string;
  }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const handleSelectBook = (bookId: string) => {
    switch (from) {
      case "add":
        router.push({
          pathname: "/group/[id]/add-book",
          params: { id, bookId },
        });
        break;

      case "books":
        router.push({
          pathname: "/book-detail/[bookId]/info",
          params: { bookId },
        });
        break;
    }
  };

  return (
    <View>
      <Text>검색 화면 (from: {from})</Text>

      <TouchableOpacity onPress={() => handleSelectBook("3")}>
        <Text style={[common.button, { marginTop: 20 }]}>책1</Text>
      </TouchableOpacity>
    </View>
  );
}
