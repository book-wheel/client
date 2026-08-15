import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const toastConfig = {
  success: ({ text1 }: any) => (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={15} color="#513A11" />
      </View>

      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }: any) => (
    <View style={styles.container}>
      <View style={styles.errorIcon}>
        <Ionicons name="close" size={15} color="#513A11" />
      </View>

      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    minWidth: 150,
    maxWidth: "85%",

    paddingVertical: 11,
    paddingHorizontal: 16,

    borderRadius: 30,

    backgroundColor: "rgba(255, 255, 255, 0.88)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 5,
  },

  successIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(247, 237, 224, 0.95)",

    marginRight: 9,
  },

  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255, 225, 225, 0.95)",

    marginRight: 9,
  },

  text: {
    color: "#513A11",
    fontSize: 13,
    fontWeight: "600",
  },
});
