import { useBookDetail } from "@/contexts/book-detail";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Info() {
    //  데이터를 담을 상태 관리 (초기값은 null 혹은 빈 객체)
    const { book: data, isLoading, error } = useBookDetail();

    const [showFullDesc, setShowFullDesc] = useState(false);
    const [numOfLines, setNumOfLines] = useState(0);
    const [showFullToc, setShowFullToc] = useState(false);

    const handleTextLayout = useCallback((e: any) => {
        if (numOfLines === 0) {
            setNumOfLines(e.nativeEvent.lines.length);
        }
    }, [numOfLines]);

    // 데이터가 로딩 중일 때 처리
    if (!data) {
        return ( 
        <View style={styles.container}>
            <Text>
                {isLoading
                    ? "로딩 중..."
                    : error
                      ? "도서 정보를 불러오지 못했어요."
                      : "도서 정보가 없어요."}
            </Text>
            </View>
        );
    }

    const tocItems = data.toc
        ? data.toc.split("\n").filter(Boolean)  // 빈 문자열 제거
        : [];

    const isDescLong = numOfLines > 2;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 저자 소개 섹션 */}            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>저자</Text>
                <Text style={styles.bodyText}>{data.author}</Text>
            </View>

            <View style={styles.divider} />

            
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
                    {tocItems.slice(0, showFullToc ? undefined : 3).map((item, index) => (
                        <Text key={index} style={styles.tocItem}>{item}</Text>
                    ))}
                </View>
                {tocItems.length > 3 && (
                    <TouchableOpacity onPress={() => setShowFullToc(!showFullToc)}>
                        <Text style={styles.moreBtn}>{showFullToc ? "접기 ▴" : "더보기 ▾"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.thickDivider} />

            {/* 모임 연동 섹션 
            <View style={styles.section}>
                <Text style={styles.groupTitle}>이 책을 읽기로 한 모임이 있어요!</Text>
                <View style={{ marginTop: 10 }}>
                    {data.relatedGroups.map((g) => (
                        <GroupListExtended key={g.id} group={g} />
                    ))}
                </View>
            </View>
            */}
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
        marginTop: 4,
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
