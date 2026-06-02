export const STATUS_CONFIG = {
  RECRUITING: {
    label: (dday?: number) => (dday ? `D-${dday}` : "교환중"),
    bg: "#FCF5D7",
    text: "#513A11",
    showProgress: true,
  },
  IN_PROGRESS: {
    label: () => "진행 중",
    bg: "#D4EDDA",
    text: "#155724",
    showProgress: true,
  },
  COMPLETE: {
    label: () => "종료",
    bg: "#C3C3C3",
    text: "#333",
    showProgress: false,
  },
} as const;

export type GroupStatus = keyof typeof STATUS_CONFIG;
