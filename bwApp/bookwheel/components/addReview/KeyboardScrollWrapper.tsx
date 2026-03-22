import React, { useRef } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface Props {
    children: React.ReactNode;
    offset?: number;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function KeyboardScrollWrapper({
                                                  children,
                                                  offset = 100,
                                                  style,
                                                  contentContainerStyle
                                              }: Props) {
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <KeyboardAvoidingView
            style={[styles.container, style]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? offset : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}

                onContentSizeChange={() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    }
});