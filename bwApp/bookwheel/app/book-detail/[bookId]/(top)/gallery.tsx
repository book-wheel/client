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
            "https://picsum.photos/id/10/300/300",
            "https://picsum.photos/id/11/300/300",
            "https://picsum.photos/id/12/300/300",
            "https://picsum.photos/id/13/300/300",
        ],
    },
    {
        id: "2",
        imageUrls: ["https://picsum.photos/id/14/300/300"],
    },
    {
        id: "3",
        imageUrls: [
            "https://picsum.photos/id/15/300/300",
            "https://picsum.photos/id/16/300/300",
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

        router.push(`/book-detail/${bookId}/add-review`);
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
        minWidth: 34,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: "rgba(252,245,215,0.92)",
        justifyContent: "center",
        alignItems: "center",
    },
    countBadgeText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#8A6A2F",
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