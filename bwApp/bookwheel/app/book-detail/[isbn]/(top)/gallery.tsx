import { Feather } from "@expo/vector-icons";
import GalleryImageGrid from "@/components/books/GalleryImageGrid";
import type { GalleryItem } from "@/components/books/types";
import { Colors } from "@/constants/theme";
import { router, useGlobalSearchParams } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface GalleryPost {
  id: string;
  imageUrls: string[];
}

const DUMMY_GALLERY_DATA: GalleryPost[] = [
  {
    id: "1",
    imageUrls: [
      "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
      "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
      "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
      "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
    ],
  },
  {
    id: "2",
    imageUrls: ["https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg"],
  },
  {
    id: "3",
    imageUrls: [
      "https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg",
      "https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg",
    ],
  },
];

const galleryItems: GalleryItem[] = DUMMY_GALLERY_DATA.map((post) => ({
  id: post.id,
  image: { uri: post.imageUrls[0] },
  extraCount: post.imageUrls.length - 1,
}));

export default function Gallery() {
  const { isbn } = useGlobalSearchParams<{ isbn: string }>();

  const handleAddPhoto = () => {
    if (!isbn) {
      Alert.alert("알림", "ISBN을 찾을 수 없습니다.");
      return;
    }

    router.push("/books");
  };

  const handlePressGalleryItem = (galleryId: string) => {
    router.push({
      pathname: "../[galleryId]/post",
      params: {
        isbn,
        galleryId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <GalleryImageGrid items={galleryItems} onPressItem={(item) => handlePressGalleryItem(item.id)} />

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={handleAddPhoto}>
        <Feather name="plus" size={32} color="#E4A54E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCF5D7",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 5,
  },
});
