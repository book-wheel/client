import { ThemedText } from '@/components/themed-text';
import React from 'react';
import {
    Alert,
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
    author: string;
    createdAt: string;
    groupName?: string | null;
    profileImage: ImageSourcePropType;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export default function PostAuthorSection({
                                              author,
                                              createdAt,
                                              groupName,
                                              profileImage,
                                              onDelete,
                                              isDeleting = false,
                                          }: Props) {
    const handlePressDelete = () => {
        if (!onDelete || isDeleting) return;

        Alert.alert(
            '게시글 삭제',
            '게시글을 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: onDelete,
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <View style={styles.profileSection}>
            <View style={styles.profileLeft}>
                <Image source={profileImage} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <ThemedText style={styles.authorName} type="defaultSemiBold">
                        {author}
                    </ThemedText>
                    <ThemedText style={styles.timeAgo}>{createdAt}</ThemedText>
                </View>
            </View>

            <View style={styles.profileActions}>
                {groupName && (
                    <View style={styles.badgeContainer}>
                        <ThemedText style={styles.badgeText}>{groupName}</ThemedText>
                    </View>
                )}

                {onDelete && (
                    <TouchableOpacity
                        accessibilityLabel="게시글 삭제"
                        accessibilityRole="button"
                        activeOpacity={0.7}
                        disabled={isDeleting}
                        hitSlop={8}
                        onPress={handlePressDelete}
                    >
                        <ThemedText style={styles.deleteText}>
                            {isDeleting ? '삭제 중' : '삭제'}
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    profileActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginLeft: 12,
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
    deleteText: {
        fontSize: 13,
        color: '#A79372',
        textDecorationLine: 'underline',
    },
});
