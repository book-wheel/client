import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { getMyInfo } from "@/api/auth";
import { getGroupMembers, getGroupRequests, getGroupDetail } from "@/api/group";
import type { GroupMembersData } from "@/types/groupMembers";

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
    name?: string;
  }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    intro: "",
    rules: "",
    currentMembers: 0,
    maxMembers: 0,
    isOffline: false,
  });

  // 화면 타이틀
  useEffect(() => {
    if (!name) return;

    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name, navigation]);

  // 그룹 상세 정보 조회
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const data = await getGroupDetail(id);

        if (!name) {
          navigation.getParent()?.setOptions({ title: data.groupName });
          navigation.getParent()?.getParent()?.setOptions({
            title: data.groupName,
          });
        }

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
  }, [id, name, navigation]);

  useEffect(() => {
    if (!id) return;

    const fetchGroupData = async () => {
      try {
        const [memberData, myInfoResponse] = await Promise.all([
          getGroupMembers(id) as Promise<GroupMembersData>,
          getMyInfo(),
        ]);

        console.log("멤버목록", memberData);

        const currentUserPK = myInfoResponse.data.data?.userPK;
        const leader = memberData.members.find(
          (member) =>
            member.role === "LEADER" && member.userPK === currentUserPK,
        );

        setIsLeader(Boolean(leader));

        if (leader) {
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
        } else {
          setApplicants([]);
        }
      } catch (error) {
        setIsLeader(false);
        setApplicants([]);
        console.error(error);
      }
    };

    fetchGroupData();
  }, [id]);

  return {
    id,
    name,
    groupInfo,
    applicants,
    isLeader,
  };
}
