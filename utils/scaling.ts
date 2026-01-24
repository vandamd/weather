import { PixelRatio } from "react-native";

const TARGET_DENSITY = 2.55;

export const getDensityNormalization = () => TARGET_DENSITY / PixelRatio.get();

export const n = (size: number) => size * getDensityNormalization();
