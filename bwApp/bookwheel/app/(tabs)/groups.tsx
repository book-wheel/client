import { View, Text, StyleSheet, ScrollView } from "react-native";
import GroupList from "@/components/groups/MyGroupList";
import GroupsFab from "@/components/groups/GroupsFab";
import { useGroups } from "@/hooks/useGroups";

export default function Groups() {
  const { open, setOpen, activeGroups, otherGroups } = useGroups();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.section}>
            <Text style={styles.title}>진행중인 모임</Text>
          </View>

          {activeGroups.map((group) => (
            <GroupList key={group.id} group={group} />
          ))}

          <View style={styles.section}>
            <Text style={styles.title}>예정‧종료 모임</Text>
          </View>

          {otherGroups.map((group) => (
            <GroupList key={group.id} group={group} />
          ))}
        </View>
      </ScrollView>

      <GroupsFab open={open} setOpen={setOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 50,
    height: 40,
    width: "100%",
    backgroundColor: "#FFFCF3",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#614C26",
    marginLeft: 20,
  },
});
