import { Ionicons } from "@expo/vector-icons";
import type { ImagePickerAsset } from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import completedBooksStyles from "@/styles/completedBooks.style";

const MAX_IMAGE_COUNT = 5;

type Props = {
  images?: ImagePickerAsset[];
  onAddPress?: () => void;
  onRemove?: (uri: string) => void;
};

export default function PhotoUpload({
  images = [],
  onAddPress,
  onRemove,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const carouselWidth = windowWidth - 60;
  const listRef = useRef<FlatList<ImagePickerAsset>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const nextIndex = Math.min(currentIndex, images.length - 1);
    setCurrentIndex(nextIndex);
    listRef.current?.scrollToIndex({
      index: nextIndex,
      animated: false,
    });
  }, [currentIndex, images.length]);

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / carouselWidth,
    );
    setCurrentIndex(nextIndex);
  };

  return (
    <View style={completedBooksStyles.sectionBox}>
      <Text style={completedBooksStyles.sectionTitle}>
        인증 사진 업로드 ({images.length}/{MAX_IMAGE_COUNT})
      </Text>

      {images.length > 0 ? (
        <View style={[styles.carousel, { width: carouselWidth }]}>
          <FlatList
            ref={listRef}
            data={images}
            horizontal
            pagingEnabled
            keyExtractor={(image) => image.uri}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: carouselWidth,
              offset: carouselWidth * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            renderItem={({ item }) => (
              <View
                style={[styles.imagePage, { width: carouselWidth }]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="contain"
                />

                {!!onRemove && (
                  <TouchableOpacity
                    accessibilityLabel="선택한 사진 삭제"
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    hitSlop={8}
                    onPress={() => onRemove(item.uri)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          accessibilityLabel="사진 선택"
          accessibilityRole="button"
          activeOpacity={0.8}
          disabled={!onAddPress}
          onPress={onAddPress}
          style={[styles.emptyPicker, { width: carouselWidth }]}
        >
          <Ionicons name="images-outline" size={38} color="#8A7657" />
          <Text style={styles.emptyPickerText}>사진 선택</Text>
        </TouchableOpacity>
      )}

      {images.length > 0 && images.length < MAX_IMAGE_COUNT && (
        <TouchableOpacity
          accessibilityLabel="사진 추가"
          accessibilityRole="button"
          activeOpacity={0.8}
          disabled={!onAddPress}
          onPress={onAddPress}
          style={styles.addButton}
        >
          <Ionicons name="add" size={20} color="#513A11" />
          <Text style={styles.addButtonText}>사진 추가</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    height: 300,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#F5F2EC",
  },
  imagePage: {
    height: 300,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(81, 58, 17, 0.82)",
  },
  imageCounter: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(81, 58, 17, 0.82)",
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyPicker: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F5F2EC",
  },
  emptyPickerText: {
    color: "#6F5B3E",
    fontSize: 15,
    fontWeight: "600",
  },
  addButton: {
    minHeight: 44,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
    backgroundColor: "#F2E8D8",
  },
  addButtonText: {
    color: "#513A11",
    fontSize: 14,
    fontWeight: "700",
  },
});
