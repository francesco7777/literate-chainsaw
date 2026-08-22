import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.green },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "News",
          tabBarIcon: ({ focused }) => <TabIcon label="📰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="spielplan"
        options={{
          title: "Spielplan",
          tabBarIcon: ({ focused }) => <TabIcon label="⚽" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: "Teams",
          tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="verein"
        options={{
          title: "Verein",
          tabBarIcon: ({ focused }) => <TabIcon label="ℹ️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
