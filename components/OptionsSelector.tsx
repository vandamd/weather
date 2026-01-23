import React from "react";
import { router } from "expo-router";
import { StyledButton } from "./StyledButton";
import ContentContainer from "./ContentContainer";

interface Option {
    label: string;
    value: string;
}

interface OptionsSelectorProps {
    title: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    autoBack?: boolean;
}

export function OptionsSelector({
    title,
    options,
    selectedValue,
    onSelect,
    autoBack = true,
}: OptionsSelectorProps) {
    const handleSelect = (value: string) => {
        onSelect(value);
        if (autoBack) router.back();
    };

    return (
        <ContentContainer headerTitle={title}>
            {options.map((option) => (
                <StyledButton
                    key={option.value}
                    text={option.label}
                    onPress={() => handleSelect(option.value)}
                    underline={selectedValue === option.value}
                />
            ))}
        </ContentContainer>
    );
}
