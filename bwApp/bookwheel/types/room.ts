import type { MyBookStep, MyStep } from "@/types/groupDashboard";

export type HomeReadingStatus =
  | "scheduled"
  | "active"
  | "reschedule_required";

export type HomeReadingRoom = {
  groupId: string;
  groupName: string;
  status: HomeReadingStatus;
  currentRound: number;
  totalRound: number;
  startDate: string | null;
  endDate: string | null;
  dDay: number | null;
  myStep: MyStep | null;
  myBookStep: MyBookStep | null;
};
