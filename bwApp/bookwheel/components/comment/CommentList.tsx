import React from 'react';
import { StyleSheet, ListRenderItem } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
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
    onDelete: (id: string) => void;
}

export default function CommentList({ comments, onDelete }: Props) {
    const keyExtractor = (item: CommentItem) => item.id;

    const renderItem: ListRenderItem<CommentItem> = ({ item }) => (
        <CommentItemRow item={item} onDelete={onDelete} />
    );

    return (
        <BottomSheetFlatList<CommentItem>
            data={comments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 120,
    },
});