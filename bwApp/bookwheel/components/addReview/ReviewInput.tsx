import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface Props {
    review: string;
    setReview: (text: string) => void;
}

export default function ReviewInput({ review, setReview }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>감상평 남기기 (최소 20자)</Text>

            <TextInput
                style={styles.input}
                value={review}
                onChangeText={setReview}
                multiline={true}
                scrollEnabled={false}
                placeholder="이번 책을 읽고 느낀 점을 작성해주세요."
                placeholderTextColor="#999"
                textAlignVertical="top"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#513A11",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#F3F0EB",
        borderRadius: 10,
        padding: 16,
        fontSize: 16,
        color: "#333",
        minHeight: 200,
    }
});