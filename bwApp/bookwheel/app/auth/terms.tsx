import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

export default function Terms() {
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

            <Text style={styles.headerTitle}>이용약관</Text>

            <View style={styles.headerSide} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.documentHeader}>
              <Text style={styles.title}>Bookwheel 이용약관</Text>
              <Text style={styles.updated}>시행일 2026년 9월 15일</Text>
            </View>

            <View style={styles.divider} />

            <Section title="제1조 (목적)">
              이 약관은 Bookwheel(이하 "서비스")이 제공하는 교환독서 기반 독서
              관리 및 커뮤니티 서비스의 이용과 관련하여 서비스와 회원 간의 권리,
              의무 및 책임사항을 규정하는 것을 목적으로 합니다.
            </Section>

            <Section title="제2조 (용어의 정의)">
              1. "서비스"란 Bookwheel이 제공하는 교환독서, 그룹 독서, 도서 기록
              및 관련 커뮤니티 기능을 의미합니다.
              {"\n\n"}
              2. "회원"이란 본 약관에 동의하고 회원가입을 완료하여 서비스를
              이용하는 사람을 의미합니다.
              {"\n\n"}
              3. "그룹"이란 회원들이 함께 독서 활동을 진행하기 위해 서비스를
              통해 생성하거나 참여하는 독서 모임을 의미합니다.
              {"\n\n"}
              4. "콘텐츠"란 회원이 서비스에 게시하거나 등록하는 글, 댓글, 사진,
              메모, 독서 기록 등의 정보를 의미합니다.
            </Section>

            <Section title="제3조 (약관의 효력 및 변경)">
              1. 회원이 회원가입 과정에서 본 약관에 동의함으로써 약관의 효력이
              발생합니다.
              {"\n\n"}
              2. 서비스는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수
              있습니다.
              {"\n\n"}
              3. 약관이 변경되는 경우 서비스 내 공지 등의 방법으로 회원에게
              안내합니다.
            </Section>

            <Section title="제4조 (회원가입)">
              1. 회원가입은 회원이 서비스에서 정한 가입 절차에 따라 필요한
              정보를 입력하고 본 약관 및 개인정보 처리방침에 동의함으로써
              완료됩니다.
              {"\n\n"}
              2. 회원은 정확하고 최신의 정보를 제공해야 합니다.
              {"\n\n"}
              3. 회원이 허위 정보를 제공하여 발생하는 문제에 대해서는 해당
              회원이 책임을 부담합니다.
              {"\n\n"}
              4. 회원가입 후 프로필 설정을 완료하지 않은 계정은 계정
              생성일로부터 7일이 경과한 후 삭제될 수 있습니다.
            </Section>

            <Section title="제5조 (서비스의 제공)">
              서비스는 다음과 같은 기능을 제공할 수 있습니다.
              {"\n\n"}• 독서 그룹 생성 및 참여{"\n"}• 교환독서 진행 및 독서 기록
              관리
              {"\n"}• 도서 및 독서 관련 정보 등록{"\n"}• 댓글, 사진, 메모 등의
              콘텐츠 작성{"\n"}• 그룹 활동 및 독서 이력 확인{"\n"}• 기타
              서비스가 제공하는 독서 관련 기능
            </Section>

            <Section title="제6조 (회원의 의무)">
              회원은 다음 행위를 해서는 안 됩니다.
              {"\n\n"}
              1. 타인의 계정을 부정하게 이용하는 행위
              {"\n\n"}
              2. 타인의 개인정보를 무단으로 수집하거나 공개하는 행위
              {"\n\n"}
              3. 타인의 저작권, 초상권 등 권리를 침해하는 행위
              {"\n\n"}
              4. 욕설, 비방, 혐오 또는 타인에게 불쾌감을 주는 콘텐츠를 게시하는
              행위
              {"\n\n"}
              5. 서비스의 정상적인 운영을 방해하는 행위
              {"\n\n"}
              6. 기타 관련 법령 또는 본 약관을 위반하는 행위
            </Section>

            <Section title="제7조 (회원의 콘텐츠)">
              1. 회원이 서비스에 게시한 콘텐츠의 책임은 해당 회원에게 있습니다.
              {"\n\n"}
              2. 회원은 자신이 게시하는 콘텐츠에 대해 필요한 권리를 보유하고
              있어야 합니다.
              {"\n\n"}
              3. 서비스는 법령 또는 본 약관에 위반되는 콘텐츠에 대해 관련 법령
              및 내부 기준에 따라 삭제 또는 이용 제한 등의 조치를 취할 수
              있습니다.
            </Section>

            <Section title="제8조 (서비스 이용 제한)">
              회원이 관련 법령 또는 본 약관을 위반하거나 서비스의 정상적인
              운영을 방해하는 경우 서비스는 해당 회원의 서비스 이용을 제한하거나
              회원자격을 정지 또는 해지할 수 있습니다.
            </Section>

            <Section title="제9조 (회원 탈퇴)">
              1. 회원은 서비스에서 제공하는 절차를 통해 언제든지 회원 탈퇴를
              요청할 수 있습니다.
              {"\n\n"}
              2. 탈퇴 이후에도 관련 법령 또는 개인정보 처리방침에 따라 일정 기간
              보관이 필요한 정보는 해당 기간 동안 보관될 수 있습니다.
              {"\n\n"}
              3. 회원의 탈퇴 또는 계정 삭제 이후에도 약관 및 개인정보 처리방침에
              대한 동의 사실을 확인하기 위한 증적은 관련 정책에 따라 3년간
              별도로 보관될 수 있습니다.
            </Section>

            <Section title="제10조 (서비스의 변경 및 중단)">
              서비스는 운영상, 기술상 또는 기타 필요한 사유가 있는 경우 서비스의
              일부 또는 전부를 변경하거나 일시적으로 중단할 수 있습니다. 중요한
              변경 또는 중단이 있는 경우 가능한 범위에서 회원에게 사전에
              안내합니다.
            </Section>

            <Section title="제11조 (면책)">
              서비스는 천재지변, 통신 장애 등 불가항력적인 사유로 인해 서비스를
              제공할 수 없는 경우 그 책임이 제한될 수 있습니다. 또한 회원의
              귀책사유로 발생한 서비스 이용 장애에 대해서는 책임을 부담하지
              않습니다.
            </Section>

            <Section title="제12조 (준거법 및 관할)">
              서비스와 회원 간의 분쟁에 대해서는 대한민국 법령을 준거법으로
              합니다. 서비스 이용과 관련하여 분쟁이 발생하는 경우 관련 법령에서
              정한 절차에 따라 해결합니다.
            </Section>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                본 약관은 2026년 9월 15일부터 적용됩니다.
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
