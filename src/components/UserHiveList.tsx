import { View, useWindowDimensions } from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import VerticalList from "@/src/components/VerticalList";
import { UserHive } from "@/src/schemas/hive";

export default function ({
  hiveList,
  onPress,
  onEndReached,
  spinner,
}: {
  hiveList: UserHive[];
  onPress?: (hive: UserHive) => void;
  onEndReached?: () => void;
  spinner?: () => React.ReactNode;
}) {
  const { width } = useWindowDimensions();

  return (
    <View f={1} w={width} $gtSm={{ maw: "$20" }}>
      {spinner ? (
        spinner()
      ) : (
        <VerticalList
          data={hiveList}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          onEndReached={onEndReached}
          renderItem={({ item }) => (
            <View f={1} mx="$1.5">
              <HiveBtn
                hive={item}
                onPress={() => onPress?.(item)}
                overlay={`${item.user_streak}`}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
