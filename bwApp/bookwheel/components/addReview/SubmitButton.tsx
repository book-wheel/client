import { View } from "react-native";
import Button from "@/components/Button";

type Props = {
  onPress: () => void;
  isSubmitting?: boolean;
};

export default function SubmitButton({
  onPress,
  isSubmitting = false,
}: Props) {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <Button
        title={isSubmitting ? "등록 중..." : "리뷰 등록"}
        disabled={isSubmitting}
        onPress={onPress}
      />
    </View>
  );
}
