import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { SelectorButton } from "@/components/SelectorButton";
import { useUnits } from "@/contexts/UnitsContext";
import { n } from "@/utils/scaling";
import { StyleSheet } from "react-native";

export default function UnitsScreen() {
    const { temperatureUnit, windSpeedUnit, precipitationUnit } = useUnits();

    return (
        <ContentContainer
            headerTitle="Units"
            hideBackButton={false}
            style={{ paddingBottom: n(20) }}
        >
            <CustomScrollView contentContainerStyle={styles.container}>
                <SelectorButton
                    label="Temperature"
                    value={temperatureUnit}
                    valueChangePage="/settings/temperature-unit"
                />
                <SelectorButton
                    label="Wind Speed"
                    value={windSpeedUnit}
                    valueChangePage="/settings/wind-speed-unit"
                />
                <SelectorButton
                    label="Precipitation"
                    value={precipitationUnit}
                    valueChangePage="/settings/precipitation-unit"
                />
            </CustomScrollView>
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: n(20),
    },
});
