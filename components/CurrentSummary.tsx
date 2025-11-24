import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { StyledText } from "@/components/StyledText";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { scaledFontSize } from "@/utils/fontScaling";
import { formatNumber } from "@/utils/numberFormatting";

interface CurrentSummaryProps {
	currentTemperature: number;
	apparentTemperature: number;
	maxTemperature: number;
	minTemperature: number;
	weatherCode: number;
	isDay: number;
}

export default function CurrentSummary({
	currentTemperature,
	apparentTemperature,
	maxTemperature,
	minTemperature,
	weatherCode,
	isDay,
}: CurrentSummaryProps) {
	const { invertColors } = useInvertColors();
	const WeatherIcon = getWeatherIcon(weatherCode, isDay);
	return (
		<View style={styles.container}>
			<View style={styles.topHalf}>
				<WeatherIcon
					width={100}
					height={100}
					fill={invertColors ? "black" : "white"}
				/>
				<StyledText style={styles.currentTemperature}>
					{formatNumber(currentTemperature, 0)}°
				</StyledText>
			</View>
			<View style={styles.bottomHalf}>
				<StyledText style={styles.apparentTemperature}>
					Feels like {formatNumber(apparentTemperature, 0)}°, L:
					{formatNumber(minTemperature, 0)}° H:{formatNumber(maxTemperature, 0)}
					°
				</StyledText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	topHalf: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 4,
	},
	bottomHalf: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	currentTemperature: {
		fontSize: scaledFontSize(88),
		lineHeight: 86,
	},
	apparentTemperature: {
		fontSize: scaledFontSize(20),
	},
	rangeTemperature: {
		fontSize: scaledFontSize(20),
	},
});
