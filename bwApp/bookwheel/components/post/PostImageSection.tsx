import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ImageSourcePropType,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    useWindowDimensions,
    TouchableOpacity,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
    images: ImageSourcePropType[];
}

export default function PostImageSection({ images }: Props) {
    const { width } = useWindowDimensions();
    const flatListRef = useRef<FlatList<ImageSourcePropType>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const imageWidth = width;
    const imageHeight = width * 0.98;

    const handleMomentumScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const nextIndex = Math.round(offsetX / imageWidth);
        setCurrentIndex(nextIndex);
    };

    const handlePressDot = (index: number) => {
        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
        });
        setCurrentIndex(index);
    };

    if (!images || images.length === 0) {
        return <View style={[styles.emptyBox, { height: imageHeight }]} />;
    }

    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={flatListRef}
                data={images}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToAlignment="center"
                onMomentumScrollEnd={handleMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: imageWidth,
                    offset: imageWidth * index,
                    index,
                })}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.imagePage,
                            {
                                width: imageWidth,
                                height: imageHeight,
                            },
                        ]}
                    >
                        <Image source={item} style={styles.image} resizeMode="contain" />
                    </View>
                )}
            />

            {images.length > 1 && (
                <View style={styles.countBadge}>
                    <ThemedText style={styles.countText}>
                        {currentIndex + 1}/{images.length}
                    </ThemedText>
                </View>
            )}

            {images.length > 1 && (
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handlePressDot(index)}
                            activeOpacity={0.8}
                            style={styles.dotButton}
                        >
                            <View
                                style={[
                                    styles.dot,
                                    index === currentIndex && styles.activeDot,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },
    imagePage: {
        backgroundColor: '#F5F2EC',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    countBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        minWidth: 34,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: "rgba(81,58,17,0.82)",
        justifyContent: "center",
        alignItems: "center",
    },
    countText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    pagination: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotButton: {
        paddingHorizontal: 4,
        paddingVertical: 6,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(81,58,17,0.3)'
    },
    activeDot: {
        width: 16,
        height: 5,
        borderRadius: 999,
        backgroundColor: 'rgba(81,58,17,0.82)'
    },
    emptyBox: {
        width: '100%',
        marginTop: 10,
        backgroundColor: '#F3F3F3',
    },
});
