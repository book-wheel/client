import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import GroupListExtended, { ExtendedGroup } from "@/components/groups/GroupListExtended";

// 1. 데이터 타입 정의 (API 명세서 역할)
interface BookDetail {
    id: string;
    description: string;
    tableOfContents: string[];
    relatedGroups: ExtendedGroup[];
}

// 2. 목업 데이터 분리 (나중에 실제 API 응답값이 될 녀석들)
const MOCK_BOOK_DATA: BookDetail = {
    id: "1",
    description: "브런치북 10회 대상 수상작. 아내를 파는 남편과 남편을 사는 여자들, 그리고 그들을 둘러싼 비밀스러운 이야기. " +
        "브런치북 10회 대상 수상작. 아내를 파는 남편과 남편을 사는 여자들, 그리고 그들을 둘러싼 비밀스러운 이야기. 고요한 작가의 날카로운 시선과 흡입력 있는 전개가 돋보이는 소설입니다." +
        "고요한 작가의 날카로운 시선과 흡입력 있는 전개가 돋보이는 소설입니다.",
    tableOfContents: ["1. 윤해리", "2. 김마틴", "3. 썸머", "4. 제이", "에필로그"],
    relatedGroups: [
        {
            id: "1",
            title: "오프라인 독서 모임",
            description: "같이 책 읽고 이야기 나눠요!",
            isOffline: true,
            region: "대전",
            isPrivate: true,
            status: "scheduled",
            total: 3,
            current: 3,
            maxPeople: 6,
            dday: 5,
            startDate: "26/01/27",
        }
    ]
};

export default function Info() {
    // 3. 데이터를 담을 상태 관리 (초기값은 null 혹은 빈 객체)
    const [data, setData] = useState<BookDetail | null>(null);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [numOfLines, setNumOfLines] = useState(0);
    const [showFullToc, setShowFullToc] = useState(false);

    // 4. API 호출 (현재 목업)
    useEffect(() => {
        // 실제로는 여기서 API를 호출하겠지만, 지금은 목업 데이터를 넣어줌
        setData(MOCK_BOOK_DATA);
    }, []);

    const handleTextLayout = useCallback((e: any) => {
        if (numOfLines === 0) {
            setNumOfLines(e.nativeEvent.lines.length);
        }
    }, [numOfLines]);

    // 데이터가 로딩 중일 때 처리
    if (!data) return <View style={styles.container}><Text>로딩 중...</Text></View>;

    const isDescLong = numOfLines > 2;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 책 소개 섹션 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>책 소개</Text>
                <Text
                    style={styles.bodyText}
                    onTextLayout={handleTextLayout}
                    numberOfLines={numOfLines === 0 ? undefined : (showFullDesc ? undefined : 2)}
                >
                    {data.description}
                </Text>
                {isDescLong && (
                    <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
                        <Text style={styles.moreBtn}>{showFullDesc ? "접기 ▴" : "더보기 ▾"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.divider} />

            {/* 목차 섹션 - map을 사용하여 리스트 출력 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>목차</Text>
                <View style={styles.tocBox}>
                    {data.tableOfContents.slice(0, showFullToc ? undefined : 3).map((item, index) => (
                        <Text key={index} style={styles.tocItem}>{item}</Text>
                    ))}
                </View>
                {data.tableOfContents.length > 3 && (
                    <TouchableOpacity onPress={() => setShowFullToc(!showFullToc)}>
                        <Text style={styles.moreBtn}>{showFullToc ? "접기 ▴" : "더보기 ▾"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.thickDivider} />

            {/* 모임 연동 섹션 */}
            <View style={styles.section}>
                <Text style={styles.groupTitle}>이 책을 읽기로 한 모임이 있어요!</Text>
                <View style={{ marginTop: 20 }}>
                    {data.relatedGroups.map((g) => (
                        <GroupListExtended key={g.id} group={g} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#513A11",
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 14,
        color: "#555",
        lineHeight: 22,
    },
    moreBtn: {
        textAlign: "center",
        color: "#A19681",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#F0E6D8",
        marginHorizontal: 20,
    },
    thickDivider: {
        height: 8,
        backgroundColor: "#F9F9F9",
    },
    tocBox: {
        paddingVertical: 4,
    },
    tocItem: {
        fontSize: 14,
        color: "#444",
        marginBottom: 8,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#E4A54E",
        marginBottom: 4,
    },
});