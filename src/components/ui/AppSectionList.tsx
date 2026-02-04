import React from 'react';
import {
  SectionList as RNSectionList,
  type SectionListProps
} from 'react-native';

export function AppSectionList<ItemT, SectionT>({
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  ...props
}: SectionListProps<ItemT, SectionT>) {
  return (
    <RNSectionList
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...props}
    />
  );
}
