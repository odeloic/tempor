import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { TABS } from "@/constants/tabs";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";


export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
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
