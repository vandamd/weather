import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { n } from "@/utils/scaling";

interface ButtonProps {
    text: string;
    onPress?: () => void;
    underline?: boolean;
    fontSize?: number;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export function StyledButton({
    text,
    onPress,
    underline = false,
    fontSize,
    onMoveUp,
    onMoveDown,
    isFirst = false,
    isLast = false,
}: ButtonProps) {
    const { invertColors } = useInvertColors();
    const iconColor = invertColors ? "black" : "white";
    const disabledColor = invertColors ? "#C1C1C1" : "#6E6E6E";
    const hasReorder = onMoveUp !== undefined || onMoveDown !== undefined;

    return (
        <View style={styles.container}>
            <HapticPressable style={styles.button} onPress={onPress}>
                <StyledText
                    style={[
                        styles.buttonText,
                        underline && styles.underline,
                        fontSize ? { fontSize: n(fontSize) } : undefined
                    ]}
                    numberOfLines={1}
                >
                    {text}
                </StyledText>
            </HapticPressable>
            {hasReorder && (
                <View style={styles.arrowContainer}>
                    <HapticPressable
                        onPress={onMoveDown}
                        disabled={isLast}
                        style={styles.arrowButton}
                    >
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={n(32)}
                            color={isLast ? disabledColor : iconColor}
                        />
                    </HapticPressable>
                    <HapticPressable
                        onPress={onMoveUp}
                        disabled={isFirst}
                        style={styles.arrowButton}
                    >
                        <MaterialIcons
                            name="keyboard-arrow-up"
                            size={n(32)}
                            color={isFirst ? disabledColor : iconColor}
                        />
                    </HapticPressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    buttonText: {
        fontSize: n(30),
    },
    underline: {
        textDecorationLine: "underline",
    },
    arrowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: n(4),
    },
    arrowButton: {
        paddingHorizontal: n(4),
    },
});
