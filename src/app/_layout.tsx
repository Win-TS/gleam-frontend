import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import {
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from "@expo-google-fonts/silkscreen";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
// @ts-expect-error
import { ModalView } from "react-native-ios-modal";
import { TamaguiProvider, setupNativeSheet } from "tamagui";

import { useColorScheme } from "@/src/components/useColorScheme";
import { useFirebaseStore } from "@/src/stores/firebase";
import { config } from "@/tamagui.config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// setupNativeSheet("ios", ModalView);

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const firebaseStore = useFirebaseStore();

  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    Silkscreen: Silkscreen_400Regular,
    SilkscreenBold: Silkscreen_700Bold,
    SpaceMono: SpaceMono_400Regular,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      firebaseStore.initialize();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config} defaultTheme={colorScheme ?? "light"}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(modal)"
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
