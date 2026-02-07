import React from 'react';
import {
  ScrollView as RNScrollView,
  type ScrollViewProps
} from 'react-native';

export function AppScrollView({
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  ...props
}: ScrollViewProps) {
  return (
    <RNScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...props}
    />
  );
}
