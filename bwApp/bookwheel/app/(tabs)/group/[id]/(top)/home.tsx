import { View } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";

import GroupIntro from "@/components/group/GroupIntro";
import ApplicantList from "@/components/group/ApplicantList";
import { Applicant, useGroupHome } from "@/hooks/useGroupHome";
import ApplicantDetailModal from "@/components/group/ApplicantDetailModal";
import { updateMemberStatus } from "@/api/group";

export default function Home() {
  const {
    id,
    groupInfo,
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
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between",
      }}
    >
      <View>
        <GroupIntro
          intro={groupInfo.intro}
          rules={groupInfo.rules}
          currentMembers={groupInfo.currentMembers}
          maxMembers={groupInfo.maxMembers}
          isOffline={groupInfo.isOffline}
        />
      </View>

      <View style={{ paddingBottom: 12, alignItems: "center" }}>
        {isLeader && (
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
    </View>
  );
}
