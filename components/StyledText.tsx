import React from "react";
import { Text as DefaultText, TextProps, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";

interface StyledTextProps extends TextProps {
	children: React.ReactNode;
}

export function StyledText({ style, ...rest }: StyledTextProps) {
	const { invertColors } = useInvertColors();
	return (
		<DefaultText
			style={[
				styles.text,
				style,
				{ color: invertColors ? "black" : "white" },
			]}
			allowFontScaling={false}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	text: {
		fontFamily: "PublicSans-Regular",
	},
});
