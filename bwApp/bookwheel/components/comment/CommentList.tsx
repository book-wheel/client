import ErrorNotice from "@/components/ErrorNotice";
import { ThemedText } from '@/components/themed-text';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import { ActivityIndicator, ListRenderItem, StyleSheet, View } from 'react-native';
import CommentItemRow from './CommentItemRow';

export interface CommentItem {
    id: string;
    author: string;
    content: string;
    profileImage: any;
    isMine: boolean;
    createdAt: string;
}

interface Props {
    comments: CommentItem[];
    onDelete?: (id: string) => void;
    deletingCommentId?: string | null;
    isLoading?: boolean;
    onEndReached?: () => void;
    errorMessage?: string;
    onRetry?: () => void;
}

export default function CommentList({
    comments,
    onDelete,
    deletingCommentId,
    isLoading = false,
    onEndReached,
    errorMessage,
    onRetry,
}: Props) {
    const keyExtractor = (item: CommentItem) => item.id;

    const renderItem: ListRenderItem<CommentItem> = ({ item }) => (
        <CommentItemRow
            item={item}
            onDelete={onDelete}
            isDeleting={deletingCommentId === item.id}
        />
    );

    return (
        <BottomSheetFlatList<CommentItem>
            data={comments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={errorMessage ? undefined : onEndReached}
            onEndReachedThreshold={0.4}
            ListEmptyComponent={
                !isLoading && !errorMessage ? (
                    <ThemedText style={styles.emptyText}>
                        아직 댓글이 없습니다.
                    </ThemedText>
                ) : null
            }
            ListFooterComponent={
                isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#E4A54E" />
                    </View>
                ) : errorMessage ? (
                    <ErrorNotice message={errorMessage} onRetry={onRetry} />
                ) : null
            }
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 120,
    },
    emptyText: {
        color: '#999999',
        textAlign: 'center',
        paddingTop: 32,
    },
    loadingContainer: {
        paddingVertical: 20,
    },
});
