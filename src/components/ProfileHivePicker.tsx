import { Text, View } from "tamagui";

import HiveList from "@/src/components/HiveList";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import { useUserHiveListQuery } from "@/src/hooks/hive";
import { Hive } from "@/src/schemas/hive";

export default function ({
  userId,
  onPress,
}: {
  userId: number;
  onPress?: (hive: Hive) => void;
}) {
  const userHiveListQuery = useUserHiveListQuery(userId);

  return (
    <QueryPlaceholder
      query={userHiveListQuery}
      spinnerSize="large"
      renderSpinner
      renderData={({ data, spinner }) => (
        <>
          <Text>PERSONAL HIVE</Text>
          <View flex={1} flexBasis={0} jc="center" ai="center">
            {spinner ? (
              spinner()
            ) : data.personal_groups.length > 0 ? (
              <HiveList hiveList={data.personal_groups} onPress={onPress} />
            ) : (
              <Text>no personal hives :(</Text>
            )}
          </View>
          <Text>SOCIAL HIVE</Text>
          <View flex={1} flexBasis={0} jc="center" ai="center">
            {spinner ? (
              spinner()
            ) : data.social_groups.length > 0 ? (
              <HiveList hiveList={data.social_groups} onPress={onPress} />
            ) : (
              <Text>no social hives :(</Text>
            )}
          </View>
        </>
      )}
    />
  );
}
