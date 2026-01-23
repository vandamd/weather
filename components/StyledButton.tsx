import React from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { n } from "@/utils/scaling";

interface ButtonProps {
    text: string;
    onPress?: () => void;
    underline?: boolean;
    fontSize?: number;
}

export function StyledButton({ text, onPress, underline = false, fontSize }: ButtonProps) {
    return (
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
    );
}

const styles = StyleSheet.create({
    button: {
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
});
