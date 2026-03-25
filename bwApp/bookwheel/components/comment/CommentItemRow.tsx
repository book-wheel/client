import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { getRelativeTime } from '@/components/utils/date';

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
    onDelete: (id: string) => void;
}


export default function CommentItemRow({ item, onDelete }: Props) {
    return (
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
                        <TouchableOpacity onPress={() => onDelete(item.id)}>
                            <ThemedText style={styles.deleteText}>삭제</ThemedText>
                        </TouchableOpacity>
                    )}
                </View>

                <ThemedText style={styles.commentText}>{item.content}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});