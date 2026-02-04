import React from 'react';
import {
  FlatList as RNFlatList,
  type FlatListProps
} from 'react-native';

export function AppFlatList<ItemT>({
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  ...props
}: FlatListProps<ItemT>) {
  return (
    <RNFlatList
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...props}
    />
  );
}
