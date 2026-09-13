import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function GroupsFab({ open, setOpen }: Props) {
  return (
    <>
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
              <Text style={styles.menuText}>탐색</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => router.push("/group/create/step1")}
            >
              <Text style={styles.menuText}>모임 생성</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
    alignItems: "flex-end",
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
  },

  fabOpen: {
    backgroundColor: "#E4A54E",
  },

  fabTextOpen: {
    color: "#FCF5D7",
  },

  menu: {
    marginBottom: 12,
    gap: 8,
  },

  menuBtn: {
    width: 120,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    color: "#E4A54E",
    fontWeight: "600",
  },
});
