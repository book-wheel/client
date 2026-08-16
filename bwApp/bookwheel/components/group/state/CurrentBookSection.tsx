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
      <View>
        <Text>현재 읽고 있는 책이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 24,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#513A11",
          marginBottom: 16,
        }}
      >
        현재 읽고 있는 책
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: book.image.uri }}
          style={{
            width: 110,
            height: 155,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />

        <View
          style={{
            flex: 1,
            marginLeft: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#513A11",
            }}
          >
            {book.title}
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              color: "#8B6D3A",
            }}
          >
            {book.owner}님이 전달한 책
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{
          marginTop: 20,
          height: 52,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#E4A54E",
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
