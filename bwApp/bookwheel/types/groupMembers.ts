export type GroupMember = {
  memberId: string;
  userPK: string;
  nickname: string;
  profileImageUrl: string;
  role: "LEADER" | "VICE" | "MEMBER";
  readOrder: number;
};

export type GroupMembersData = {
  totalCount: number;
  members: GroupMember[];
};
