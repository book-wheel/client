import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { GalleryItem } from "./types";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1)) / numColumns;

type Props = {
  items: GalleryItem[];
  isLoading?: boolean;
  onEndReached?: () => void;
  onPressItem: (item: GalleryItem) => void;
};

export default function GalleryImageGrid({
  items,
  isLoading = false,
  onEndReached,
  onPressItem,
}: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.8}
          onPress={() => onPressItem(item)}
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#E4A54E" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  columnWrapper: {
    gap,
    marginBottom: gap,
  },
  loadingContainer: {
    paddingVertical: 20,
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
