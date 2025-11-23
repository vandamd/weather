import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { scaledFontSize } from "@/utils/fontScaling";

interface HeaderProps {
	iconName?: keyof typeof MaterialIcons.glyphMap;
	onIconPress?: () => void;
	iconShowLength?: number;
	headerTitle?: string;
	backEvent?: () => void;
	hideBackButton?: boolean;
}

export function Header({
	iconName,
	onIconPress,
	iconShowLength = 1,
	headerTitle,
	backEvent,
	hideBackButton = false,
}: HeaderProps) {
	const { invertColors } = useInvertColors();
	const handleBack = backEvent
		? backEvent
		: () => {
				if (router.canGoBack()) {
					router.back();
				}
		  };

	return (
		<View
			style={[
				styles.header,
				{ backgroundColor: invertColors ? "white" : "black" },
			]}
		>
			{!hideBackButton ? (
				<HapticPressable onPress={handleBack}>
					<View
						style={{
							width: 32,
							height: 32,
							alignItems: "center",
							paddingTop: 6,
							paddingRight: 4,
						}}
					>
						<MaterialIcons
							name="arrow-back-ios"
							size={28}
							color={invertColors ? "black" : "white"}
						/>
					</View>
				</HapticPressable>
			) : (
				<View
					style={{
						width: 32,
						height: 32,
						alignItems: "center",
						paddingTop: 6,
						paddingRight: 4,
					}}
				></View>
			)}

			<StyledText style={[styles.title]} numberOfLines={1}>
				{headerTitle}
			</StyledText>
			{iconShowLength > 0 && iconName ? (
				<HapticPressable onPress={onIconPress}>
					<View
						style={{
							width: 32,
							height: 32,
							alignItems: "center",
							paddingTop: 6,
							paddingLeft: 4,
						}}
					>
						<MaterialIcons
							name={iconName}
							size={28}
							color={invertColors ? "black" : "white"}
						/>
					</View>
				</HapticPressable>
			) : (
				<View
					style={{
						width: 32,
						height: 32,
						alignItems: "center",
						paddingTop: 6,
						paddingLeft: 4,
					}}
				></View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 22,
		paddingVertical: 5,
		zIndex: 1,
	},
	title: {
		fontSize: scaledFontSize(20),
		fontFamily: "PublicSans-Regular",
		paddingTop: 2,
		maxWidth: "75%",
	},
});
