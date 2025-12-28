import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "../hooks/useFrameworkReady";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  useFrameworkReady();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  // Show loader until fonts are ready
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          // 👇 Apply global Poppins font to headers & text
          headerTitleStyle: { fontFamily: "Poppins_500Medium" },
        }}
      >
        <Stack.Screen name="intro" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
