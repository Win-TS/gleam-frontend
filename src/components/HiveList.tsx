import { View, useWindowDimensions } from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import VerticalList from "@/src/components/VerticalList";
import { Hive } from "@/src/schemas/hive";

export default function ({
  hiveList,
  onPress,
  onEndReached,
  spinner,
}: {
  hiveList: Hive[];
  onPress?: (hive: Hive) => void;
  onEndReached?: () => void;
  spinner?: () => React.ReactNode;
}) {
  const { width } = useWindowDimensions();

  return (
    <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
      {spinner ? (
        spinner()
      ) : (
        <VerticalList
          data={hiveList}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
          onEndReached={onEndReached}
          renderItem={({ item }) => (
            <View f={1} paddingHorizontal="$1.5">
              <HiveBtn hive={item} onPress={() => onPress?.(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}
