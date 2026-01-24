import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledButton } from "@/components/StyledButton";
import { SelectorButton } from "@/components/SelectorButton";
import { useDetails, MAX_DETAILS } from "@/contexts/DetailsContext";
import { n } from "@/utils/scaling";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function DetailsScreen() {
    const { selectedDetails } = useDetails();
    const router = useRouter();

    return (
        <ContentContainer
            headerTitle="Weather Details"
            hideBackButton={false}
            style={{ paddingBottom: n(20) }}
        >
            <CustomScrollView contentContainerStyle={styles.container}>
                <SelectorButton
                    label="Weather Details"
                    value={`${selectedDetails.length}/${MAX_DETAILS} Selected`}
                    valueChangePage="/settings/select-details"
                />
                <StyledButton
                    text="Reorder Details"
                    onPress={() => router.push("/settings/reorder-details")}
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
