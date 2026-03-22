import { View } from "react-native";
import Button from "@/components/Button";

type Props = {
  onPress: () => void;
};

export default function SubmitButton({ onPress }: Props) {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <Button title="리뷰 등록" onPress={onPress} />
    </View>
  );
}
