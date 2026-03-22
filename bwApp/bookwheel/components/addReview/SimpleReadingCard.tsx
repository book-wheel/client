import { View, Text, Image, StyleSheet } from "react-native";
import Button from "@/components/Button";

type Props = {
    image: any;
    title: string;
    author: string;
    owner?: string;
    buttonText?: string;
    onPress?: () => void;
};

export default function ReadingCard({
                                        image,
                                        title,
                                        author,
                                        owner,
                                        buttonText,
                                        onPress,
                                    }: Props) {
    return (
        <View style={styles.card}>
            {/* 책 이미지 */}
            <Image source={image} style={styles.bookImage} />

            {/* 텍스트 영역 */}
            <View style={styles.info}>
                {/* [수정] 소유자 이름(owner)이 있을 때만 배지를 렌더링합니다. */}
                {owner ? (
                    <View style={styles.ownerBadge}>
                        <Text style={styles.ownerText}>{owner}</Text>
                    </View>
                ) : (
                    // owner가 없으면 상단 여백을 위해 빈 View를 넣거나 생략합니다.
                    <View style={{ marginTop: 20 }} />
                )}

                <View style={styles.textGroup}>
                    <Text style={styles.label}>책 제목</Text>
                    <Text style={styles.titleValue} numberOfLines={2}>{title}</Text>

                    <Text style={styles.label}>저자</Text>
                    <Text style={styles.authorValue}>{author}</Text>
                </View>

                {/* 완독 인증 버튼 */}
                {onPress && (
                    <Button
                        title={buttonText ?? "완독 인증 하기"}
                        style={styles.actionButton}
                        onPress={onPress}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        flexDirection: "row",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    bookImage: {
        width: 130,
        height: 191,
        borderRadius: 10,
        marginRight: 18,
        borderColor: "#513A11",
        borderWidth: 1,
    },

    info: {
        flex: 1,
        justifyContent: "center",
    },

    textGroup: {
        marginVertical: 4,
    },

    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#999",
        marginBottom: 2,
    },

    titleValue: {
        fontSize: 19,
        color: "#513A11",
        fontWeight: "bold",
        marginBottom: 12,
        lineHeight: 28,
    },

    authorValue: {
        fontSize: 18,
        color: "#513A11",
        fontWeight: "bold",
    },

    ownerBadge: {
        marginBottom: 10,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "#FCF5D7",
    },

    ownerText: {
        fontSize: 12,
        color: "#E4A54E",
        fontWeight: "600",
    },

    actionButton: {
        width: "100%",
        marginTop: 15,
        height: 45,
    }
});