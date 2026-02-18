import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FilterOption = {
  key: string;
  label: string;
  hasChildren?: boolean;
};

type Props = {
  options: FilterOption[];
  value: string;
  onChange: (key: string) => void;
  onOpenSubFilter?: (key: string) => void;
};

export default function FilterBar({
  options,
  value,
  onChange,
  onOpenSubFilter,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = value === opt.key;

        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.item, active && styles.active]}
            onPress={() => {
              if (opt.hasChildren) {
                onOpenSubFilter?.(opt.key);
              } else {
                onChange(opt.key);
              }
            }}
          >
            <View style={styles.inner}>
              <Text style={[styles.text, active && styles.activeText]}>
                {opt.label}
              </Text>
              {opt.hasChildren && (
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={active ? "#FCF5D7" : "#A19681"}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    width: "100%",
    paddingHorizontal: 16,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#E5E5E5",
    flex: 1, // 균등 분배
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#E4A54E",
  },
  text: {
    fontSize: 12,
    color: "#A19681",
  },
  activeText: {
    color: "#FCF5D7",
  },
  inner: { flexDirection: "row", alignItems: "center", gap: 4 },
});
