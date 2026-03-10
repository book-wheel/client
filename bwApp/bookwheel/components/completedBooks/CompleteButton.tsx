import { View } from "react-native";
import Button from "@/components/Button";

type Props = {
  onPress: () => void;
};

export default function CompleteButton({ onPress }: Props) {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <Button title="완독" onPress={onPress} />
    </View>
  );
}
