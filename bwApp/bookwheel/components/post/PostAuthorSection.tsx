import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
    author: string;
    createdAt: string;
    groupName?: string | null;
    profileImage: ImageSourcePropType;
}

export default function PostAuthorSection({
                                              author,
                                              createdAt,
                                              groupName,
                                              profileImage,
                                          }: Props) {
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

            {groupName && (
                <View style={styles.badgeContainer}>
                    <ThemedText style={styles.badgeText}>{groupName}</ThemedText>
                </View>
            )}
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
});