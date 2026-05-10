import { Image, Pressable, StyleSheet, View } from "react-native";
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
          <Image source={item.image} style={styles.image} />
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
});
