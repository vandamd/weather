import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";

const buttons = [
    { id: "1", text: "Test Button 1" },
    { id: "2", text: "Test Button 2" },
    { id: "3", text: "Test Button 3" },
    { id: "4", text: "Test Button 4" },
    { id: "5", text: "Test Button 5" },
    { id: "6", text: "Test Button 6" },
    { id: "7", text: "Test Button 7" },
    { id: "8", text: "Test Button 8" },
    { id: "9", text: "Test Button 9" },
    { id: "10", text: "Test Button 10" },
];

export default function Tab() {
    return (
        <ContentContainer headerTitle="Liked Songs" hideBackButton style={{ paddingHorizontal: n(20) }}>
            <CustomScrollView
                data={buttons}
                renderItem={({ item }) => (
                    <StyledButton text={item.text} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: n(28) }}
            />
        </ContentContainer>
    );
}
