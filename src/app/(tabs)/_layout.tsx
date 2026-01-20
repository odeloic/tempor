import { TABS } from "@/constants/tabs";
import { useTheme } from "@/theme/ThemeProvider";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";


export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
        title: t('tabs.timer')
      }} />
      <Tabs.Screen name={TABS.projects} options={{
        title: t('tabs.projects')
      }} />
      <Tabs.Screen name={TABS.add} options={{
        title: t('tabs.add')
      }} />
      <Tabs.Screen name={TABS.history} options={{
        title: t('tabs.history')
      }} />
    </Tabs>
  )
}