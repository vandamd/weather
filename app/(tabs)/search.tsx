import { useState, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/SearchInput";
import { StyledButton } from "@/components/StyledButton";
import CustomScrollView from "@/components/CustomScrollView";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { SavedLocation, getSavedLocations } from "@/utils/savedLocations";
import { n } from "@/utils/scaling";
import { formatLocationName } from "@/utils/formatting";

export default function SearchScreen() {
	const [query, setQuery] = useState("");
	const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
	const { invertColors } = useInvertColors();

	useFocusEffect(
		useCallback(() => {
			const loadSavedLocations = async () => {
				const locations = await getSavedLocations();
				setSavedLocations(locations);
			};
			loadSavedLocations();
		}, [])
	);

	const handleSearch = () => {
		if (query.length > 0) {
			router.push({
				pathname: "/search/results",
				params: { query },
			});
		}
	};

	const handlePressSavedLocation = (location: SavedLocation) => {
		router.push({
			pathname: "/search/weather",
			params: {
				latitude: location.latitude.toString(),
				longitude: location.longitude.toString(),
				name: location.name,
				admin1: location.admin1 ?? "",
				country: location.country,
				id: location.id.toString(),
			},
		});
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
				placeholder="Search for a location"
				onSubmit={handleSearch}
			/>
			{savedLocations.length > 0 && (
				<View style={styles.savedLocationsContainer}>
					<Text
						style={[
							styles.savedLocationsTitle,
							{ color: invertColors ? "black" : "white" },
						]}
						allowFontScaling={false}
					>
						Saved Locations
					</Text>
					<CustomScrollView>
						{savedLocations.map((location) => (
							<View
								key={location.id}
								style={{ marginBottom: n(15) }}
							>
								<StyledButton
									text={formatLocationName(location)}
									onPress={() =>
										handlePressSavedLocation(location)
									}
									fontSize={28}
								/>
							</View>
						))}
					</CustomScrollView>
				</View>
			)}
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: n(32),
		paddingBottom: n(20),
	},
	savedLocationsContainer: {
		flex: 1,
	},
	savedLocationsTitle: {
		fontSize: n(20),
		fontFamily: "PublicSans-Regular",
		marginBottom: n(4),
	},
});
