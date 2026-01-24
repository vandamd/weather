import React from "react";
import { StyleSheet } from "react-native";
import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledButton } from "@/components/StyledButton";
import { useDetails, DETAIL_SHORTHANDS } from "@/contexts/DetailsContext";
import { n } from "@/utils/scaling";

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
