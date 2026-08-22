import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.green },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="news/[id]" options={{ title: "News" }} />
      <Stack.Screen name="teams/[id]" options={{ title: "Team" }} />
    </Stack>
  );
}
