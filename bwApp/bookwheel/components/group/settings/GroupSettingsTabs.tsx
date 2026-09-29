import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  groupId: string;
  groupName?: string;
};

const TABS = [
  { label: "홈", route: "home" },
  { label: "상태", route: "state" },
  { label: "설정", route: "setting" },
] as const;

export default function GroupSettingsTabs({ groupId, groupName }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = tab.route === "setting";

        return (
          <Pressable
            key={tab.route}
            disabled={active}
            onPress={() =>
              router.replace(
                {
                  pathname: `/group/${groupId}/${tab.route}` as Href,
                  params: groupName ? { name: groupName } : undefined,
                } as Href,
              )
            }
            style={styles.tab}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.label}
            </Text>
            {active ? <View style={styles.indicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E0D2",
    backgroundColor: "#FFFFFF",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "700",
  },
  activeLabel: { color: "#E4A54E" },
  indicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#E4A54E",
  },
});
