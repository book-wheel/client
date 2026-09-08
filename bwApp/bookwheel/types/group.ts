export type MyGroup = {
  id: number;
  dday: number;
  name: string;
  memberCount: string;
  type: string;
  region: string;
  info: string;
};

export type GroupRegion =
  | "SEOUL"
  | "GYEONGGI"
  | "INCHEON"
  | "GANGWON"
  | "CHUNG_BUK"
  | "CHUNG_NAM"
  | "DAEJEON"
  | "SEJONG"
  | "JEON_BUK"
  | "JEON_NAM"
  | "GWANGJU"
  | "GYEONG_BUK"
  | "GYEONG_NAM"
  | "DAEGU"
  | "ULSAN"
  | "BUSAN"
  | "JEJU";

export type GroupDetailButtonType = "JOIN" | "JOINED" | "LEADER_SETTING";

export type GroupDetail = {
  groupId: string;
  groupName: string;
  groupComment: string;
  groupRule: string;
  groupPublic: boolean;
  groupOffline: boolean;
  groupRegion: GroupRegion | null;
  readingPeriod: number | null;
  startDate: string | null;
  maxMembers: number;
  currentMembers: number;
  groupRoundCount: number;
  groupState: "RECRUITING" | "IN_PROGRESS" | "COMPLETE" | "DELETED";
  bottomButtonType: GroupDetailButtonType;
};

export type GroupUpdateRequest = Pick<
  GroupDetail,
  | "groupName"
  | "groupComment"
  | "groupRule"
  | "groupPublic"
  | "groupOffline"
  | "groupRegion"
  | "maxMembers"
> & {
  groupPassword?: string;
};
