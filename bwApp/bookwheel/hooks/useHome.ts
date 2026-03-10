import { useState } from "react";
import { Room } from "@/types/room";
import { MyGroup } from "@/types/group";

export function useHome() {
  const [nickname] = useState("문소희");
  const [currentIndex, setCurrentIndex] = useState(0);

  const rooms: Room[] = [
    {
      id: 1,
      name: "교환독서방",
      round: 3,
      dDay: 4,
      book: "괴테는 모든 것을 말했다",
      author: "소피의 일기",
      owner: "조혜연",
    },
    {
      id: 2,
      name: "문장수집가들",
      round: 1,
      dDay: 10,
      book: "어린왕자",
      author: "생텍쥐페리",
      owner: "김민지",
    },
  ];

  const myGroups: MyGroup[] = [
    {
      id: 1,
      dday: 5,
      name: "책바퀴",
      memberCount: "8/8",
      type: "오프라인",
      region: "천안",
      info: "각자 읽고 느낀 점을 자유롭게 공유하는 모임입니다.",
    },
    {
      id: 2,
      dday: 5,
      name: "책바퀴",
      memberCount: "4/6",
      type: "온라인",
      region: "",
      info: "각자 읽고 느낀 점을 자유롭게 공유하는 모임입니다.",
    },
  ];

  return {
    nickname,
    rooms,
    currentIndex,
    setCurrentIndex,
    myGroups,
  };
}
