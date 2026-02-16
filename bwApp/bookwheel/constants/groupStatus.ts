export const STATUS_CONFIG = {
  active: {
    label: (dday?: number) => (dday ? `D-${dday}` : "교환중"),
    bg: "#FCF5D7",
    text: "#513A11",
    showProgress: true,
  },
  scheduled: {
    label: () => "예정",
    bg: "#E5E5E5",
    text: "#513A11",
    showProgress: false,
  },
  done: {
    label: () => "종료",
    bg: "#513A11",
    text: "#FCF5D7",
    showProgress: false,
  },
} as const;

export type GroupStatus = keyof typeof STATUS_CONFIG;
