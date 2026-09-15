import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  sourceName: string;
  provider?: string;
  sourceUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
};

export default function BookDataSource({
  label,
  sourceName,
  provider,
  sourceUrl,
  startDate,
  endDate,
}: Props) {
  const sourceText = `${label}: ${sourceName}${provider ? ` (${provider})` : ""}`;

  return (
    <View style={styles.container}>
      <View style={styles.sourceRow}>
        <Ionicons name="information-circle-outline" size={14} color="#A19681" />
        {sourceUrl ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${sourceText}, 출처 페이지 열기`}
            hitSlop={8}
            onPress={() => void Linking.openURL(sourceUrl)}
            style={styles.sourceLinkButton}
          >
            <Text style={styles.sourceLink}>{sourceText} ↗</Text>
          </Pressable>
        ) : (
          <Text style={styles.sourceText}>{sourceText}</Text>
        )}
      </View>
      {startDate && endDate ? (
        <Text style={styles.period}>집계 기간: {startDate} ~ {endDate}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 12,
    gap: 4,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sourceText: {
    color: "#A19681",
    fontSize: 12,
    flexShrink: 1,
  },
  sourceLinkButton: {
    flexShrink: 1,
  },
  sourceLink: {
    color: "#806547",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  period: {
    marginLeft: 18,
    color: "#A19681",
    fontSize: 12,
  },
});
