import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledButton } from "@/components/StyledButton";
import { useDetails, WEATHER_DETAILS, MAX_DETAILS, DETAIL_SHORTHANDS } from "@/contexts/DetailsContext";
import { n } from "@/utils/scaling";
import { StyleSheet, View } from "react-native";

export default function SelectDetailsScreen() {
    const { selectedDetails, isDetailSelected, toggleDetail } = useDetails();

    return (
        <ContentContainer
            headerTitle="Weather Details"
            hideBackButton={false}
            rightText={`${selectedDetails.length}/${MAX_DETAILS}`}
            style={{ paddingBottom: n(20) }}
        >
            <CustomScrollView contentContainerStyle={styles.container}>
                <View style={styles.detailsContainer}>
                    {WEATHER_DETAILS.map((detail) => (
                        <StyledButton
                            key={detail}
                            text={`${detail} (${DETAIL_SHORTHANDS[detail]})`}
                            onPress={() => toggleDetail(detail)}
                            underline={isDetailSelected(detail)}
                        />
                    ))}
                </View>
            </CustomScrollView>
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: n(30),
    },
    detailsContainer: {
        gap: n(47),
    },
});
