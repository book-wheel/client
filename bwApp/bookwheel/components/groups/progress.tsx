import { View, StyleSheet, DimensionValue } from "react-native";

type Props = {
  total: number;
  current: number;
  width?: DimensionValue;
  height?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
};

export default function ProgressBar({
  total,
  current,
  width = "100%",
  height = 10,
  gap = 3,
  activeColor = "#E4A54E",
  inactiveColor = "#FAEDDC",
}: Props) {
  return (
    <View style={[styles.container, { width, gap }]}>
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx < current;
        const isFirst = idx === 0;
        const isLast = idx === total - 1;

        return (
          <View
            key={idx}
            style={[
              styles.bar,
              {
                height,
                backgroundColor: isActive ? activeColor : inactiveColor,
                borderTopLeftRadius: isFirst ? height : 0,
                borderBottomLeftRadius: isFirst ? height : 0,
                borderTopRightRadius: isLast ? height : 0,
                borderBottomRightRadius: isLast ? height : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    flex: 1,
  },
});
