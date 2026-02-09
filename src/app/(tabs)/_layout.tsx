import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { TABS } from "@/constants/tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const SCREEN_OPTIONS = {
  headerShown: false,
  tabBarStyle: {
    position: 'absolute' as const,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
  },
} as const;

export default function TabLayout() {
  const { t } = useTranslation();
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <CustomTabBar {...props} />,
    []
  );

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={SCREEN_OPTIONS}
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
      <Tabs.Screen name={TABS.settings} options={{
        title: t('tabs.settings')
      }} />
    </Tabs>
  )
}
