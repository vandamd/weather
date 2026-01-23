import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StyledButton } from "@/components/StyledButton";
import ContentContainer from "@/components/ContentContainer";

export default function SettingsScreen() {
    const params = useLocalSearchParams<{ confirmed?: string; action?: string }>();

    useEffect(() => {
        if (params.confirmed === "true") {
            router.setParams({ confirmed: undefined, action: undefined });
            if (params.action === "exampleAction") {
                console.log("Example action confirmed!");
            }
        }
    }, [params.confirmed, params.action]);

    const handleConfirmExample = () => {
        router.push({
            pathname: "/confirm",
            params: {
                title: "Example Confirm",
                message: "This is an example confirmation screen.\n\nAre you sure you want to proceed?",
                confirmText: "Yes",
                action: "exampleAction",
                returnPath: "/(tabs)/settings",
            },
        });
    };

    return (
        <ContentContainer headerTitle="Settings" hideBackButton>
            <StyledButton text="Customise" onPress={() => router.push("/settings/customise" as any)} />
            <StyledButton text="Example Confirm" onPress={handleConfirmExample} />
        </ContentContainer>
    );
}
