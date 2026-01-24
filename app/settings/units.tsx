import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { SelectorButton } from "@/components/SelectorButton";
import { useUnits } from "@/contexts/UnitsContext";
import { useTimeFormat } from "@/contexts/TimeFormatContext";
import { n } from "@/utils/scaling";
import { StyleSheet } from "react-native";

export default function UnitsScreen() {
    const { temperatureUnit, windSpeedUnit, precipitationUnit } = useUnits();
    const { timeFormat } = useTimeFormat();

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
                <SelectorButton
                    label="Time Format"
                    value={timeFormat === "24h" ? "24 Hour" : "12 Hour"}
                    valueChangePage="/settings/time-format"
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
