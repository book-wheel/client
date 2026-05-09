import { router, Stack } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/theme";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1)) / numColumns;
const galleryImage = require("@/assets/images/comment.png");

type GalleryItem = {
  id: string;
  image: ImageSourcePropType;
  extraCount?: number;
};

const galleryItems: GalleryItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: String(index + 1),
  image: galleryImage,
  extraCount: index % 3 === 0 ? 3 : undefined,
}));

export default function AllGallery() {
  const handlePressPost = () => {
    router.push("/book-detail/1/2/post");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "교환독서의 순간들",
          headerShown: true,
        }}
      />

      <FlatList
        data={galleryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageContainer}
            activeOpacity={0.8}
            onPress={handlePressPost}
          >
            <Image source={item.image} style={styles.image} />

            {!!item.extraCount && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>+{item.extraCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    paddingBottom: 100,
  },
  columnWrapper: {
    gap,
    marginBottom: gap,
  },
  imageContainer: {
    width: itemSize,
    height: itemSize,
    backgroundColor: "#E0E0E0",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  countBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 9,
    backgroundColor: "rgba(228, 228, 228, 0.68)",
    justifyContent: "center",
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
  },
});
