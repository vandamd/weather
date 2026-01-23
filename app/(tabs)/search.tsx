import { useState } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { n } from "@/utils/scaling";

export default function SearchScreen() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.length > 0) {
            router.push({
                pathname: "/search-results",
                params: { query },
            });
        }
    };

    return (
        <ContentContainer
            headerTitle="Search"
            hideBackButton
            rightIcon="search"
            showRightIcon={query.length > 0}
            onRightIconPress={handleSearch}
            style={styles.container}
        >
            <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search..."
                onSubmit={handleSearch}
                autoFocus
            />
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: n(32),
        paddingBottom: n(20),
    },
});
