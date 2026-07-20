import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useRef } from "react";
import type { BookVoteStats, VoteKind, VoteType } from "./types";

interface Props {
  myVote: VoteType;
  voteStats: BookVoteStats;
  onVote: (vote: VoteKind) => void;
}

interface AnimatedStatBoxProps {
  type: VoteKind;
  label: string;
  percent: number;
  isSelected: boolean;
  hasVoted: boolean;
  onPress: () => void;
}

function AnimatedStatBox({
  type,
  label,
  percent,
  isSelected,
  hasVoted,
  onPress,
}: AnimatedStatBoxProps) {
  const fillWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasVoted) {
      fillWidth.setValue(0);
      return;
    }

    const animation = Animated.timing(fillWidth, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fillWidth, hasVoted, percent]);

  const widthInterpolated = fillWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  const borderColor = isSelected ? "#E4A54E" : "#EAEAEA";
  const textColor = isSelected ? (type === "recommend" ? "#513A11" : "#333") : "#777";

  return (
    <TouchableOpacity style={[styles.statBox, { borderColor }]} onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={[styles.statFill, { width: widthInterpolated }]} />

      <View style={styles.statContent}>
        <Text
          style={[
            styles.statLabel,
            { color: textColor, fontWeight: isSelected ? "bold" : "600" },
            !hasVoted && { marginBottom: 0, fontSize: 16 },
          ]}
        >
          {label}
        </Text>

        {hasVoted && (
          <Text style={[styles.statPercent, { color: textColor, fontWeight: isSelected ? "bold" : "600" }]}>
            {percent}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ReviewVoteSection({ myVote, voteStats, onVote }: Props) {
  const hasVoted = myVote !== null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>교환도서로</Text>
      <View style={styles.statsRow}>
        <AnimatedStatBox
          type="recommend"
          label="추천"
          percent={voteStats.recommendPercent}
          isSelected={myVote === "recommend"}
          hasVoted={hasVoted}
          onPress={() => onVote("recommend")}
        />
        <AnimatedStatBox
          type="not-recommend"
          label="비추천"
          percent={voteStats.notRecommendPercent}
          isSelected={myVote === "not-recommend"}
          hasVoted={hasVoted}
          onPress={() => onVote("not-recommend")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#513A11",
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#FFF",
  },
  statFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FCF5D7",
  },
  statContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  statLabel: {
    fontSize: 15,
    marginBottom: 6,
  },
  statPercent: {
    fontSize: 20,
  },
});
