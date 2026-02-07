import { useTheme } from '@/theme/ThemeProvider';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Timer, Folder, Plus, Clock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarItem } from '@/components/navigation/TabBarItem';

const ICONS = {
  index: Timer,
  projects: Folder,
  add: Plus,
  history: Clock,
} as const;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
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
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const Icon = ICONS[route.name as keyof typeof ICONS] ?? Timer;

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
  container: {},
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    padding: 6,
    gap: 4,
  },
});
