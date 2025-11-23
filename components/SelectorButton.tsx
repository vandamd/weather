import React from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { router } from "expo-router";
import { scaledFontSize } from "@/utils/fontScaling";

interface SelectorButtonProps {
	label: string;
	value: string;
	valueChangePage: string;
}

export function SelectorButton({
	label,
	value,
	valueChangePage,
}: SelectorButtonProps) {
	return (
		<HapticPressable
			style={styles.button}
			onPress={() => {
				router.push(valueChangePage as any);
			}}
		>
			<StyledText style={styles.label} numberOfLines={1}>
				{label}
			</StyledText>
			<StyledText style={styles.buttonText}>{value}</StyledText>
		</HapticPressable>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		gap: 0,
	},
	label: {
		fontSize: scaledFontSize(20),
		paddingTop: 7.5,
		lineHeight: 20,
		fontFamily: "PublicSans-Regular",
	},
	buttonText: {
		fontSize: scaledFontSize(30),
		paddingBottom: 10,
	},
});
