import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { useRouter } from "expo-router";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { scaledFontSize, normalizedSize } from "@/utils/fontScaling";

interface TabHeaderProps {
	leftIconName?: keyof typeof MaterialIcons.glyphMap;
	leftOnIconPress?: () => void;
	rightIconName?: keyof typeof MaterialIcons.glyphMap;
	rightOnIconPress?: () => void;
	iconShowLength?: number;
	headerTitle?: string;
	hideWaveformButton?: boolean;
	hidePlayingButton?: boolean;
}

export function TabHeader({
	leftIconName,
	leftOnIconPress,
	rightIconName,
	rightOnIconPress,
	headerTitle,
}: TabHeaderProps) {
	const router = useRouter();
	const { invertColors } = useInvertColors();

	return (
		<View
			style={[
				styles.header,
				{ backgroundColor: invertColors ? "white" : "black" },
			]}
		>
			{leftIconName ? (
				<HapticPressable onPress={leftOnIconPress}>
					<View
						style={{ width: normalizedSize(32), height: normalizedSize(32), alignItems: "center" }}
					>
						<MaterialIcons
							name={leftIconName}
							size={normalizedSize(32)}
							color={invertColors ? "black" : "white"}
						/>
					</View>
				</HapticPressable>
			) : (
				<View style={{ width: normalizedSize(32), height: normalizedSize(32) }} />
			)}
			<StyledText style={[styles.title]}>{headerTitle}</StyledText>
			{rightIconName ? (
				<HapticPressable onPress={rightOnIconPress}>
					<View
						style={{
							width: normalizedSize(32),
							height: normalizedSize(32),
							alignItems: "center",
						}}
					>
						<MaterialIcons
							name={rightIconName}
							size={normalizedSize(32)}
							color={invertColors ? "black" : "white"}
						/>
					</View>
				</HapticPressable>
			) : (
				<View style={{ width: normalizedSize(32), height: normalizedSize(32) }} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: normalizedSize(22),
		paddingVertical: normalizedSize(5),
		zIndex: 1,
	},
	title: {
		fontSize: scaledFontSize(20),
		fontFamily: "PublicSans-Regular",
	},
});
