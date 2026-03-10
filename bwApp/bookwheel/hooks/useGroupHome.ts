import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export type Applicant = {
  id: string;
  name: string;
};

export type GroupInfo = {
  intro: string;
  rules: string[];
};

export function useGroupHome() {
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  useEffect(() => {
    navigation.getParent()?.setOptions({ title: name });
    navigation.getParent()?.getParent()?.setOptions({ title: name });
  }, [name]);

  const groupInfo: GroupInfo = {
    intro: "추리소설 위주의 독서 모임입니다.",
    rules: [
      "책을 깨끗하게 사용해주세요",
      "모임 날짜를 꼭 지켜주세요",
      "서로의 감상을 존중해주세요",
    ],
  };

  const applicants: Applicant[] = [
    { id: "1", name: "김주옥" },
    { id: "2", name: "문소희" },
  ];

  return {
    id,
    name,
    groupInfo,
    applicants,
  };
}
