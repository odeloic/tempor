import { strings } from "@/constants/strings";
import { TABS } from "@/constants/tabs";
import { useTheme } from "@/theme/ThemeProvider";
import { Tabs } from "expo-router";


export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        }
      }}
    >
      <Tabs.Screen name={TABS.timer} options={{
        title: strings.tabs.timer
      }} />
      <Tabs.Screen name={TABS.projects} options={{
        title: strings.tabs.projects
      }} />
      <Tabs.Screen name={TABS.add} options={{
        title: strings.tabs.add
      }} />
      <Tabs.Screen name={TABS.history} options={{
        title: strings.tabs.history
      }} />
    </Tabs>
  )
}