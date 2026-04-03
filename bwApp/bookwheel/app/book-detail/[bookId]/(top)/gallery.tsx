import React from "react";
import {View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    Text,
} from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1)) / numColumns;

interface GalleryItem {
    id: string;
    imageUrls: string[];
}

const DUMMY_GALLERY_DATA: GalleryItem[] = [
    {
        id: "1",
        imageUrls: [
            "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
            "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
            "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
            "https://img.khan.co.kr/news/2025/06/08/news-p.v1.20250608.2d62e7e6a9434f35bebb2a1fe2c6523b_P1.png",
        ],
    },
    {
        id: "2",
        imageUrls: ["https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg"],
    },
    {
        id: "3",
        imageUrls: [
            "https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg",
            "https://www.kukinews.com/data/kuk/image/2025/09/27/kuk20250927000115.800x.9.jpg",
        ],
    },
];

export default function Gallery() {
    const { bookId } = useGlobalSearchParams<{ bookId: string }>();
    const galleryData = DUMMY_GALLERY_DATA;

    const handleAddPhoto = () => {
        if (!bookId) {
            Alert.alert("알림", "책 ID를 찾을 수 없습니다.");
            return;
        }

        router.push(`/books`);
    };

    const renderItem = ({ item }: { item: GalleryItem }) => {
        const thumbnail = item.imageUrls[0];
        const extraCount = item.imageUrls.length - 1;

        return (
            <TouchableOpacity
                style={styles.imageContainer}
                activeOpacity={0.8}
                onPress={() =>
                    router.push({
                        pathname: "../[galleryId]/post",
                        params: {
                            bookId,
                            galleryId: item.id,
                        },
                    })
                }
            >
                <Image source={{ uri: thumbnail }} style={styles.image} />

                {extraCount > 0 && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>+{extraCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={galleryData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={handleAddPhoto}
            >
                <Feather name="plus" size={32} color="#E4A54E" />
            </TouchableOpacity>
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
    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#FCF5D7",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        elevation: 5,
    },
});