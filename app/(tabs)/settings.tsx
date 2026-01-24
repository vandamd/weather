import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { StyledButton } from "@/components/StyledButton";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useShowIcons } from "@/contexts/ShowIconsContext";
import * as Application from "expo-application";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const { invertColors, setInvertColors } = useInvertColors();
    const { showIcons, setShowIcons } = useShowIcons();
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
            <ToggleSwitch
                value={showIcons}
                label="Show Weather Icons"
                onValueChange={setShowIcons}
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
