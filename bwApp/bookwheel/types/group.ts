export type MyGroupStatus =
  | "scheduled"
  | "reschedule_required"
  | "active"
  | "done";

export type MyGroup = {
  id: string;
  status: MyGroupStatus;
  dday: number | null;
  startDate: string | null;
  name: string;
  memberCount: string;
  type: string;
  region: string;
  info: string;
};

export type MyGroupApiResponse = {
  groupId: string;
  groupName: string;
  groupComment: string;
  groupOffline: boolean;
  groupRegion: string | null;
  currentMembers: number;
  maxMembers: number;
  groupState: "RECRUITING" | "IN_PROGRESS" | "COMPLETE";
  status: MyGroupStatus;
  dday: number | null;
  startDate: string | null;
};
