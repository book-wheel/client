import { useState } from "react";
import { router } from "expo-router";

export function useCompletedBooks(id: string, memberId: string) {
  const [review, setReview] = useState("");

  const handleComplete = () => {
    router.replace({
      pathname: "/group/[id]/state",
      params: {
        id,
        memberId,
        newStatus: "completed",
      },
    });
  };

  return {
    review,
    setReview,
    handleComplete,
  };
}
