import { ThemedText } from '@/components/themed-text';
import { getRelativeTime } from '@/components/utils/date';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CommentItem {
    id: string;
    author: string;
    content: string;
    profileImage: any;
    isMine: boolean;
    createdAt: string;
}

interface Props {
    item: CommentItem;
    onDelete?: (id: string) => void;
    isDeleting?: boolean;
}

export default function CommentItemRow({
    item,
    onDelete,
    isDeleting = false,
}: Props) {
    const handlePressDelete = () => {
        if (!onDelete || isDeleting) return;

        Alert.alert(
            '댓글 삭제',
            '댓글을 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => onDelete(item.id),
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.commentRow}>
            <Image source={item.profileImage} style={styles.profileImage} />

            <View style={styles.commentContent}>
                <View style={styles.commentTopRow}>
                    <View style={styles.commentMetaRow}>
                        <ThemedText style={styles.authorName} type="defaultSemiBold">
                            {item.author}
                        </ThemedText>
                        <ThemedText style={styles.commentTime}>
                            {getRelativeTime(item.createdAt)}
                        </ThemedText>
                    </View>

                    <View style={styles.actionRow}>
                        {item.isMine && onDelete ? (
                            <TouchableOpacity
                                accessibilityLabel="댓글 삭제"
                                accessibilityRole="button"
                                activeOpacity={0.7}
                                disabled={isDeleting}
                                onPress={handlePressDelete}
                            >
                                <ThemedText style={styles.actionText}>
                                    {isDeleting ? '삭제 중' : '삭제'}
                                </ThemedText>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                <ThemedText style={styles.commentText}>{item.content}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentRow: {
        flexDirection: 'row',
        marginBottom: 28,
    },
    profileImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F0F0F0',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
        paddingTop: 2,
    },
    commentTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    commentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    authorName: {
        fontSize: 14,
        color: '#9A8562',
        marginRight: 10,
    },
    commentTime: {
        fontSize: 13,
        color: '#8E7A59',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    actionText: {
        fontSize: 13,
        color: '#A79372',
        textDecorationLine: 'underline',
    },
    commentText: {
        fontSize: 15,
        color: '#7A5C33',
        lineHeight: 24,
        paddingLeft: 2,
    },
});
