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

            {/* 상단 베이지 구역 (헤더 + 이미지) */}
            <View style={[styles.topSection, { paddingTop: insets.top }]}>

                {/* 1. 네비게이션 바 */}
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>도서 검색</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* 2. 도서 비주얼 구역 */}
                <View style={styles.visualSection}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150x220' }}
                        style={styles.bookImage}
                        resizeMode="cover"
                    />

                    {/* 배지를 이미지 바로 아래에 배치 (겹침 효과 포함) */}
                    <View style={styles.infoBadge}>
                        <Text style={styles.bookTitle}>내 남편을 팝니다</Text>
                        <View style={styles.subInfoRow}>
                            <Text style={styles.authorText}>고요한</Text>
                            <View style={styles.dotSeparator} />
                            <Text style={styles.pageText}>236p</Text>
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
                            width: 40,
                            marginLeft: (width / 3 - 40) / 2,
                        },
                        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
                        tabBarStyle: {
                            backgroundColor: '#FFF',
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 1,
                            borderColor: '#F0E6D8'
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
        backgroundColor: '#FFF', // 기본 배경은 흰색
    },
    topSection: {
        backgroundColor: '#F6F4EE', // 상단 전체 베이지색
        paddingBottom: 20,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 50,
    },
    backButton: {
        padding: 4,
    },
    navTitle: {
        fontSize: 16,
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
        // 그림자
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    infoBadge: {
        backgroundColor: '#FFF',
        marginTop: -25, // 이미지와 겹치게 위로 올림
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        // 배지 그림자 (떠 있는 느낌)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    bookTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorText: {
        fontSize: 13,
        color: '#777',
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#DDD',
        marginHorizontal: 8,
    },
    pageText: {
        fontSize: 13,
        color: '#777',
    },
});