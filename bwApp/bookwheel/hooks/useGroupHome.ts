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
    name?: string;
  }>();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLeader, setIsLeader] = useState(false);

  // 화면 타이틀
  useEffect(() => {
    if (!name) return;

    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name, navigation]);

  // 그룹 상세 정보 조회
  useEffect(() => {
    let active = true;

    const fetchGroupDetail = async () => {
      try {
        const data = await getGroupDetail(id);

        if (!active) return;

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

    return () => {
      active = false;
    };
  }, [id, name, navigation]);

  // 그룹 멤버 및 가입 신청자 조회
  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchGroupData = async () => {
      try {
        const memberData = await getGroupMembers(id);

        if (!active) return;

        const leader = memberData.members.find(
          (member: any) => member.role === "LEADER",
        );

        if (leader) {
          setIsLeader(true);

          const requestData = await getGroupRequests(id);

          if (!active) return;

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

    return () => {
      active = false;
    };
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
