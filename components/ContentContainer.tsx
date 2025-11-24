import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Header } from "@/components/Header";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { MaterialIcons } from "@expo/vector-icons";
import { normalizedSize } from "@/utils/fontScaling";

interface ContentContainerProps {
	headerTitle?: string;
	children?: ReactNode;
	hideBackButton?: boolean;
	headerIcon?: keyof typeof MaterialIcons.glyphMap;
	headerIconPress?: () => void;
	headerIconShowLength?: number;
	style?: StyleProp<ViewStyle>;
}

export default function ContentContainer({
	headerTitle,
	children,
	hideBackButton = false,
	headerIcon,
	headerIconPress,
	headerIconShowLength = 1,
	style,
}: ContentContainerProps) {
	const { invertColors } = useInvertColors();
	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: invertColors ? "white" : "black" },
			]}
		>
			{headerTitle && (
				<Header
					headerTitle={headerTitle}
					hideBackButton={hideBackButton}
					iconName={headerIcon}
					onIconPress={headerIconPress}
					iconShowLength={headerIconShowLength}
				/>
			)}
			<View style={[styles.content, style]}>{children ?? null}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingHorizontal: normalizedSize(37),
		paddingTop: normalizedSize(14),
		gap: normalizedSize(47),
	},
});
