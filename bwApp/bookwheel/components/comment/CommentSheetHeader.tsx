import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
    count: number;
}

export default function CommentSheetHeader({ count }: Props) {
    return (
        <View style={styles.header}>
            <ThemedText style={styles.headerTitle} type="defaultSemiBold">
                댓글 {count}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 16,
        color: '#333333',
        marginTop: 10,
    },
});