import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
    title: string;
    content: string;
}

export default function PostContentSection({ title, content }: Props) {
    return (
        <View style={styles.textSection}>
            <View style={styles.titleRow}>
                <ThemedText style={styles.postTitle} type="title">
                    {title}
                </ThemedText>
                <ThemedText style={styles.reviewLabel}>
                    의 리뷰
                </ThemedText>
            </View>

            <ThemedText style={styles.postContent}>
                {content}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    textSection: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    titleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111111',
        lineHeight: 30,
    },
    reviewLabel: {
        fontSize: 15,
        fontWeight: '400',
        color: '#7A7A7A',
        marginLeft: 4,
        alignSelf: 'flex-end',
        marginBottom: 3,
        lineHeight: 22,
    },
    postContent: {
        fontSize: 15,
        color: '#444444',
        lineHeight: 26,
    },
});