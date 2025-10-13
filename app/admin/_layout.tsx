import { Stack } from "expo-router";
import { useFrameworkReady } from "../../hooks/useFrameworkReady";
import { StackScreen } from "react-native-screens";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin-dashboard" />
      <Stack.Screen name="admin-profile" />
      <Stack.Screen name="map-updates" />
      <Stack.Screen name="student-timetable" />
      <Stack.Screen name="user-permission" />
    </Stack>
  );
}
