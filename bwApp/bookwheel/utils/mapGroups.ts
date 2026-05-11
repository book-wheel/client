import { ExtendedGroup } from "@/components/groups/GroupListExtended";

export const mapGroups = (content: any[]): ExtendedGroup[] => {
  return content.map((g) => ({
    id: g.groupId,
    title: g.groupName,
    description: g.groupComment,

    isOffline: g.groupOffline,
    region: g.groupRegion,

    isPrivate: !g.groupPublic,

    // 상태 매핑
    status:
      g.groupState === "RECRUITING"
        ? "scheduled"
        : g.groupState === "IN_PROGRESS"
          ? "active"
          : "done",

    total: g.groupRoundCount,
    current: g.currentMembers,
    maxPeople: g.maxMembers,

    dday: g.dday,
    startDate: g.startDate,
  }));
};
