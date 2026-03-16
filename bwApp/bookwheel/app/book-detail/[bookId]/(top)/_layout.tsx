import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext, Stack, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);
const { width } = Dimensions.get('window');

export default function BookDetailTabsLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets(); // 기기별 노치/상태바 높이를 가져옴

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 상단 하얀색 구역 (헤더 + 이미지) */}
            <View style={[styles.topSection, { paddingTop: insets.top }]}>

                {/* 1. 네비게이션 바 */}
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    {/* 타이틀을 왼쪽으로 밀착 */}
                    <Text style={styles.navTitle}>도서 검색</Text>
                </View>

                {/* 2. 도서 비주얼 구역 */}
                <View style={styles.visualSection}>
                    <Image
                        source={require("@/assets/images/book.png")}
                        style={styles.bookImage}
                        resizeMode="cover"
                    />

                    {/* 배지를 이미지 바로 아래에 배치 */}
                    <View style={styles.infoBadge}>
                        <Text style={styles.bookTitle}>내 남편을 팝니다</Text>
                        <View style={styles.subInfoRow}>
                            {/* 작가 이름 배지 */}
                            <View style={styles.smallBadge}>
                                <Text style={styles.smallBadgeText}>고요한</Text>
                            </View>
                            {/* 페이지 수 배지 */}
                            <View style={styles.smallBadge}>
                                <Text style={styles.smallBadgeText}>236p</Text>
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
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        height: 50,
    },
    backButton: {
        padding: 4,
        marginRight: 4,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    visualSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    bookImage: {
        width: 130,
        height: 185,
        borderRadius: 6,
        elevation: 5,
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