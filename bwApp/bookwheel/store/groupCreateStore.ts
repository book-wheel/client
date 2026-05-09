import { create } from "zustand";

type GroupCreateState = {
  groupName: string;
  groupComment: string;
  groupRule: string;

  groupPublic: boolean;
  groupPassword: string;

  groupOffline: boolean;
  groupRegion: string | null;

  readingPeriod: number;
  startDate: string;

  maxMembers: number;

  setField: (field: string, value: any) => void;
};

export const useGroupCreateStore = create<GroupCreateState>((set) => ({
  groupName: "",
  groupComment: "",
  groupRule: "",

  groupPublic: true,
  groupPassword: "",

  groupOffline: true,
  groupRegion: null,

  readingPeriod: 0,
  startDate: "",

  maxMembers: 0,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
}));
