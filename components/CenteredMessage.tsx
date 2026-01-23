import React from "react";
import { View, StyleSheet } from "react-native";
import { StyledText } from "@/components/StyledText";
import { n } from "@/utils/scaling";

interface CenteredMessageProps {
    message: string;
    hint?: string;
}

export function CenteredMessage({ message, hint }: CenteredMessageProps) {
    return (
        <View style={styles.container}>
            <StyledText style={styles.message}>{message}</StyledText>
            {hint && <StyledText style={styles.hint}>{hint}</StyledText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: n(8),
    },
    message: {
        fontSize: n(18),
        textAlign: "center",
    },
    hint: {
        fontSize: n(14),
        textAlign: "center",
    },
});
