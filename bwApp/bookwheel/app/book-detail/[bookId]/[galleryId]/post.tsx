import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const getRelativeTime = (dateString: string) => {
    const createdTime = new Date(dateString).getTime();
    const now = new Date().getTime();

    if (Number.isNaN(createdTime)) return '';

    const diffMs = now - createdTime;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diffMs < minute) return '방금 전';
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`;
    if (diffMs < week) return `${Math.floor(diffMs / day)}일 전`;
    if (diffMs < month) return `${Math.floor(diffMs / week)}주 전`;
    if (diffMs < year) return `${Math.floor(diffMs / month)}개월 전`;
    return `${Math.floor(diffMs / year)}년 전`;
};

export default function PostDetailScreen() {
    const router = useRouter();
    const { bookId, galleryId } = useLocalSearchParams();

    const postData = {
        author: '문소희',
        createdAt: '2026-03-24T14:35:00',
        groupName: '소카모임',
        title: '내 남편을 팝니다',
        content: '책을 읽으면서 많은 생각이 들었습니다.\n문체가 매력적이어서 술술 읽히는 매력이 있네요.\n다음에도 이 작가의 책을 찾아봐야겠어요.',
        likes: 26,
        comments: 3,
        profileImage: require('@/assets/images/logo.png'),
        postImages: [
            require('@/assets/images/comment.png'),
            require('@/assets/images/comment.png'),
            require('@/assets/images/comment.png'),
            require('@/assets/images/comment.png'),
        ],
    };

    const [isLiked, setIsLiked] = useState(true);
    const [likeCount, setLikeCount] = useState(postData.likes);

    const handleLikePress = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
        } else {
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
        }
    };

    const imageCount = postData.postImages.length;
    const firstImage = postData.postImages[0];
    const extraImageCount = imageCount - 1;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <ThemedView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.profileSection}>
                        <View style={styles.profileLeft}>
                            <Image source={postData.profileImage} style={styles.profileImage} />
                            <View style={styles.profileInfo}>
                                <ThemedText style={styles.authorName} type="defaultSemiBold">
                                    {postData.author}
                                </ThemedText>
                                <ThemedText style={styles.timeAgo}>
                                    {getRelativeTime(postData.createdAt)}
                                </ThemedText>
                            </View>
                        </View>

                        {postData.groupName && (
                            <View style={styles.badgeContainer}>
                                <ThemedText style={styles.badgeText}>{postData.groupName}</ThemedText>
                            </View>
                        )}
                    </View>

                    <View style={styles.mainImageWrapper}>
                        <Image
                            source={firstImage}
                            style={styles.mainImage}
                            resizeMode="cover"
                        />

                        {extraImageCount > 0 && (
                            <View style={styles.imageCountBadge}>
                                <ThemedText style={styles.imageCountText}>
                                    +{extraImageCount}
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    <View style={styles.interactionSection}>
                        <View style={styles.interactionLeft}>
                            <TouchableOpacity style={styles.iconButton} onPress={handleLikePress}>
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={26}
                                    color={isLiked ? '#E8A38B' : '#555'}
                                />
                                <ThemedText style={styles.iconText}>{likeCount}</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => router.push(`/book-detail/${bookId}/${galleryId}/comment`)}
                            >
                                <Ionicons name="chatbubble-outline" size={24} color="#555" />
                                <ThemedText style={styles.iconText}>{postData.comments}</ThemedText>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity>
                            <ThemedText style={styles.reportText}>신고</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textSection}>
                        <ThemedText style={styles.postTitle} type="title">
                            {postData.title}
                        </ThemedText>
                        <ThemedText style={styles.postContent}>
                            {postData.content}
                        </ThemedText>
                    </View>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0F0F0',
        marginRight: 12,
    },
    profileInfo: {
        justifyContent: 'center',
    },
    authorName: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 2,
    },
    timeAgo: {
        fontSize: 13,
        color: '#888888',
    },
    badgeContainer: {
        backgroundColor: '#F5EFE6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 12,
        color: '#E4A54E',
        fontWeight: '600',
    },
    mainImageWrapper: {
        width: '100%',
        aspectRatio: 1,
        marginTop: 10,
        overflow: 'hidden',
        backgroundColor: '#FAFAFA',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageCountBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        minWidth: 42,
        height: 34,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(252, 245, 215, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCountText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A6A2F',
    },
    interactionSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    interactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 15,
        marginLeft: 6,
        color: '#333333',
    },
    reportText: {
        fontSize: 13,
        color: '#999999',
        textDecorationLine: 'underline',
    },
    textSection: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111111',
        marginBottom: 12,
    },
    postContent: {
        fontSize: 15,
        color: '#444444',
        lineHeight: 26,
    },
});