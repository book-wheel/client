import { router, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";

import GalleryImageGrid from "../../../components/books/GalleryImageGrid";
import type { GalleryItem } from "../../../components/books/types";

const galleryImage = require("@/assets/images/comment.png");

const galleryItems: GalleryItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: String(index + 1),
  image: galleryImage,
  extraCount: index % 3 === 0 ? 3 : undefined,
}));

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
        items={galleryItems}
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
