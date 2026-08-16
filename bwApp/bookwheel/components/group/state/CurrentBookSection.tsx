import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  book: {
    id: string;
    title: string;
    owner: string;
    image: {
      uri: string;
    };
  } | null;
  buttonText: string;
  onPress: () => void;
};

export default function CurrentBookSection({
  book,
  buttonText,
  onPress,
}: Props) {
  if (!book) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#513A11",
          }}
        >
          현재 읽고 있는 책
        </Text>

        <View
          style={{
            marginTop: 14,
            padding: 20,
            borderRadius: 18,
            backgroundColor: "#FFF8E8",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#8B6D3A",
              textAlign: "center",
            }}
          >
            현재 읽고 있는 책이 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#513A11",
          marginBottom: 14,
        }}
      >
        현재 읽고 있는 책
      </Text>

      <View
        style={{
          padding: 16,
          borderRadius: 18,
          backgroundColor: "#FFF8E8",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image
            source={{ uri: book.image.uri }}
            style={{
              width: 88,
              height: 124,
              borderRadius: 8,
              backgroundColor: "#F3F3F3",
            }}
            resizeMode="cover"
          />

          <View
            style={{
              flex: 1,
              marginLeft: 14,
              justifyContent: "center",
            }}
          >
            <Text
              numberOfLines={3}
              style={{
                fontSize: 17,
                fontWeight: "700",
                lineHeight: 24,
                color: "#513A11",
              }}
            >
              {book.title}
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "#8B6D3A",
              }}
            >
              {book.owner}님이 전달한 책
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={{
            height: 46,
            marginTop: 16,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#E4A54E",
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
