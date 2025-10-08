import { Stack } from "expo-router";
import { useFrameworkReady } from "../../hooks/useFrameworkReady";
import { StackScreen } from "react-native-screens";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="student" />
      <Stack.Screen name="student-profile" />
      <Stack.Screen name="schedules" />
      <Stack.Screen name="student-notification" />
      <Stack.Screen name="poi" />
    </Stack>
  );
}
