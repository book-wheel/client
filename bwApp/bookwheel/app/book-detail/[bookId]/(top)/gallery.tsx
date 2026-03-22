import React from "react";
import {View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert} from "react-native";
import {Link, router, useGlobalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

const { width } = Dimensions.get("window");
const numColumns = 3;
const gap = 2;
const itemSize = (width - gap * (numColumns - 1)) / numColumns;

interface GalleryItem {
    id: string;
    imageUrl: string;
}

const DUMMY_GALLERY_DATA: GalleryItem[] = [
    { id: "1", imageUrl: "https://picsum.photos/id/10/300/300" },
    { id: "2", imageUrl: "https://picsum.photos/id/11/300/300" },
    { id: "3", imageUrl: "https://picsum.photos/id/12/300/300" },
    { id: "4", imageUrl: "https://picsum.photos/id/13/300/300" },
    { id: "5", imageUrl: "https://picsum.photos/id/14/300/300" },
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

    const renderItem = ({ item }: { item: GalleryItem }) => (
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
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* 갤러리 3열 그리드 */}
            <FlatList
                data={galleryData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />

            {/* 리뷰 작성 버튼 (+) */}
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

// ==========================================
// 스타일 시트
// ==========================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    listContainer: {
        paddingBottom: 100,
    },
    columnWrapper: {
        gap: gap,
        marginBottom: gap,
    },
    imageContainer: {
        width: itemSize,
        height: itemSize,
        backgroundColor: "#E0E0E0",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    // 화면 위에 강제로 띄우는 플로팅 버튼 스타일
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