import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Privacy() {
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

            <Text style={styles.headerTitle}>개인정보 처리방침</Text>

            <View style={styles.headerSide} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.documentHeader}>
              <Text style={styles.title}>Bookwheel 개인정보 처리방침</Text>
              <Text style={styles.updated}>시행일 2026년 9월 15일</Text>
            </View>

            <View style={styles.divider} />

            <Section title="제1조 (개인정보의 처리 목적)">
              Bookwheel(이하 "서비스")은 다음의 목적을 위해 개인정보를
              처리합니다.
              {"\n\n"}
              1. 회원가입 및 회원 관리{"\n"}
              2. 회원 식별 및 인증{"\n"}
              3. 서비스 제공 및 이용 관리{"\n"}
              4. 독서 그룹 및 교환독서 서비스 제공{"\n"}
              5. 서비스 이용 관련 문의 및 민원 처리{"\n"}
              6. 서비스의 안정적인 운영 및 부정 이용 방지
            </Section>

            <Section title="제2조 (처리하는 개인정보의 항목)">
              서비스는 회원가입 및 서비스 이용을 위해 다음의 개인정보를 처리할
              수 있습니다.
              {"\n\n"}
              <Text style={styles.bold}>회원가입 및 인증 시</Text>
              {"\n"}• 아이디{"\n"}• 이메일 주소{"\n"}• 비밀번호{"\n"}• 소셜
              로그인 정보(소셜 로그인 이용 시 소셜 서비스에서 제공되는 식별정보
              등)
              {"\n\n"}
              <Text style={styles.bold}>서비스 이용 시</Text>
              {"\n"}• 프로필 정보(닉네임, 소개, 프로필 이미지 등){"\n"}• 회원이
              서비스에 직접 작성하거나 등록한 콘텐츠{"\n"}• 서비스 이용 기록
              {"\n"}• 좋아요, 투표, 신고 등 서비스 이용 활동 정보{"\n"}• 알림
              설정 등 서비스 이용 설정 정보{"\n"}• 푸시 알림 제공을 위한 기기
              또는 푸시 알림 관련 식별정보
              {"\n\n"}
              <Text style={styles.bold}>회원 탈퇴 및 동의 이력 관리 시</Text>
              {"\n"}• 회원의 이용 및 탈퇴와 관련하여 필요한 정보{"\n"}• 약관 및
              개인정보 처리방침 동의 여부, 동의한 약관의 버전, 문서 해시, 동의
              시각 및 동의 사실을 확인하기 위한 식별정보
              {"\n\n"}
              실제 처리되는 개인정보의 항목은 서비스의 기능 및 운영 방식에 따라
              변경될 수 있으며, 변경 시 개인정보 처리방침을 통해 안내합니다.
            </Section>

            <Section title="제3조 (개인정보의 처리 및 보유 기간)">
              서비스는 개인정보의 처리 목적이 달성되거나 회원이 탈퇴하는 경우
              원칙적으로 해당 개인정보를 지체 없이 파기합니다.
              {"\n\n"}
              다만 관련 법령에 따라 보관할 필요가 있거나 서비스 운영 및 분쟁
              해결 등을 위해 필요한 경우에는 해당 목적에 필요한 최소한의
              범위에서 일정 기간 보관할 수 있습니다.
              {"\n\n"}
              회원가입 후 프로필 설정을 완료하지 않은 계정은 계정 생성일로부터
              7일이 경과한 후 삭제될 수 있습니다.
              {"\n\n"}
              회원의 탈퇴 또는 계정 삭제 이후에도 약관 및 개인정보 처리방침에
              대한 동의 사실을 확인하기 위한 동의 증적은 3년간 별도로 보관할 수
              있습니다. 동의 증적에는 이메일 주소 원문을 저장하지 않으며, 동의한
              정책의 버전, 문서 해시, 동의 시각 및 식별을 위한 HMAC 등의 정보가
              포함될 수 있습니다.
            </Section>

            <Section title="제4조 (개인정보의 제3자 제공)">
              서비스는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.
              {"\n\n"}
              다만 회원의 별도 동의가 있거나 법령에 특별한 규정이 있는 경우에는
              예외적으로 개인정보를 제공할 수 있습니다.
              {"\n\n"}
              서비스 이용 과정에서 외부 서비스의 기능을 이용하는 경우 해당
              서비스의 제공을 위해 필요한 정보가 해당 서비스로 전달될 수
              있습니다.
            </Section>

            <Section title="제5조 (개인정보 처리의 위탁)">
              서비스는 원활한 서비스 제공을 위해 개인정보 처리 업무의 일부를
              외부 업체 또는 서비스에 위탁할 수 있습니다.
              {"\n\n"}
              현재 서비스 운영 과정에서 이용되는 외부 서비스에는 이메일 인증 및
              계정 관련 이메일 발송 서비스, 푸시 알림 서비스 등이 포함될 수
              있습니다.
              {"\n\n"}
              위탁 또는 개인정보의 국외 이전이 발생하는 경우 관련 법령에서
              요구하는 사항을 확인하여 위탁받는 업체 또는 이전받는 자, 위탁 또는
              이전되는 개인정보의 항목, 목적 및 기간 등의 내용을 개인정보
              처리방침을 통해 안내합니다.
            </Section>

            <Section title="제6조 (개인정보의 파기)">
              개인정보의 보유기간이 경과하거나 처리 목적이 달성된 경우 해당
              개인정보를 지체 없이 파기합니다.
              {"\n\n"}
              전자적 파일 형태의 개인정보는 복구 또는 재생되지 않도록 안전한
              방법으로 삭제하며, 종이 문서 형태의 개인정보는 분쇄 또는 소각 등의
              방법으로 파기합니다.
              {"\n\n"}
              다만 제3조에 따라 별도로 보관되는 동의 증적 등은 해당 보유기간이
              경과한 후 안전한 방법으로 파기합니다.
            </Section>

            <Section title="제7조 (정보주체의 권리와 행사방법)">
              회원은 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지
              등을 요청할 수 있습니다.
              {"\n\n"}
              개인정보 관련 권리의 행사는 서비스 내 제공되는 기능 또는 개인정보
              보호 담당자를 통한 문의 등의 방법으로 할 수 있습니다.
            </Section>

            <Section title="제8조 (개인정보의 안전성 확보조치)">
              서비스는 개인정보가 분실, 도난, 유출, 위조, 변조 또는 훼손되지
              않도록 관련 법령에 따라 필요한 기술적·관리적 보호조치를 취합니다.
              {"\n\n"}
              또한 개인정보에 대한 접근 권한을 관리하고 개인정보를 안전하게
              처리하기 위해 필요한 보안 조치를 적용합니다.
            </Section>

            <Section title="제9조 (개인정보 보호책임자)">
              개인정보 처리와 관련된 문의, 불만 처리 및 피해구제 등에 관한
              사항은 아래의 연락처를 통해 문의할 수 있습니다.
              {"\n\n"}• 담당자: 문소희{"\n"}• 이메일: bookwheel.kr@gmail.com
              {"\n"}• 연락처: +82 10-7724-8716
            </Section>

            <Section title="제10조 (개인정보 처리방침의 변경)">
              본 개인정보 처리방침의 내용이 변경되는 경우 서비스 내 공지사항
              등을 통해 변경 내용을 안내합니다.
            </Section>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                본 개인정보 처리방침은 2026년 9월 15일부터 적용됩니다.
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

  bold: {
    fontWeight: "700",
    color: "#333333",
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
