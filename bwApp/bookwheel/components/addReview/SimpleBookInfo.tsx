import SimpleReadingCard from "@/components/addReview/SimpleReadingCard";
import type { ImageSourcePropType } from "react-native";
import { StyleSheet, View } from "react-native";

type Props = {
    image: ImageSourcePropType | null;
    title: string;
    author: string;
};

export default function SimpleBookInfo({ image, title, author }: Props) {
    return (
        <View style={styles.container}>
            <SimpleReadingCard
                image={image}
                title={title}
                author={author}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    textOverlay: {
        marginTop: 15,
        alignItems: "center",
        width: "100%",
    },
});
