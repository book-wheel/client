import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export default function CommentInputBar({
                                            value,
                                            onChangeText,
                                            onSubmit,
                                            isSubmitting = false,
                                        }: Props) {
    return (
        <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="댓글을 입력하세요..."
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                    maxLength={200}
                />

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!value.trim() || isSubmitting) && styles.submitButtonDisabled,
                    ]}
                    disabled={!value.trim() || isSubmitting}
                    onPress={onSubmit}
                >
                    <ThemedText style={styles.submitButtonText}>게시</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 48,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        maxHeight: 80,
        paddingTop: 0,
        paddingBottom: 0,
    },
    submitButton: {
        backgroundColor: '#E4A54E',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});
