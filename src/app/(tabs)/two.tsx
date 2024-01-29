import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, Theme, View } from "tamagui";

export default function TabTwoScreen() {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize={20} fontWeight={"bold"}>
        Tab Two
      </Text>
      <Theme inverse>
        <View marginVertical={32} height={1} width="80%" />
      </Theme>
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
