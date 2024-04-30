import { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";

export const usePreventHardwareBackPress = () => {
  const preventBackCallback = useCallback(() => true, []);

  const removePreventHardwareBackPressCallback = useCallback(
    () =>
      BackHandler.removeEventListener("hardwareBackPress", preventBackCallback),
    [],
  );

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", preventBackCallback);

    return removePreventHardwareBackPressCallback;
  }, []);

  return { removePreventHardwareBackPressCallback };
};
