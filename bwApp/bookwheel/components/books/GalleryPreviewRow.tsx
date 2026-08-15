import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { GalleryItem } from "./types";

type Props = {
  items: GalleryItem[];
  onPressItem: (item: GalleryItem) => void;
};

export default function GalleryPreviewRow({ items, onPressItem }: Props) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={styles.item}
          onPress={() => onPressItem(item)}
        >
          {item.image ? (
            <Image source={item.image} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          {!!item.extraCount && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>+{item.extraCount}</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: "#EDEDED",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F2EC",
  },
  countBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 26,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "rgba(81, 58, 17, 0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
