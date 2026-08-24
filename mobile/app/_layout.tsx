import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.onDark,
        headerTitleStyle: { fontWeight: "800", fontSize: 20 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="news/[id]" options={{ title: "News" }} />
      <Stack.Screen name="teams/[id]" options={{ title: "Team" }} />
    </Stack>
  );
}
