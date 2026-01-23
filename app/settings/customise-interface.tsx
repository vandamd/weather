import React from "react";
import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";

export default function CustomiseTabsScreen() {
    const { invertColors, setInvertColors } = useInvertColors();

    return (
        <ContentContainer headerTitle="Customise Interface">
            <ToggleSwitch
                value={invertColors}
                label="Invert Colours"
                onValueChange={setInvertColors}
            />
        </ContentContainer>
    );
}
