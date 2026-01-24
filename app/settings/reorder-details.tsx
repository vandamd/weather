import React from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledButton } from "@/components/StyledButton";
import { useDetails, WeatherDetail } from "@/contexts/DetailsContext";
import { n } from "@/utils/scaling";

const DETAIL_SHORTHANDS: Record<WeatherDetail, string> = {
    "Temp": "T",
    "Feels Like": "FL",
    "Precip Chance": "P",
    "Precip Amount": "P",
    "Wind Speed": "W",
    "Wind Gusts": "G",
    "UV Index": "UV",
    "Humidity": "H",
    "Dew Point": "DP",
    "Cloud Cover": "C",
    "Visibility": "V",
    "Pressure": "P",
};

export default function ReorderDetailsScreen() {
    const { selectedDetails, reorderDetail } = useDetails();

    return (
        <ContentContainer headerTitle="Reorder Details" style={styles.container}>
            <CustomScrollView contentContainerStyle={styles.listContent}>
                {selectedDetails.map((detail, index) => (
                    <StyledButton
                        key={detail}
                        text={`${detail} (${DETAIL_SHORTHANDS[detail]})`}
                        onMoveUp={() => reorderDetail(detail, "up")}
                        onMoveDown={() => reorderDetail(detail, "down")}
                        isFirst={index === 0}
                        isLast={index === selectedDetails.length - 1}
                    />
                ))}
            </CustomScrollView>
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: n(20),
    },
    listContent: {
        gap: n(20),
    },
});
