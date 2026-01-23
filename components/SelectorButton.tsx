import React from "react";
import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { router } from "expo-router";
import { n } from "@/utils/scaling";

interface SelectorButtonProps {
    label: string;
    value: string;
    valueChangePage?: string;
}

export function SelectorButton({ label, value, valueChangePage }: SelectorButtonProps) {
    const targetPath = valueChangePage;
    return (
        <HapticPressable
            style={styles.button}
            onPress={() => targetPath && router.push(targetPath as any)}
        >
            <StyledText style={styles.label} numberOfLines={1}>
                {label}
            </StyledText>
            <StyledText style={styles.value}>{value}</StyledText>
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
        fontSize: n(20),
        paddingTop: n(7.5),
        lineHeight: n(20),
    },
    value: {
        fontSize: n(30),
        paddingBottom: n(10),
    },
});
