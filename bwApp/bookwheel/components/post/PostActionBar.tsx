import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

interface Props {
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    onLikePress: () => void;
    onCommentPress: () => void;
}

export default function PostActionBar({
                                          isLiked,
                                          likeCount,
                                          commentCount,
                                          onLikePress,
                                          onCommentPress,
                                      }: Props) {
    return (
        <View style={styles.interactionSection}>
            <View style={styles.interactionLeft}>
                <TouchableOpacity style={styles.iconButton} onPress={onLikePress}>
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={26}
                        color={isLiked ? '#E8A38B' : '#555'}
                    />
                    <ThemedText style={styles.iconText}>{likeCount}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={onCommentPress}>
                    <Ionicons name="chatbubble-outline" size={24} color="#555" />
                    <ThemedText style={styles.iconText}>{commentCount}</ThemedText>
                </TouchableOpacity>
            </View>

            <TouchableOpacity>
                <ThemedText style={styles.reportText}>신고</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
