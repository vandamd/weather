import React from "react";
import {
	Text as DefaultText,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { HapticPressable } from "./HapticPressable";
import { useState } from "react";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { scaledFontSize } from "@/utils/fontScaling";

const weatherVariables = [
	"Temp",
	"Feels Like",
	"Precip Chance",
	"Precip Amount",
	"Wind Speed",
	"Wind Gusts",
	"UV Index",
	"Humidity",
	"Dew Point",
	"Cloud Cover",
	"Visibility",
	"Pressure",
];

interface WeatherVariableSelectorProps {
	onSelectionChange: (variable: string) => void;
}

interface VariablePillProps {
	variable: string;
	isSelected: boolean;
	invertColors: boolean;
	onPress: () => void;
}

const VariablePill = React.memo(function VariablePill({
	variable,
	isSelected,
	invertColors,
	onPress,
}: VariablePillProps) {
	return (
		<HapticPressable onPress={onPress}>
			<View
				style={[
					styles.pill,
					{
						borderColor: invertColors ? "black" : "white",
						backgroundColor: invertColors ? "white" : "black",
					},
					isSelected && {
						backgroundColor: invertColors ? "black" : "white",
					},
				]}
			>
				<DefaultText
					style={[
						styles.text,
						{ color: invertColors ? "black" : "white" },
						isSelected && {
							color: invertColors ? "white" : "black",
						},
					]}
					allowFontScaling={false}
				>
					{variable}
				</DefaultText>
			</View>
		</HapticPressable>
	);
});

export default function WeatherVariableSelector({
	onSelectionChange,
}: WeatherVariableSelectorProps) {
	const { invertColors } = useInvertColors();

	const [selectedVariable, setSelectedVariable] = useState<string>(
		weatherVariables[0]
	);
	const handlePress = (variable: string) => {
		setSelectedVariable(variable);
		onSelectionChange(variable);
	};

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			overScrollMode="never"
			style={{ paddingTop: 32, paddingBottom: 1 }}
		>
			{weatherVariables.map((variable) => (
				<VariablePill
					key={variable}
					variable={variable}
					isSelected={selectedVariable === variable}
					invertColors={invertColors}
					onPress={() => handlePress(variable)}
				/>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	text: {
		fontFamily: "PublicSans-Regular",
		fontSize: scaledFontSize(16),
	},
	pill: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 20,
		borderWidth: 1,
		marginRight: 6,
	},
});
