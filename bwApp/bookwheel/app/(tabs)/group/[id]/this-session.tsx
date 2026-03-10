import { View } from "react-native";
import { router } from "expo-router";
import Button from "@/components/Button";

import SessionBook from "@/components/session/SessionBook";
import BookOwnerInfo from "@/components/session/BookOwnerInfo";
import { useSessionBook } from "@/hooks/useSessionBook";

export default function ThisSession() {
  const { groupId, bookOwner } = useSessionBook();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F8F5EC",
        padding: 20,
        justifyContent: "space-between",
      }}
    >
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <SessionBook />

        <BookOwnerInfo
          name={bookOwner.name}
          comment={bookOwner.comment}
          details={bookOwner.details}
        />
      </View>

      <View style={{ width: "100%", alignItems: "center" }}>
        <Button
          title="독서 시작하기"
          onPress={() =>
            router.replace({
              pathname: "/group/[id]/state",
              params: { id: groupId },
            })
          }
        />
      </View>
    </View>
  );
}
