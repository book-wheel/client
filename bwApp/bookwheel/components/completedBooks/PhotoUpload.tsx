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

  const carouselWidth = windowWidth - 40;

  const listRef = useRef<FlatList<ImagePickerAsset>>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const lastIndex = images.length - 1;

    if (currentIndex <= lastIndex) return;

    setCurrentIndex(lastIndex);

    listRef.current?.scrollToIndex({
      index: lastIndex,
      animated: false,
    });
  }, [images.length, currentIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / carouselWidth,
    );

    setCurrentIndex(nextIndex);
  };

  return (
    <View style={completedBooksStyles.sectionBox}>
      {/* 제목 영역 */}
      <View style={styles.titleRow}>
        <View>
          <Text style={completedBooksStyles.sectionTitle}>인증 사진</Text>

          <Text style={completedBooksStyles.sectionDescription}>
            책을 다 읽은 순간을 남겨주세요
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={completedBooksStyles.imageCount}>
            {images.length}/{MAX_IMAGE_COUNT}
          </Text>
        </View>
      </View>

      {/* 사진이 있는 경우 */}
      {images.length > 0 ? (
        <View
          style={[
            styles.carousel,
            {
              width: carouselWidth,
            },
          ]}
        >
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
                style={[
                  styles.imagePage,
                  {
                    width: carouselWidth,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="cover"
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

          {/* 현재 사진 번호 */}
          <View style={styles.imageCounter}>
            <Text style={completedBooksStyles.imageCounterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      ) : (
        /* 사진이 아직 없는 경우 */
        <TouchableOpacity
          accessibilityLabel="사진 선택"
          accessibilityRole="button"
          activeOpacity={0.85}
          disabled={!onAddPress}
          onPress={onAddPress}
          style={[
            styles.emptyPicker,
            {
              width: carouselWidth,
            },
          ]}
        >
          <View style={styles.cameraCircle}>
            <Ionicons name="camera-outline" size={28} color="#E4A54E" />
          </View>

          <Text style={completedBooksStyles.emptyPickerText}>사진 선택</Text>

          <Text style={styles.emptyPickerDescription}>
            최대 5장까지 추가할 수 있어요
          </Text>
        </TouchableOpacity>
      )}

      {/* 사진 추가 */}
      {images.length > 0 && images.length < MAX_IMAGE_COUNT && (
        <TouchableOpacity
          accessibilityLabel="사진 추가"
          accessibilityRole="button"
          activeOpacity={0.8}
          disabled={!onAddPress}
          onPress={onAddPress}
          style={styles.addButton}
        >
          <Ionicons name="add" size={20} color="#E4A54E" />

          <Text style={completedBooksStyles.addButtonText}>사진 추가</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  countBadge: {
    minWidth: 48,
    height: 30,

    paddingHorizontal: 10,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 15,

    backgroundColor: "#FCF5D7",
  },

  carousel: {
    height: 300,

    overflow: "hidden",

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8DDBF",

    backgroundColor: "#FFFCF3",
  },

  imagePage: {
    height: 300,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  removeButton: {
    position: "absolute",

    top: 14,
    right: 14,

    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 17,

    backgroundColor: "rgba(81, 58, 17, 0.72)",
  },

  imageCounter: {
    position: "absolute",

    bottom: 14,
    alignSelf: "center",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "rgba(81, 58, 17, 0.72)",
  },

  // 사진이 없을 때
  emptyPicker: {
    height: 220,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8DDBF",

    backgroundColor: "#FFFCF3",
  },

  cameraCircle: {
    width: 52,
    height: 52,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 26,

    backgroundColor: "#FCF5D7",
  },

  emptyPickerDescription: {
    marginTop: 6,

    fontSize: 13,
    fontWeight: "500",

    color: "#A98B5A",
  },

  // 사진 추가 버튼
  addButton: {
    height: 48,

    marginTop: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    borderRadius: 14,

    backgroundColor: "#FCF5D7",
  },
});
