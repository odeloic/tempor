import React from 'react';
import { type FlatListProps } from 'react-native';
import { spacing } from '@/theme/tokens';
import { AppFlatList } from '@/components/ui/AppFlatList';

type ScreenListProps<ItemT> = FlatListProps<ItemT> & {
  contentPaddingHorizontal?: number;
};

export function ScreenList<ItemT>({
  contentPaddingHorizontal = spacing.lg,
  contentContainerStyle,
  ...props
}: ScreenListProps<ItemT>) {
  return (
    <AppFlatList
      {...props}
      contentContainerStyle={[
        { paddingHorizontal: contentPaddingHorizontal },
        contentContainerStyle,
      ]}
    />
  );
}
