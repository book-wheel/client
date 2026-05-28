import axios from "./axios";

//그룹 만들기
export const makingGroup = async (data: {
  groupName: string;
  groupComment: string;
  groupRule: string;

  groupPublic: boolean;
  groupPassword?: string;

  groupOffline: boolean;
  groupRegion: string | null;

  readingPeriod: number;
  startDate: string;

  maxMembers: number;
}) => {
  const response = await axios.post(`/groups/making`, data);

  return response.data;
};

type GetGroupsParams = {
  state?: "RECRUITING" | "IN_PROGRESS" | "COMPLETE";
  type?: "ONLINE" | "OFFLINE";
  region?:
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

  keyword?: string;

  page?: number;
  size?: number;
};

//그룹 리스트 가져오기
export const getGroups = async ({
  state,
  type,
  region,
  keyword,
  page = 0,
  size = 10,
}: GetGroupsParams) => {
  const response = await axios.get(`/groups`, {
    params: {
      state,
      type,
      region,
      keyword,
      page,
      size,
      sort: "startDate,DESC",
    },
  });

  return response.data;
};

//그룹 가입
export const joinGroup = async (
  groupId: string,
  data: {
    password?: string;
    joinMent?: string;
  },
) => {
  const response = await axios.post(`/groups/${groupId}/join`, data);

  return response.data;
};

//내 모임 조회
export const getMyGroups = async () => {
  const response = await axios.get("/groups/my");

  return response.data.data;
};
