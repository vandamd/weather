import React, { memo, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { StyledText } from "@/components/StyledText";
import { HapticPressable } from "@/components/HapticPressable";
import { n } from "@/utils/scaling";

interface ListItemProps {
    primaryText: string | ReactNode;
    secondaryText: string;
    onPress: () => void;
}

export const ListItem = memo(function ListItem({
    primaryText,
    secondaryText,
    onPress,
}: ListItemProps) {
    return (
        <HapticPressable onPress={onPress} style={styles.container}>
            <View style={styles.textContainer}>
                {typeof primaryText === "string" ? (
                    <StyledText style={styles.primaryText} numberOfLines={1}>
                        {primaryText}
                    </StyledText>
                ) : (
                    <View style={styles.primaryRow}>{primaryText}</View>
                )}
                <StyledText style={styles.secondaryText} numberOfLines={1}>
                    {secondaryText}
                </StyledText>
            </View>
        </HapticPressable>
    );
});

const styles = StyleSheet.create({
    container: {
        minHeight: n(50),
        paddingVertical: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        paddingRight: n(10),
    },
    primaryText: {
        fontSize: n(26),
    },
    primaryRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    secondaryText: {
        fontSize: n(16),
        lineHeight: n(18),
        paddingBottom: n(6),
    },
});
