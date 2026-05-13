import axios from "./axios";

export const makingGroup = async (data: {
  groupName: string;
  groupComment: string;
  groupRule: string;

  groupPublic: boolean;
  groupPassword: string | null;

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
