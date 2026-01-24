import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";

interface HeaderProps {
    headerTitle?: string;
    hideBackButton?: boolean;
    onBackPress?: () => void;
    leftIcon?: keyof typeof MaterialIcons.glyphMap;
    onLeftIconPress?: () => void;
    rightIcon?: keyof typeof MaterialIcons.glyphMap;
    onRightIconPress?: () => void;
    showRightIcon?: boolean;
    rightText?: string;
    onTitlePress?: () => void;
}

export function Header({
    headerTitle,
    hideBackButton = false,
    onBackPress,
    leftIcon,
    onLeftIconPress,
    rightIcon,
    onRightIconPress,
    showRightIcon = true,
    rightText,
    onTitlePress,
}: HeaderProps) {
    const { invertColors } = useInvertColors();
    const iconColor = invertColors ? "black" : "white";

    const handleBack = onBackPress ?? (() => {
        if (router.canGoBack()) {
            router.back();
        }
    });

    const renderLeftButton = () => {
        if (!hideBackButton) {
            return (
                <HapticPressable onPress={handleBack}>
                    <View style={styles.button}>
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={n(28)}
                            color={iconColor}
                        />
                    </View>
                </HapticPressable>
            );
        }
        if (leftIcon) {
            return (
                <HapticPressable onPress={onLeftIconPress}>
                    <View style={styles.button}>
                        <MaterialIcons
                            name={leftIcon}
                            size={n(28)}
                            color={iconColor}
                        />
                    </View>
                </HapticPressable>
            );
        }
        return <View style={styles.button} />;
    };

	const renderRightButton = () => {
		if (rightText) {
			return (
				<View style={styles.rightTextContainer}>
					<StyledText style={styles.rightText}>{rightText}</StyledText>
				</View>
			);
		}
		if (rightIcon && showRightIcon) {
			return (
				<HapticPressable onPress={onRightIconPress}>
					<View style={styles.button}>
                        <MaterialIcons
                            name={rightIcon}
                            size={n(28)}
                            color={iconColor}
                        />
                    </View>
                </HapticPressable>
            );
		}
		return <View style={styles.button} />;
	};

	const hasLeftButton = !hideBackButton || Boolean(leftIcon);
	const hasRightButton = Boolean(rightText) || Boolean(rightIcon && showRightIcon);

	return (
		<View
			style={[
				styles.header,
                { backgroundColor: invertColors ? "white" : "black" },
            ]}
		>
			{renderLeftButton()}
			<View style={styles.titleContainer}>
				{onTitlePress ? (
					<HapticPressable onPress={onTitlePress}>
						<StyledText
							style={[
								styles.title,
								!hasLeftButton && !hasRightButton && styles.titleWide,
							]}
							numberOfLines={1}
						>
							{headerTitle}
						</StyledText>
					</HapticPressable>
				) : (
					<StyledText
						style={[
							styles.title,
							!hasLeftButton && !hasRightButton && styles.titleWide,
						]}
						numberOfLines={1}
					>
						{headerTitle}
					</StyledText>
				)}
			</View>
			{renderRightButton()}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: n(22),
        paddingVertical: n(5),
        zIndex: 1,
    },
	title: {
		fontSize: n(20),
		fontFamily: "PublicSans-Regular",
		paddingTop: n(2),
		maxWidth: "75%",
	},
	titleWide: {
		maxWidth: "100%",
	},
    titleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: n(32),
        height: n(32),
        alignItems: "center",
        paddingTop: n(6),
        paddingRight: n(4),
    },
    rightTextContainer: {
        minWidth: n(32),
        height: n(32),
        alignItems: "flex-end",
        justifyContent: "center",
    },
    rightText: {
        fontSize: n(18),
    },
});
