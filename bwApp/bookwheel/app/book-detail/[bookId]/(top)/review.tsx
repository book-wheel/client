import { getReviewStats } from "@/api/books";
import { useBookDetail } from "@/contexts/book-detail";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// 1. 리뷰 데이터 타입 정의
type VoteType = 'recommend' | 'not-recommend' | null;
type SortType = "최신순" | "인기순";
const DEFAULT_PROFILE = require("@/assets/images/logo.png");

interface ReviewItem {
    id: string;
    user: {
        name: string;
        profileUrl: string;
    };
    date: string;
    vote: VoteType;
    content: string;
    isSpoiler: boolean;
    isRevealed?: boolean;
    likes: number;
    isLikedByMe: boolean;
}

// 1-2. 도서 통계 데이터 타입 정의
interface BookVoteStats {
    recommendPercent: number;
    notRecommendPercent: number;
}

// 2. 목업 데이터
const MOCK_REVIEWS: ReviewItem[] = [
    {
        id: "1",
        user: { name: "문소희", profileUrl: "" },
        date: "2024.03.20",
        vote: "not-recommend",
        content: "주인공? 불쌍한 척 하는데 사실 답답함. 초반은 흥미롭지만 후반이 아쉬웠어요.",
        isSpoiler: false,
        likes: 26,
        isLikedByMe: true,
    },
    {
        id: "2",
        user: { name: "책벌레", profileUrl: "" },
        date: "2024.03.19",
        vote: "recommend",
        content: "결말에서 밝혀지는 남편의 진짜 정체가 너무 충격적이었습니다. 교환 독서로 완전 추천해요!",
        isSpoiler: true,
        isRevealed: false,
        likes: 40,
        isLikedByMe: false,
    },
    {
        id: "3",
        user: { name: "테스트유저", profileUrl: "" },
        date: "2024.03.02",
        vote: "not-recommend",
        content: "긴 글 테스트는\n하긴해야죠\n긴 글 테스트는\n하긴해야죠\n긴 글 테스트는\n하긴해야죠\n긴 글 테스트는\n하긴해야죠\n",
        isSpoiler: true,
        likes: 3,
        isLikedByMe: true,
    },
    {
        id: "4",
        user: { name: "김주옥", profileUrl: "" },
        date: "2025.03.19",
        vote: "recommend",
        content: "내 이름은 김주옥",
        isSpoiler: true,
        isRevealed: false,
        likes: 60,
        isLikedByMe: false,
    },
    {
        id: "5",
        user: { name: "조혜연", profileUrl: "" },
        date: "2024.05.10",
        vote: "not-recommend",
        content: "테스트 멘트 넣기 힘들다.",
        isSpoiler: false,
        likes: 80,
        isLikedByMe: true,
    },
    {
        id: "6",
        user: { name: "탁은혜", profileUrl: "" },
        date: "2024.10.20",
        vote: "recommend",
        content: "진짜 도파민 터진다",
        isSpoiler: true,
        isRevealed: false,
        likes: 100,
        isLikedByMe: false,
    },
];

interface AnimatedStatBoxProps {
    type: 'recommend' | 'not-recommend';
    label: string;
    percent: number;
    isSelected: boolean;
    hasVoted: boolean;
    onPress: () => void;
}

const AnimatedStatBox = ({ type, label, percent, isSelected, hasVoted, onPress }: AnimatedStatBoxProps) => {
    const fillWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (hasVoted) {
            Animated.timing(fillWidth, {
                toValue: percent,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            fillWidth.setValue(0);
        }
    }, [hasVoted, percent]);

    const widthInterpolated = fillWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const fillColor = '#FCF5D7';
    const borderColor = isSelected ? '#E4A54E' : '#EAEAEA';
    const textColor = isSelected ? (type === 'recommend' ? '#513A11' : '#333') : '#777';

    return (
        <TouchableOpacity
            style={[styles.statBox, { borderColor }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Animated.View style={[styles.statFill, { width: widthInterpolated, backgroundColor: fillColor }]} />

            <View style={styles.statContent}>
                <Text style={[
                    styles.statLabel,
                    { color: textColor, fontWeight: isSelected ? 'bold' : '600' },
                    !hasVoted && { marginBottom: 0, fontSize: 16 }
                ]}>
                    {label}
                </Text>

                {/* 투표를 했을 때만 퍼센트가 나타나도록 조건부 렌더링 (투명 글씨 제거) */}
                {hasVoted && (
                    <Text style={[styles.statPercent, { color: textColor, fontWeight: isSelected ? 'bold' : '600' }]}>
                        {percent}%
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default function Review() {
    const router = useRouter();
    const { isbn } = useBookDetail();

    const [myVote, setMyVote] = useState<VoteType>(null);
    const [inputText, setInputText] = useState("");
    const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
    const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);
    const [sortType, setSortType] = useState<SortType>("최신순");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [voteStats, setVoteStats] = useState<BookVoteStats>({
        recommendPercent: 0,
        notRecommendPercent: 0
    });
    const [visibleReviewCount, setVisibleReviewCount] = useState(5);

    useEffect(() => {
        if (!isbn) return;

        const fetchReviewStats = async () => {
            try {
                const response = await getReviewStats(isbn);

                const result = response.data;

                if (!result.success || !result.data) {
                    throw new Error(
                        result.error?.message ??
                        "추천 통계를 불러오지 못했습니다.",
                    );
                }

                const stats = result.data;

                setVoteStats({
                    recommendPercent:
                    stats.recommendedRatio,
                    notRecommendPercent:
                    stats.notRecommendedRatio,
                });

                if (stats.myVote === "RECOMMEND") {
                    setMyVote("recommend");
                } else if (stats.myVote === "NOT_RECOMMEND") {
                    setMyVote("not-recommend");
                } else {
                    setMyVote(null);
                }
            } catch (error) {
                console.error("추천 통계 조회 실패:", error);
            }
        };
        void fetchReviewStats();
    }, [isbn]);

    const handleVote = (vote: VoteType) => {
        if (myVote === vote) {
            setMyVote(null);
        } else {
            setMyVote(vote);
        }
    };

    const parseReviewDate = (date: string) => {
        const normalized = date.replace(/\./g, "-");
        return new Date(normalized).getTime();
    };

    const sortedReviews = useMemo(() => {
        const copied = [...reviews];

        copied.sort((a, b) => {
            if (sortType === "인기순") {
                if (b.likes !== a.likes) {
                    return b.likes - a.likes;
                }
                return parseReviewDate(b.date) - parseReviewDate(a.date);
            }

            return parseReviewDate(b.date) - parseReviewDate(a.date);
        });

        return copied;
    }, [reviews, sortType]);

    const handleSelectSort = (nextSort: SortType) => {
        setSortType(nextSort);
        setVisibleReviewCount(5);
        setIsSortDropdownOpen(false);
    };

    const toggleLike = (id: string) => {
        setReviews(reviews.map(review => {
            if (review.id === id) {
                return {
                    ...review,
                    isLikedByMe: !review.isLikedByMe,
                    likes: review.isLikedByMe ? review.likes - 1 : review.likes + 1
                };
            }
            return review;
        }));
    };

    const revealSpoiler = (id: string) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, isRevealed: true } : review
        ));
    };

    const handleSubmitComment = () => {
        const trimmedText = inputText.trim();

        if (!trimmedText) return;

        if (myVote === null) {
            Alert.alert("알림", "추천 또는 비추천을 선택해주세요.");
            return;
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");

        const newReview: ReviewItem = {
            id: Date.now().toString(),
            user: {
                name: "나",
                profileUrl: "",
            },
            date: `${yyyy}.${mm}.${dd}`,
            vote: myVote,
            content: trimmedText,
            isSpoiler: isSpoilerChecked,
            isRevealed: !isSpoilerChecked,
            likes: 0,
            isLikedByMe: false,
        };

        setReviews((prev) => [newReview, ...prev]);
        setVisibleReviewCount((prev) => Math.max(prev, 5));
        setInputText("");
        setIsSpoilerChecked(false);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>교환도서로</Text>
                <View style={styles.statsRow}>

                    <AnimatedStatBox
                        type="recommend"
                        label="추천"
                        percent={voteStats.recommendPercent}
                        isSelected={myVote === 'recommend'}
                        hasVoted={myVote !== null}
                        onPress={() => handleVote('recommend')}
                    />

                    <AnimatedStatBox
                        type="not-recommend"
                        label="비추천"
                        percent={voteStats.notRecommendPercent}
                        isSelected={myVote === 'not-recommend'}
                        hasVoted={myVote !== null}
                        onPress={() => handleVote('not-recommend')}
                    />

                </View>
            </View>

            <View style={styles.thickDivider} />

            <View style={styles.inputSection}>
                <View style={styles.commentHeaderRow}>
                    <Text style={styles.sectionTitle}>코멘트 달기</Text>

                    <TouchableOpacity
                        style={styles.commentSpoilerRow}
                        onPress={() => setIsSpoilerChecked(!isSpoilerChecked)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isSpoilerChecked ? "checkbox" : "square-outline"}
                            size={20}
                            color={isSpoilerChecked ? "#D89A3A" : "#D3D3D3"}
                        />
                        <Text style={styles.commentSpoilerText}>스포 방지</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.commentComposerBar}>
                    <TextInput
                        style={styles.commentComposerInput}
                        placeholder="코멘트를 남겨주세요."
                        placeholderTextColor="#B3B3B3"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline={false}
                        returnKeyType="done"
                    />

                    <TouchableOpacity
                        style={styles.commentExpandIcon}
                        onPress={() => console.log("상세 작성 페이지로 이동")}
                        activeOpacity={0.8}
                    >
                        <AntDesign name="arrows-alt" size={18} color="#222" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.commentSubmitButton,
                            inputText.trim()
                                ? styles.commentSubmitButtonActive
                                : styles.commentSubmitButtonDisabled,
                        ]}
                        onPress={handleSubmitComment}
                        activeOpacity={0.9}
                    >
                        <Text
                            style={[
                                styles.commentSubmitText,
                                inputText.trim()
                                    ? styles.commentSubmitTextActive
                                    : styles.commentSubmitTextDisabled,
                            ]}
                        >
                            게시
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.thickDivider} />

            <View style={styles.reviewListSection}>
                <View style={styles.listHeader}>
                    <Text style={styles.reviewCountTitle}>리뷰 {reviews.length}</Text>

                    <View style={styles.sortDropdownWrap}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setIsSortDropdownOpen((prev) => !prev)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.sortText}>{sortType}</Text>
                            <Ionicons
                                name={isSortDropdownOpen ? "chevron-up" : "chevron-down"}
                                size={14}
                                color="#555"
                            />
                        </TouchableOpacity>

                        {isSortDropdownOpen && (
                            <View style={styles.sortDropdownMenu}>
                                <TouchableOpacity
                                    style={styles.sortDropdownItem}
                                    onPress={() => handleSelectSort("최신순")}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.sortDropdownItemText,
                                            sortType === "최신순" && styles.sortDropdownItemTextActive,
                                        ]}
                                    >
                                        최신순
                                    </Text>
                                    {sortType === "최신순" && (
                                        <Ionicons name="checkmark" size={14} color="#D89A3A" />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.sortDropdownItem}
                                    onPress={() => handleSelectSort("인기순")}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.sortDropdownItemText,
                                            sortType === "인기순" && styles.sortDropdownItemTextActive,
                                        ]}
                                    >
                                        인기순
                                    </Text>
                                    {sortType === "인기순" && (
                                        <Ionicons name="checkmark" size={14} color="#D89A3A" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {sortedReviews.slice(0, visibleReviewCount).map((review) => {

                    return (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.userInfoRow}>
                                    <Image
                                        source={
                                            review.user.profileUrl?.trim()
                                                ? { uri: review.user.profileUrl }
                                                : DEFAULT_PROFILE
                                        }
                                        style={styles.profileImage}
                                    />

                                    <View style={styles.userMeta}>
                                        <View style={styles.nameBadgeRow}>
                                            <Text style={styles.userName}>{review.user.name}</Text>

                                            {review.vote === 'recommend' ? (
                                                <View style={[styles.voteBadge, styles.recommendBadge]}>
                                                    <Text style={[styles.voteBadgeText, styles.recommendBadgeText]}>추천</Text>
                                                </View>
                                            ) : (
                                                <View style={[styles.voteBadge, styles.notRecommendBadge]}>
                                                    <Text style={[styles.voteBadgeText, styles.notRecommendBadgeText]}>비추천</Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.reviewDate}>{review.date}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.likeButtonTop}
                                    onPress={() => toggleLike(review.id)}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons
                                        name={review.isLikedByMe ? "heart" : "heart-outline"}
                                        size={18}
                                        color={review.isLikedByMe ? "#D89A3A" : "#B7A98E"}
                                    />
                                    <Text
                                        style={[
                                            styles.likeCountTop,
                                            review.isLikedByMe && styles.likeCountTopActive
                                        ]}
                                    >
                                        {review.likes}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {review.isSpoiler && !review.isRevealed ? (
                                <TouchableOpacity
                                    style={styles.spoilerCover}
                                    onPress={() => revealSpoiler(review.id)}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.spoilerBlurBox}>
                                        <Text style={styles.spoilerHiddenContent}>
                                            {review.content}
                                        </Text>

                                        <View style={styles.spoilerFakeOverlay} />

                                        <View style={styles.spoilerMessageLayer}>
                                            <Text style={styles.spoilerMaskGuideText}>
                                                스포일러가 포함된 코멘트입니다.{"\n"}클릭 시 코멘트 열람이 가능합니다.
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.reviewContent}>{review.content}</Text>
                            )}
                        </View>
                    );
                })}

                {sortedReviews.length > 5 && visibleReviewCount < sortedReviews.length && (
                    <TouchableOpacity
                        style={styles.loadMoreButton}
                        onPress={() => setVisibleReviewCount((prev) => prev + 10)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loadMoreText}>더보기</Text>
                        <Ionicons name="chevron-down" size={16} color="#777" />
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#513A11", marginBottom: 14 },
    thickDivider: { height: 4 },

    statsSection: { padding: 20 },
    statsRow: { flexDirection: 'row', gap: 12 },
    statBox: {
        flex: 1,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#FFF',
    },
    statFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },
    statContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    statLabel: {
        fontSize: 15,
        marginBottom: 6,
    },
    statPercent: {
        fontSize: 20,
    },

    inputSection: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 24,
    },
    commentHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    commentSpoilerRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    commentSpoilerText: {
        marginLeft: 6,
        fontSize: 13,
        color: "#555",
        fontWeight: "500",
    },

    commentComposerBar: {
        minHeight: 58,
        borderWidth: 1.4,
        borderColor: "#8B6A33",
        borderRadius: 999,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 18,
        paddingRight: 8,
    },

    commentComposerInput: {
        flex: 1,
        fontSize: 14,
        color: "#513A11",
        paddingVertical: 12,
    },

    commentExpandIcon: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginRight: 4,
    },

    commentSubmitButton: {
        minWidth: 78,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
    },

    commentSubmitButtonActive: {
        backgroundColor: "#D89A3A",
    },

    commentSubmitButtonDisabled: {
        backgroundColor: "#EFEFEF",
    },

    commentSubmitText: {
        fontSize: 14,
        fontWeight: "700",
    },

    commentSubmitTextActive: {
        color: "#3D2A0C",
    },

    commentSubmitTextDisabled: {
        color: "#A8A8A8",
    },

    reviewCountTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },

    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 4,
    },

    sortText: {
        fontSize: 13,
        color: "#555",
        fontWeight: "500",
    },

    reviewListSection: {
        padding: 20,
        paddingBottom: 40,
        overflow: "visible",
    },

    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        position: "relative",
        zIndex: 100,
        elevation: 100,
    },

    sortDropdownWrap: {
        position: "relative",
        zIndex: 200,
        elevation: 200,
    },

    sortDropdownMenu: {
        position: "absolute",
        top: 30,
        right: 0,
        minWidth: 96,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#DCC9A5",
        borderRadius: 14,
        paddingVertical: 6,
        zIndex: 300,
        elevation: 300,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    sortDropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    sortDropdownItemText: {
        fontSize: 13,
        color: "#555",
        fontWeight: "500",
    },

    sortDropdownItemTextActive: {
        color: "#D89A3A",
        fontWeight: "700",
    },
    reviewCard: { marginBottom: 24, borderBottomWidth: 1, borderColor: '#F5F5F5', paddingBottom: 20 },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    userInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    profileImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: '#EEE' },
    userName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    reviewDate: { fontSize: 12, color: '#999', marginTop: 2 },

    voteBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    voteBadgeText: {
        fontSize: 11,
        fontWeight: "700",
    },

    reviewContent: {
        fontSize: 14,
        color: "#333",
        lineHeight: 22,
        marginBottom: 12,
        paddingLeft: 46,
    },
    spoilerCover: {
        paddingLeft: 46,
        paddingRight: 8,
        paddingTop: 0,
        paddingBottom: 4,
    },

    spoilerFakeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(245, 240, 232, 0.82)",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(220, 205, 180, 0.55)",
    },
    spoilerHiddenContent: {
        fontSize: 14,
        lineHeight: 22,
        color: "#6B5A3A",
        opacity: 0.08,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },

    spoilerBlurBox: {
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "rgba(255, 248, 240, 0.72)",
        borderWidth: 1,
        borderColor: "rgba(220, 205, 180, 0.55)",
    },

    spoilerMessageLayer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },

    spoilerMaskGuideText: {
        fontSize: 13,
        lineHeight: 20,
        color: "#8E7248",
        fontWeight: "700",
        textAlign: "center",
    },

    userMeta: {
        justifyContent: "center",
    },

    nameBadgeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
    },

    likeButtonTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        alignSelf: "flex-start",
    },

    likeCountTop: {
        fontSize: 13,
        color: "#B7A98E",
        fontWeight: "500",
    },

    likeCountTopActive: {
        color: "#D89A3A",
    },

    recommendBadge: {
        backgroundColor: "#F8E9B8",
    },

    recommendBadgeText: {
        color: "#A97922",
    },

    notRecommendBadge: {
        backgroundColor: "#ECEAE4",
    },

    notRecommendBadgeText: {
        color: "#9A907E",
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: '#FAFAFA',
        gap: 4,
        marginTop: 10,
    },
    loadMoreText: { fontSize: 14, fontWeight: '600', color: '#777' },
});
