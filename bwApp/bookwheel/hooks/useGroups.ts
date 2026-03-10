import { useState } from "react";
import { Group } from "@/components/groups/MyGroupList";

export function useGroups() {
  const [open, setOpen] = useState(false);

  const groups: Group[] = [
    {
      id: "1",
      isOffline: true,
      region: "서울",
      status: "active",
      dday: 5,
      title: "책바퀴 독서모임",
      current: 4,
      total: 7,
      maxPeople: 10,
    },
    {
      id: "2",
      isOffline: false,
      status: "scheduled",
      title: "소설 애독가들",
      current: 0,
      total: 2,
      maxPeople: 8,
      startDate: "2026/3/21",
    },
    {
      id: "3",
      isOffline: true,
      region: "부산",
      status: "done",
      title: "교독교독",
      current: 8,
      total: 8,
      maxPeople: 8,
    },
  ];

  const activeGroups = groups.filter((g) => g.status === "active");

  const otherGroups = groups.filter(
    (g) => g.status === "scheduled" || g.status === "done",
  );

  return {
    open,
    setOpen,
    activeGroups,
    otherGroups,
  };
}
