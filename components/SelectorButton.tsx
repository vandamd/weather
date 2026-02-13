import { StyleSheet } from "react-native";
import { StyledText } from "./StyledText";
import { HapticPressable } from "./HapticPressable";
import { router } from "expo-router";
import { n } from "@/utils/scaling";

interface SelectorButtonProps {
    label: string;
    value: string;
    valueChangePage?: string;
    valueNumberOfLines?: number;
}

export function SelectorButton({
    label,
    value,
    valueChangePage,
    valueNumberOfLines,
}: SelectorButtonProps) {
    return (
        <HapticPressable
            style={styles.button}
            onPress={() => valueChangePage && router.push(valueChangePage as any)}
        >
            <StyledText style={styles.label} numberOfLines={1}>
                {label}
            </StyledText>
            <StyledText
                style={styles.value}
                numberOfLines={valueNumberOfLines}
                ellipsizeMode="tail"
            >
                {value}
            </StyledText>
        </HapticPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
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
        width: "100%",
        fontSize: n(30),
        paddingBottom: n(10),
    },
});
