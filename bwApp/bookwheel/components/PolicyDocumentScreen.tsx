import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import type { PolicyDocument } from "@/policies/documents";

export default function PolicyDocumentScreen({ document, title }: { document: PolicyDocument; title: string }) {
  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={12}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{title}</Text>

            <View style={styles.headerSide} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.documentHeader}>
              <Text style={styles.title}>{document.title}</Text>
              <Text style={styles.updated}>시행일 {document.effectiveDate}</Text>
              <Text style={styles.updated}>버전 {document.version}</Text>
            </View>

            <View style={styles.divider} />

            {document.sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.segments.map((segment, index) =>
                  segment.bold ? (
                    <Text key={index} style={{ fontWeight: "700" }}>{segment.text}</Text>
                  ) : segment.text,
                )}
              </Section>
            ))}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {document.footer}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 32,
    fontWeight: "300",
    color: "#333333",
    lineHeight: 36,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222222",
  },

  headerSide: {
    width: 40,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 56,
  },

  documentHeader: {
    marginBottom: 24,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#222222",
    lineHeight: 32,
    marginBottom: 8,
  },

  updated: {
    fontSize: 13,
    color: "#999999",
  },

  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 28,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
    lineHeight: 24,
    marginBottom: 12,
  },

  text: {
    fontSize: 14,
    lineHeight: 23,
    color: "#555555",
  },

  footer: {
    marginTop: 4,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  footerText: {
    fontSize: 12,
    lineHeight: 19,
    color: "#999999",
  },
});
