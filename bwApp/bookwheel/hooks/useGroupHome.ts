import { getMyInfo } from "@/api/auth";
import type { GroupMember } from "@/types/groupMembers";
import { getApiErrorMessage } from "@/api/axios";
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
  const [detailError, setDetailError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

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
      setDetailError("");
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
        if (active) setDetailError(getApiErrorMessage(error, "모임 정보를 불러오지 못했습니다."));
      }
    };

    if (id) {
      fetchGroupDetail();
    }

    return () => {
      active = false;
    };
  }, [id, name, navigation, retryCount]);

  // 그룹 멤버 및 가입 신청자 조회
  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchGroupData = async () => {
      setMembersError("");
      try {
        const [memberData, profileResponse] = await Promise.all([
          getGroupMembers(id),
          getMyInfo(),
        ]);
        const profile = profileResponse.data.data;
        if (!profile) throw new Error("내 정보를 불러오지 못했습니다.");

        if (!active) return;

        const currentMember = memberData.members.find(
          (member: GroupMember) => member.userPK === profile.userPK,
        );
        const leader = currentMember?.role === "LEADER";
        setIsLeader(leader);

        if (leader) {

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
        } else {
          setApplicants([]);
        }
      } catch (error) {
        if (active) setMembersError(getApiErrorMessage(error, "모임 멤버와 가입 신청을 불러오지 못했습니다."));
      }
    };

    fetchGroupData();

    return () => {
      active = false;
    };
  }, [id, retryCount]);

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
    detailError,
    membersError,
    retry: () => setRetryCount((count) => count + 1),
    groupInfo,
    applicants,
    isLeader,
  };
}
