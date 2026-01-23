import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Timer, Folder, Plus, Clock } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  index: Timer,
  projects: Folder,
  add: Plus,
  history: Clock,
} as const;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom || spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
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
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tab,
                {
                  backgroundColor: isFocused ? colors.textPrimary : 'transparent',
                },
              ]}
            >
              <Icon
                size={20}
                color={isFocused ? colors.background : colors.textSecondary}
                strokeWidth={1.67}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? colors.background : colors.textSecondary,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    borderWidth: 0.5,
    padding: 6,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.md,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    textAlign: 'center',
  },
});
