import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import GroupList, { Group } from "@/components/groups/MyGroupList";

export default function Groups() {
  const [open, setOpen] = useState(false);

  //더미 데이터
  const groups: Group[] = [
    {
      id: "1",
      isOffline: true,
      region: "서울",
      // isPrivate: false,
      // description: "책바퀴 독서모임입니다.",
      status: "active",
      dday: 5,
      title: "책바퀴 독서모임",
      current: 4,
      total: 7,
      maxPeople: 10,
    },
    {
      id: "2",
      isOffline: false,
      // isPrivate: true,
      // description: "소설 애독가들의 모임입니다.",
      status: "scheduled",
      title: "소설 애독가들",
      current: 0,
      total: 2,
      maxPeople: 8,
      startDate: "2026/3/21",
    },
    {
      id: "3",
      isOffline: true,
      region: "부산",
      // isPrivate: false,
      // description: "교독교독 모임입니다.",
      status: "done",
      title: "교독교독",
      current: 8,
      total: 8,
      maxPeople: 8,
    },
    {
      id: "4",
      isOffline: false,
      status: "active",
      // isPrivate: true,
      // description: "신간 위주로 읽는 모임입니다.",
      dday: 2,
      title: "독서모임",
      current: 2,
      total: 10,
      maxPeople: 10,
    },
    {
      id: "5",
      isOffline: true,
      region: "서울",
      // isPrivate: false,
      // description: "책독 모임입니다.",
      status: "active",
      dday: 6,
      title: "책독",
      current: 3,
      total: 4,
      maxPeople: 10,
    },
  ];

  // 상태별로 그룹 분기
  const activeGroups = groups.filter((g) => g.status === "active");
  const otherGroups = groups.filter(
    (g) => g.status === "scheduled" || g.status === "done",
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: "#FFF",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: "center", backgroundColor: "#FFF" }}>
          {/* 진행중인 모임-------------------------------- */}
          <View style={styles.sectionStyle}>
            <Text style={styles.sectionTitle}>진행중인 모임</Text>
          </View>

          {activeGroups.map((group) => (
            <GroupList key={group.id} group={group} />
          ))}

          {/* 예정‧종료 모임-------------------------------- */}
          <View style={styles.sectionStyle}>
            <Text style={styles.sectionTitle}>예정‧종료 모임</Text>
          </View>

          {otherGroups.map((group) => (
            <GroupList key={group.id} group={group} />
          ))}
        </View>
      </ScrollView>

      {/* 모임생성 및 탐색 플로팅버튼 */}
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
      )}
      <View style={styles.fabContainer}>
        {open && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => router.push("/group/explore")}
            >
              <View style={styles.menuRow}>
                <Text style={styles.menuText}>탐색</Text>
                <View style={styles.iconBadge}>
                  <Text style={styles.iconText}>⌕</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => router.push("/group/create/step1")}
            >
              <View style={styles.menuRow}>
                <Text style={styles.menuText}>모임 생성</Text>
                <View style={styles.iconBadge}>
                  <Text style={styles.iconText}>＋</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.fab, open && styles.fabOpen]}
          onPress={() => setOpen(!open)}
        >
          <Text style={[styles.fabText, open && styles.fabTextOpen]}>
            {open ? "×" : "+"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    marginTop: 50,
    height: 40,
    width: "100%",
    backgroundColor: "#FFFCF3",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#614C26",
    marginLeft: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
    alignItems: "flex-end",
    paddingRight: 10,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconBadge: {
    width: 35,
    height: 35,
    borderRadius: 32,
    backgroundColor: "#FCF5D7",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    color: "#E4A54E",
    fontSize: 27,
    fontWeight: "bold",
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCF5D7",
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    fontSize: 32,
    color: "#E4A54E",
    lineHeight: 36,
  },

  fabOpen: {
    backgroundColor: "#E4A54E",
  },

  fabTextOpen: {
    color: "#FCF5D7",
  },

  menu: {
    marginBottom: 12,
    alignItems: "center",
    gap: 8,
  },

  menuBtn: {
    width: 140,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fcf5d700",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  menuText: {
    color: "#E4A54E",
    fontWeight: "600",
  },
});
