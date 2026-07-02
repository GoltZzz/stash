import "@/src/global.css";
import "react-native-reanimated";

import {
  Fraunces_400Regular_Italic,
  Fraunces_600SemiBold,
  useFonts,
} from "@expo-google-fonts/fraunces";
import {
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

import { View } from "@/tw";

import { DatabaseProvider, useDatabase } from "@/providers/database-provider";

SplashScreen.preventAutoHideAsync();

const FgTheme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(234, 88, 12)",
    background: "rgb(255, 251, 245)",
    card: "rgb(255, 251, 245)",
    text: "rgb(41, 28, 18)",
    border: "rgb(234, 218, 200)",
    notification: "rgb(220, 38, 38)",
  },
};

function RootNavigator() {
  const { status, onboardingComplete } = useDatabase();
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (status === "loading" || (!fontsLoaded && !fontError)) {
    return (
      <View className="flex-1 items-center justify-center bg-fg-cream">
        <ActivityIndicator color="rgb(234, 88, 12)" />
      </View>
    );
  }

  return (
    <ThemeProvider value={FgTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "rgb(255, 251, 245)" },
        }}
      >
        <Stack.Protected guard={!onboardingComplete}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboardingComplete}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <RootNavigator />
    </DatabaseProvider>
  );
}
