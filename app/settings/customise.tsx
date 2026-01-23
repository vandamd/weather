import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { SelectorButton } from "@/components/SelectorButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useDisplayMode } from "@/contexts/DisplayModeContext";

const DISPLAY_MODE_LABELS: Record<string, string> = {
    standard: "Standard",
    compact: "Compact",
    comfortable: "Comfortable",
};

export default function CustomiseScreen() {
    const { displayMode } = useDisplayMode();

    return (
        <ContentContainer headerTitle="Customise">
            <StyledButton
                text="Interface"
                onPress={() => router.push("/settings/customise-interface" as any)}
            />
            <SelectorButton
                label="Display Mode"
                value={DISPLAY_MODE_LABELS[displayMode]}
                href="/settings/display-mode"
            />
        </ContentContainer>
    );
}
