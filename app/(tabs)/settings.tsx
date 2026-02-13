import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { StyledButton } from "@/components/StyledButton";
import { SelectorButton } from "@/components/SelectorButton";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useShowIcons } from "@/contexts/ShowIconsContext";
import { useMainLocation } from "@/contexts/MainLocationContext";
import { formatLocationName } from "@/utils/formatting";
import { n } from "@/utils/scaling";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
    const { invertColors, setInvertColors } = useInvertColors();
    const { showIcons, setShowIcons } = useShowIcons();
    const { mainLocation } = useMainLocation();
    const router = useRouter();
    const version = Application.nativeApplicationVersion;
    const mainLocationLabel = mainLocation
        ? formatLocationName(mainLocation)
        : "Current Location";

    return (
        <ContentContainer
            headerTitle={`Settings (v${version})`}
            hideBackButton={true}
            style={{ paddingBottom: n(20) }}
        >
            <CustomScrollView contentContainerStyle={styles.content}>
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
                <SelectorButton
                    label="Main Page Location"
                    value={mainLocationLabel}
                    valueChangePage="/settings/main-page-location"
                    valueNumberOfLines={1}
                />
                <StyledButton
                    text="Weather Details"
                    onPress={() => router.push("/settings/details")}
                />
                <StyledButton
                    text="Units"
                    onPress={() => router.push("/settings/units")}
                />
            </CustomScrollView>
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: n(47),
    },
});
