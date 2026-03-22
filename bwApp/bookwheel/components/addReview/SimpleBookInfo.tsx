import { View, Text, StyleSheet } from "react-native";
import SimpleReadingCard from "@/components/addReview/SimpleReadingCard";

type Props = {
    image: any;
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