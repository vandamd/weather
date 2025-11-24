import { PixelRatio } from 'react-native';

/**
 * Get the current system font scale, capped at 1.0
 *
 * This ensures that:
 * - Smallest and second-smallest Android font size settings scale normally (fontScale <= 1.0)
 * - Medium, Large, and Huge settings are capped at 1.0 (equivalent to second-smallest)
 *
 * @returns The font scale multiplier, capped at maximum of 1.0
 */
export const getAppFontScale = (): number => {
  const systemFontScale = PixelRatio.getFontScale();
  return Math.min(systemFontScale, 1.0);
};

/**
 * Scale a font size based on the app's custom font scaling logic
 *
 * @param size - The base font size in pixels
 * @returns The scaled font size
 */
export const scaledFontSize = (size: number): number => {
  return size * getAppFontScale();
};
