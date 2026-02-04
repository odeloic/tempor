import React from 'react';
import { type ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { ScreenSection } from '@/components/ui/ScreenSection';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  onBack,
  right,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <ScreenSection style={style}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              {
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.side} />
        )}
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side}>
          {right}
        </View>
      </View>
    </ScreenSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontFamily: fonts.sansSemiBold,
    textAlign: 'center',
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
