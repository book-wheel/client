import { Group } from "@/components/groups/MyGroupList";

export const mapMyGroups = (groups: any[]): Group[] => {
  return groups.map((group) => ({
    id: group.groupId,

    title: group.groupName,

    isOffline: group.groupOffline,
    region: group.groupRegion,

    status: group.groupState,

    current: group.currentMembers,
    maxPeople: group.maxMembers,

    dday: group.dday,
    startDate: group.startDate,
    needsReschedule: group.status === "reschedule_required",

    role: group.bottomButtonType === "LEADER_SETTING" ? "OWNER" : "MEMBER",
  }));
};
