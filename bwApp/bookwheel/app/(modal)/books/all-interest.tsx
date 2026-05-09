import { router, Stack } from "expo-router";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const bookImage = require("@/assets/images/book.png");
const numColumns = 3;
const itemWidth = 96;

type BookItem = {
  id: string;
  title: string;
  author: string;
  image: ImageSourcePropType;
};

const interestBooks: BookItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  title: `관심 도서 ${index + 1}`,
  author: "책바퀴",
  image: bookImage,
}));

export default function AllInterest() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "관심 도서",
          headerShown: true,
        }}
      />

      <FlatList
        data={interestBooks}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.bookCard}
            onPress={() => router.push("/book-detail/1/info")}
          >
            <Image source={item.image} style={styles.bookImage} />
            <Text style={styles.bookTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {item.author}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bookCard: {
    width: itemWidth,
    alignItems: "center",
  },
  bookImage: {
    width: itemWidth,
    height: 142,
    borderRadius: 10,
    resizeMode: "contain",
  },
  bookTitle: {
    width: "100%",
    marginTop: 12,
    color: "#513A11",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center",
  },
  bookAuthor: {
    width: "100%",
    marginTop: 5,
    color: "#A68D63",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
