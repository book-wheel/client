import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { getGroupMembers, getGroupRequests, getGroupDetail } from "@/api/group";

export type Applicant = {
  id: string;
  name: string;
  joinMent: string;
  requestDate: string;
  profileImageUrl?: string;
};

export type GroupInfo = {
  intro: string;
  rules: string;

  currentMembers: number;
  maxMembers: number;

  isOffline: boolean;
};

export function useGroupHome() {
  const navigation = useNavigation();

  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLeader, setIsLeader] = useState(false);

  // 화면 타이틀
  useEffect(() => {
    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name]);

  // 그룹 상세 정보 조회
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const data = await getGroupDetail(id);

        setGroupInfo({
          intro: data.groupComment,
          rules: data.groupRule,

          currentMembers: data.currentMembers,
          maxMembers: data.maxMembers,

          isOffline: data.groupOffline,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchGroupDetail();
    }
  }, [id]);

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

  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    intro: "",
    rules: "",

    currentMembers: 0,
    maxMembers: 0,

    isOffline: false,
  });

  return {
    id,
    name,
    groupInfo,
    applicants,
    isLeader,
  };
}
