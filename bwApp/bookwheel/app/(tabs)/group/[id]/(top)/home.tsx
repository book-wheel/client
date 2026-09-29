import ErrorNotice from "@/components/ErrorNotice";
import { showApiError } from "@/api/axios";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";

import GroupIntro from "@/components/group/GroupIntro";
import ApplicantList from "@/components/group/ApplicantList";
import { Applicant, useGroupHome } from "@/hooks/useGroupHome";
import ApplicantDetailModal from "@/components/group/ApplicantDetailModal";
import { updateMemberStatus } from "@/api/group";

export default function Home() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <GroupHomeContent key={id} />;
}

function GroupHomeContent() {
  const {
    id,
    groupInfo,
    detailError,
    membersError,
    retry,
    applicants: initialApplicants,
    isLeader,
  } = useGroupHome();

  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  useEffect(() => {
    setApplicants(initialApplicants);
  }, [initialApplicants]);

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );

  const [modalOpen, setModalOpen] = useState(false);

  // 가입 승인/거절 핸들러
  const handleUpdateStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedApplicant) return;

    try {
      await updateMemberStatus(id, selectedApplicant.id, status);

      // 상태 업데이트 후, 해당 신청자는 목록에서 제거
      setApplicants((prev) =>
        prev.filter((a) => a.id !== selectedApplicant.id),
      );

      // 모달 닫기
      setModalOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      showApiError(error, "가입 신청을 처리하지 못했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF" }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {detailError ? (
          <ErrorNotice message={detailError} onRetry={retry} />
        ) : (
        <GroupIntro
          intro={groupInfo.intro}
          rules={groupInfo.rules}
          currentMembers={groupInfo.currentMembers}
          maxMembers={groupInfo.maxMembers}
          isOffline={groupInfo.isOffline}
        />
        )}
      </View>

      <View style={{ paddingBottom: 12, alignItems: "center" }}>
        {membersError ? (
          <ErrorNotice message={membersError} onRetry={retry} />
        ) : isLeader && (
          <ApplicantList
            applicants={applicants}
            onSelectApplicant={(applicant) => {
              setSelectedApplicant(applicant);
              setModalOpen(true);
            }}
          />
        )}

        <ApplicantDetailModal
          visible={modalOpen}
          applicant={selectedApplicant}
          onClose={() => setModalOpen(false)}
          onApprove={() => handleUpdateStatus("APPROVED")}
          onReject={() => handleUpdateStatus("REJECTED")}
        />

        <Button
          title="채팅방"
          onPress={() => router.push("/group/[id]/chatroom")}
          color="#FCF5D7"
        />
      </View>
    </ScrollView>
  );
}
