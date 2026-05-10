import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";
import { mockGalleryItems } from "@/mocks/books/gallery";

import GalleryImageGrid from "../../../components/books/GalleryImageGrid";

export default function AllGallery() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "교환독서의 순간들",
          headerShown: true,
        }}
      />

      <GalleryImageGrid
        items={mockGalleryItems}
        onPressItem={() => router.push("/book-detail/1/2/post")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
