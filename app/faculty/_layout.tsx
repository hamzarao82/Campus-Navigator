import { Stack } from "expo-router";
import { useFrameworkReady } from "../../hooks/useFrameworkReady";
import { StackScreen } from "react-native-screens";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="faculty-dashboard" />
      <Stack.Screen name="faculty-profile" />
    </Stack>
  );
}
