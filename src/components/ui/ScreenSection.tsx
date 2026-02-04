import React from 'react';
import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle, View } from 'react-native';
import { spacing } from '@/theme/tokens';

type ScreenSectionProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  paddingHorizontal?: number;
};

export function ScreenSection({
  children,
  style,
  paddingHorizontal = spacing.lg,
}: ScreenSectionProps) {
  return (
    <View style={[{ paddingHorizontal }, style]}>
      {children}
    </View>
  );
}
