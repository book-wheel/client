import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, useLocalSearchParams, withLayoutContext } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getBookDetail } from "@/api/books";
import { BookDetailContext } from "@/contexts/book-detail";
import type { BookDetailContent } from "@/types/books";
const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function BookDetailTabsLayout() {
    const { bookId } = useLocalSearchParams<{ bookId?: string | string[] }>();
    const isbn = Array.isArray(bookId) ? bookId[0] : bookId;

    const [book, setBook] = useState<BookDetailContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const [isInterested, setIsInterested] = useState(false);

    useEffect(() => {
        if (!isbn) return;
    
    const fetchBookDetail = async () => {
        setBook(null);
        setIsLoading(true);
        setError(null);

        try {
            const response = await getBookDetail(isbn);

            if (response.data.success && response.data.data) {
                setBook(response.data.data);
            } 
        }catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
        
    };
    fetchBookDetail();
}, [isbn]);
    
    return (
        <BookDetailContext.Provider value={{ book, isLoading, error, isbn }}>
        <View style={styles.container}>
            {/* 1. 네비게이션 바 */}
            <Stack.Screen options={{
                headerShown: true,
                title: "도서 검색",
                }}
            />

            {/* 상단 하얀색 구역 (헤더 + 이미지) */}
            <View style={styles.topSection}>

                {/* 2. 도서 비주얼 구역 */}
                <View style={styles.visualSection}>
                    <View style={styles.bookImageWrap}>
                        <Image
                            source={
                                book?.cover
                                ? { uri: book.cover }
                                : require("@/assets/images/book.png")
                            }
                            style={styles.bookImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            accessibilityLabel={isInterested ? "관심도서 해제" : "관심도서 등록"}
                            accessibilityRole="button"
                            activeOpacity={0.75}
                            onPress={() => setIsInterested((prev) => !prev)}
                            style={styles.interestButton}
                        >
                            <Ionicons
                                name={isInterested ? "heart" : "heart-outline"}
                                size={24}
                                color={isInterested ? "#E4A54E" : "#513A11"}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* 배지를 이미지 바로 아래에 배치 */}
                    <View style={styles.infoBadge}>
                        <Text style={styles.bookTitle}>&lt; {book?.title ?? "도서 정보"} &gt;</Text>
                        <View style={styles.subInfoRow}>
                            {/* 작가 이름 배지 */}
                            <View style={styles.smallBadge}>
                                <Text style={styles.smallBadgeText}>{book?.author ?? "저자명"}</Text>
                            </View>
                            {/* 페이지 수 배지 */}
                            <View style={styles.smallBadge}>
                                <Text style={styles.smallBadgeText}>{book?.itemPage ? `${book.itemPage}p` : "페이지 정보 없음"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* 3. 하단 탭 영역 (흰색 배경) */}
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <TopTabs
                    screenOptions={{
                        tabBarActiveTintColor: '#513A11',
                        tabBarInactiveTintColor: '#A19681',
                        tabBarIndicatorStyle: {
                            backgroundColor: '#513A11',
                            height: 2.5,
                        },
                        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
                        tabBarStyle: {
                            backgroundColor: '#FFF',
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 1,
                            borderColor: '#F0E6D8',
                            paddingTop: 5,
                        },
                    }}
                >
                    <TopTabs.Screen name="info" options={{ title: "소개" }} />
                    <TopTabs.Screen name="review" options={{ title: "리뷰" }} />
                    <TopTabs.Screen name="gallery" options={{ title: "갤러리" }} />
                </TopTabs>
            </View>
        </View>
        </BookDetailContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    topSection: {
        backgroundColor: '#FFF',
        paddingBottom: 10,
        zIndex: 10,
    },
    visualSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    bookImageWrap: {
        position: 'relative',
    },
    bookImage: {
        width: 130,
        height: 185,
        borderRadius: 6,
        elevation: 5,
    },
    interestButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 5,
        elevation: 4,
    },
    infoBadge: {
        marginTop: 10,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    bookTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    smallBadge: {
        backgroundColor: '#F3F0EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    smallBadgeText: {
        fontSize: 12,
        color: '#7A6F5C',
        fontWeight: '600',
    },
});
