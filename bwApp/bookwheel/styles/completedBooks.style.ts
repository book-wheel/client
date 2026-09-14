import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // =========================
  // Section
  // =========================

  sectionBox: {
    marginBottom: 32,
    padding: 0,
  },

  sectionTitle: {
    marginBottom: 16,

    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.6,

    color: "#513A11",
  },

  // 작은 설명 텍스트
  sectionDescription: {
    marginTop: -8,
    marginBottom: 16,

    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",

    color: "#8B7351",
  },

  // =========================
  // Book Info
  // =========================

  bookMeta: {
    marginTop: 16,
    paddingTop: 16,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EDE5D5",
  },

  metaText: {
    marginBottom: 5,

    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",

    color: "#806943",
  },

  // =========================
  // Photo Upload
  // =========================

  uploadBox: {
    width: 140,
    height: 140,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8DDBF",
    backgroundColor: "#FFFCF3",
  },

  // =========================
  // Review
  // =========================

  reviewInput: {
    height: 160,

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8DDBF",

    backgroundColor: "#FFFCF3",

    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",

    color: "#513A11",

    textAlignVertical: "top",
  },

  reviewCount: {
    marginTop: 8,
    alignSelf: "flex-end",

    fontSize: 13,
    fontWeight: "600",

    color: "#B8A47F",
  },

  // =========================
  // PhotoUpload 추가 스타일
  // =========================

  imageCount: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",

    color: "#E4A54E",
  },

  emptyPickerText: {
    marginTop: 8,

    fontSize: 16,
    fontWeight: "700",

    color: "#513A11",
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "700",

    color: "#513A11",
  },

  imageCounterText: {
    fontSize: 13,
    fontWeight: "700",

    color: "#FFFFFF",
  },
});
