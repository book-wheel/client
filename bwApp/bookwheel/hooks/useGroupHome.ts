import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { getGroupMembers, getGroupRequests } from "@/api/group";

export type Applicant = {
  id: string;
  name: string;
  joinMent: string;
  requestDate: string;
  profileImageUrl?: string;
};

export type GroupInfo = {
  intro: string;
  rules: string[];
};

export function useGroupHome() {
  const navigation = useNavigation();

  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name]);

  useEffect(() => {
    if (!id) return;

    const fetchGroupData = async () => {
      try {
        // 멤버 조회
        const memberData = await getGroupMembers(id);

        console.log("멤버목록", memberData);

        // 임시:
        // 리더 존재하면 리더라고 처리
        // 나중엔 로그인 유저 PK 비교해야됨
        const leader = memberData.members.find(
          (member: any) => member.role === "LEADER",
        );

        if (leader) {
          setIsLeader(true);

          // 가입 요청 목록 조회
          const requestData = await getGroupRequests(id);

          console.log("가입요청", requestData);

          const mappedApplicants = requestData.map((item: any) => ({
            id: item.memberId,
            name: item.nickname,
            joinMent: item.joinMent,
            requestDate: item.requestDate,
            profileImageUrl: item.profileImageUrl,
          }));

          setApplicants(mappedApplicants);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupData();
  }, [id]);

  // 아직 mock 유지
  const groupInfo: GroupInfo = {
    intro: "추리소설 위주의 독서 모임입니다.",
    rules: [
      "책을 깨끗하게 사용해주세요",
      "모임 날짜를 꼭 지켜주세요",
      "서로의 감상을 존중해주세요",
    ],
  };

  return {
    id,
    name,
    groupInfo,
    applicants,
    isLeader,
  };
}
