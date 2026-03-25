import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TextInput,
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

type CommentItem = {
    id: string;
    author: string;
    content: string;
    profileImage: any;
    isMine: boolean;
    createdAt: string; // 예: "2026-03-24T14:35:00"
};

const DUMMY_COMMENTS: CommentItem[] = [
    {
        id: '1',
        author: '김주옥',
        content: '책 표지가 너무 예뻐요! 저도 읽어봐야겠어요.',
        profileImage: require('@/assets/images/logo.png'),
        isMine: false,
        createdAt: '2026-03-24T14:35:00',
    },
    {
        id: '2',
        author: '조해연',
        content: '공감되는 리뷰네요. 특히 후반부 전개가 인상 깊었죠.',
        profileImage: require('@/assets/images/logo.png'),
        isMine: false,
        createdAt: '2026-03-24T15:10:00',
    },
    {
        id: '3',
        author: '탁은혜',
        content: '좋은 책 추천 감사합니다~ 당장 구매하러 갑니다🏃‍♀️',
        profileImage: require('@/assets/images/logo.png'),
        isMine: false,
        createdAt: '2026-03-24T16:25:00',
    },
];

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

const getLocalDateTimeString = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

export default function CommentSheetScreen() {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [inputText, setInputText] = useState('');
    const [comments, setComments] = useState<CommentItem[]>(DUMMY_COMMENTS);

    const keyExtractor = (item: CommentItem) => item.id;

    const snapPoints = useMemo(() => ['40%', '70%', '90%'], []);

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                router.back();
            }
        },
        [router]
    );

    const handleSubmitComment = () => {
        const trimmedText = inputText.trim();

        if (!trimmedText) return;

        const newComment: CommentItem = {
            id: Date.now().toString(),
            author: '문소희',
            content: trimmedText,
            profileImage: require('@/assets/images/logo.png'),
            isMine: true,
            createdAt: getLocalDateTimeString(),
        };

        setComments((prev) => [...prev, newComment]);
        setInputText('');
    };

    const handleDeleteComment = (commentId: string) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    };

    const renderCommentItem = ({ item }: { item: CommentItem }) => (
        <View style={styles.commentRow}>
            <Image source={item.profileImage} style={styles.profileImage} />

            <View style={styles.commentContent}>
                <View style={styles.commentTopRow}>
                    <View style={styles.commentMetaRow}>
                        <ThemedText style={styles.authorName} type="defaultSemiBold">
                            {item.author}
                        </ThemedText>
                        <ThemedText style={styles.dot}>·</ThemedText>
                        <ThemedText style={styles.commentTime}>
                            {getRelativeTime(item.createdAt)}
                        </ThemedText>
                    </View>

                    {item.isMine && (
                        <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                            <ThemedText style={styles.deleteText}>삭제</ThemedText>
                        </TouchableOpacity>
                    )}
                </View>

                <ThemedText style={styles.commentText}>{item.content}</ThemedText>
            </View>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.backgroundContainer}>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        onChange={handleSheetChanges}
                        handleIndicatorStyle={styles.dragHandle}
                        backgroundStyle={styles.bottomSheetBackground}
                    >
                        <ThemedView style={styles.sheetContainer}>
                            <View style={styles.header}>
                                <ThemedText style={styles.headerTitle} type="defaultSemiBold">
                                    댓글
                                </ThemedText>
                            </View>

                            <BottomSheetFlatList
                                data={comments}
                                keyExtractor={keyExtractor}
                                renderItem={renderCommentItem}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        </ThemedView>
                    </BottomSheet>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.fixedBottomInput}
                >
                    <View style={styles.inputSection}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="댓글을 입력하세요..."
                                placeholderTextColor="#999"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={200}
                            />

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    !inputText.trim() && styles.submitButtonDisabled,
                                ]}
                                disabled={!inputText.trim()}
                                onPress={handleSubmitComment}
                            >
                                <ThemedText style={styles.submitButtonText}>게시</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },

    bottomSheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    header: {
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 16,
        color: '#333333',
        marginTop: 10,
    },

    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 120,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
        justifyContent: 'center',
    },
    commentTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    commentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 12,
    },
    authorName: {
        fontSize: 14,
        color: '#333333',
    },
    dot: {
        fontSize: 12,
        color: '#A0A0A0',
        marginHorizontal: 4,
    },
    commentTime: {
        fontSize: 12,
        color: '#A0A0A0',
    },
    deleteText: {
        fontSize: 12,
        color: '#A0A0A0',
        textDecorationLine: 'underline',
    },
    commentText: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 20,
    },

    fixedBottomInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
    },
    inputSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 48,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        maxHeight: 80,
        paddingTop: 0,
        paddingBottom: 0,
    },
    submitButton: {
        backgroundColor: '#E4A54E',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});