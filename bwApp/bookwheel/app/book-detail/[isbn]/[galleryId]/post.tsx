import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';

import PostAuthorSection from '@/components/post/PostAuthorSection';
import PostImageSection from '@/components/post/PostImageSection';
import PostActionBar from '@/components/post/PostActionBar';
import PostContentSection from '@/components/post/PostContentSection';
import { getRelativeTime } from '@/components/utils/date'

export default function PostDetailScreen() {
    const router = useRouter();
    const { isbn, galleryId } = useLocalSearchParams();

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{
                headerShown: true,
                title: "리뷰 조회",
            }}
            />

            <ThemedView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <PostAuthorSection
                        author={postData.author}
                        createdAt={getRelativeTime(postData.createdAt)}
                        groupName={postData.groupName}
                        profileImage={postData.profileImage}
                    />

                    <PostImageSection images={postData.postImages} />

                    <PostActionBar
                        isLiked={isLiked}
                        likeCount={likeCount}
                        commentCount={postData.comments}
                        onLikePress={handleLikePress}
                        onCommentPress={() =>
                            router.push(`/book-detail/${isbn}/${galleryId}/comment`)
                        }
                    />

                    <PostContentSection
                        title={postData.title}
                        content={postData.content}
                    />
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
});
