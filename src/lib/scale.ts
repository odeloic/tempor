import { Dimensions } from 'react-native';

const DESIGN_WIDTH = 375; // standard iPhone design baseline

/**
 * Scale a size value proportionally to screen width.
 * Design baseline: 375pt (standard iPhone).
 */
export function scale(size: number): number {
  const { width } = Dimensions.get('window');
  return Math.round(size * (width / DESIGN_WIDTH));
}
