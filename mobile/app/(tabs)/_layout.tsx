import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{label}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.onDark,
        tabBarInactiveTintColor: colors.onDarkMuted,
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopWidth: 0,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.onDark,
        headerTitleStyle: { fontWeight: "800", fontSize: 26 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
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
