import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  coverImageUrl: string;
  onPress: () => void;
};

export default function ReadingBookCard({
  title,
  coverImageUrl,
  onPress,
}: Props) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [coverImageUrl]);

  const shouldShowCover = Boolean(coverImageUrl) && !hasImageError;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityLabel={`${title}을 읽고 있는 모임으로 이동`}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.coverButton}
      >
        {shouldShowCover ? (
          <Image
            source={{ uri: coverImageUrl }}
            style={styles.image}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <View style={styles.coverFallback}>
            <Text style={styles.coverFallbackText} numberOfLines={4}>
              {title}
            </Text>
          </View>
        )}
      </Pressable>
      <TouchableOpacity
        style={styles.roomButton}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Text style={styles.roomButtonText}>모임으로 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 184,
    minHeight: 256,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFCF3",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  coverButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 126,
    height: 184,
    borderRadius: 10,
    resizeMode: "cover",
  },
  coverFallback: {
    width: 126,
    height: 184,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#FCF5D7",
  },
  coverFallbackText: {
    color: "#513A11",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
  },
  roomButton: {
    width: "100%",
    height: 30,
    marginTop: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCF5D7",
  },
  roomButtonText: {
    color: "#7B6A4A",
    fontSize: 13,
    fontWeight: "700",
  },
});
