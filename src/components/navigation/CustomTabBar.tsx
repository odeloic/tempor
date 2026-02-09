import { useTheme } from '@/theme/ThemeProvider';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Timer, Folder, Plus, Clock, Settings } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarItem } from '@/components/navigation/TabBarItem';

const ICONS = {
  index: Timer,
  projects: Folder,
  add: Plus,
  history: Clock,
  settings: Settings,
} as const;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom || spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.xs + 2,
            gap: spacing.xs,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const iconKey = route.name as keyof typeof ICONS;
          if (__DEV__ && !(iconKey in ICONS)) {
            console.warn(`CustomTabBar: missing icon for route "${route.name}"`);
          }
          const Icon = ICONS[iconKey] ?? Timer;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarItem
              key={route.key}
              icon={Icon}
              label={label}
              selected={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
  },
});
