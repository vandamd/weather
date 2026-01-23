import React from "react";
import { OptionsSelector } from "@/components/OptionsSelector";
import { useDisplayMode, DisplayMode } from "@/contexts/DisplayModeContext";

const OPTIONS = [
    { label: "Standard", value: "standard" },
    { label: "Compact", value: "compact" },
    { label: "Comfortable", value: "comfortable" },
];

export default function DisplayModeScreen() {
    const { displayMode, setDisplayMode } = useDisplayMode();

    return (
        <OptionsSelector
            title="Display Mode"
            options={OPTIONS}
            selectedValue={displayMode}
            onSelect={(value) => setDisplayMode(value as DisplayMode)}
        />
    );
}
