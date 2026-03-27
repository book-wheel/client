import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import CommentSheetHeader from '@/components/comment/CommentSheetHeader';
import CommentList from '@/components/comment/CommentList';
import CommentInputBar from '@/components/comment/CommentInputBar';

export type CommentItem = {
    id: string;
    author: string;
    content: string;
    profileImage: any;
    isMine: boolean;
    createdAt: string;
};

const INITIAL_COMMENTS: CommentItem[] = [
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

export default function CommentSheetScreen() {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [inputText, setInputText] = useState('');
    const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);

    const snapPoints = useMemo(() => ['40%', '70%', '90%'], []);

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) router.back();
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
            createdAt: new Date().toISOString(),
        };

        setComments((prev) => [newComment, ...prev]);
        setInputText('');
    };

    const handleDeleteComment = (commentId: string) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.backgroundContainer}>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        onChange={handleSheetChanges}
                        handleIndicatorStyle={styles.dragHandle}
                        backgroundStyle={styles.bottomSheetBackground}
                    >
                        <ThemedView style={styles.sheetContainer}>
                            <CommentSheetHeader count={comments.length} />
                            <CommentList comments={comments} onDelete={handleDeleteComment} />
                        </ThemedView>
                    </BottomSheet>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.fixedBottomInput}
                >
                    <CommentInputBar
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmit={handleSubmitComment}
                    />
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
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
    },
    fixedBottomInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
    },
});