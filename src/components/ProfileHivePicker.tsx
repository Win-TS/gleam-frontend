import { Text, View } from "tamagui";

import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import UserHiveList from "@/src/components/UserHiveList";
import { TextStyle } from "@/src/constants/TextStyle";
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
          <Text {...TextStyle.button.large}>PERSONAL HIVE</Text>
          <View f={1} fb={0} jc="center" ai="center">
            {spinner ? (
              spinner()
            ) : data.personal_groups.length > 0 ? (
              <UserHiveList hiveList={data.personal_groups} onPress={onPress} />
            ) : (
              <Text {...TextStyle.description}>no personal hives :(</Text>
            )}
          </View>
          <Text {...TextStyle.button.large}>SOCIAL HIVE</Text>
          <View f={1} fb={0} jc="center" ai="center">
            {spinner ? (
              spinner()
            ) : data.social_groups.length > 0 ? (
              <UserHiveList hiveList={data.social_groups} onPress={onPress} />
            ) : (
              <Text {...TextStyle.description}>no social hives :(</Text>
            )}
          </View>
        </>
      )}
    />
  );
}
