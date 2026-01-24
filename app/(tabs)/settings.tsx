import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { StyledButton } from "@/components/StyledButton";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import * as Application from "expo-application";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const { invertColors, setInvertColors } = useInvertColors();
    const router = useRouter();
    const version = Application.nativeApplicationVersion;

    return (
        <ContentContainer
            headerTitle={`Settings (v${version})`}
            hideBackButton={true}
        >
                <ToggleSwitch
                    value={invertColors}
                    label="Invert Colours"
                    onValueChange={setInvertColors}
                />
                <StyledButton
                    text="Weather Details"
                    onPress={() => router.push("/settings/details")}
                />
                <StyledButton
                    text="Units"
                    onPress={() => router.push("/settings/units")}
                />
        </ContentContainer>
    );
}
