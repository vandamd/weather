import { PixelRatio } from 'react-native';

// Baseline density - corresponds to Android's minimum display size setting
// This value was measured on the device when display size was set to minimum
const BASELINE_DENSITY = 2.55;

/**
 * Get the density normalization factor
 *
 * This normalizes measurements to behave as if the display size is always
 * set to the minimum, regardless of the actual Android display size setting.
 *
 * @returns The density normalization multiplier
 */
export const getDensityNormalization = (): number => {
  const currentDensity = PixelRatio.get();
  return BASELINE_DENSITY / currentDensity;
};

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
 * Applies both font scale (from font size setting) and density normalization
 * (to ignore display size setting)
 *
 * @param size - The base font size in pixels
 * @returns The scaled font size
 */
export const scaledFontSize = (size: number): number => {
  return size * getAppFontScale() * getDensityNormalization();
};

/**
 * Normalize a measurement (width, height, margin, padding, etc.) based on density
 *
 * This makes measurements behave as if the display size is always set to minimum,
 * ignoring the Android display size setting.
 *
 * @param size - The base measurement in pixels
 * @returns The normalized measurement
 */
export const normalizedSize = (size: number): number => {
  return size * getDensityNormalization();
};
