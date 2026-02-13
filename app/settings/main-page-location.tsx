import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledButton } from "@/components/StyledButton";
import { StyledText } from "@/components/StyledText";
import { useMainLocation } from "@/contexts/MainLocationContext";
import { SavedLocation, getSavedLocations } from "@/utils/savedLocations";
import { formatLocationName } from "@/utils/formatting";
import { n } from "@/utils/scaling";

function isSameLocation(
	locationA: SavedLocation | null,
	locationB: SavedLocation
) {
	if (!locationA) {
		return false;
	}

	return (
		locationA.id === locationB.id &&
		locationA.latitude === locationB.latitude &&
		locationA.longitude === locationB.longitude
	);
}

export default function MainPageLocationScreen() {
	const { mainLocation, setMainLocation } = useMainLocation();
	const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
	const [isLoadingSavedLocations, setIsLoadingSavedLocations] = useState(true);

	useFocusEffect(
		useCallback(() => {
			let isMounted = true;

			const loadSavedLocations = async () => {
				setIsLoadingSavedLocations(true);
				const locations = await getSavedLocations();
				if (!isMounted) {
					return;
				}
				setSavedLocations(locations);
				setIsLoadingSavedLocations(false);
			};

			loadSavedLocations();

			return () => {
				isMounted = false;
			};
		}, [])
	);

	const handleSelectCurrentLocation = async () => {
		await setMainLocation(null);
		router.back();
	};

	const handleSelectSavedLocation = async (location: SavedLocation) => {
		await setMainLocation(location);
		router.back();
	};

	return (
		<ContentContainer
			headerTitle="Main Page Location"
			hideBackButton={false}
			style={{ paddingBottom: n(20) }}
		>
			<CustomScrollView contentContainerStyle={styles.content}>
				{!isLoadingSavedLocations && savedLocations.length === 0 && (
					<View style={styles.emptyState}>
						<StyledText style={styles.emptyStateText}>
							Save a location from Search to use it on the main page.
						</StyledText>
					</View>
				)}
				<StyledButton
					text="Current Location"
					onPress={handleSelectCurrentLocation}
					underline={!mainLocation}
				/>
				{savedLocations.map((location) => (
					<StyledButton
						key={`${location.id}-${location.latitude}-${location.longitude}`}
						text={formatLocationName(location)}
						onPress={() => handleSelectSavedLocation(location)}
						underline={isSameLocation(mainLocation, location)}
					/>
				))}
			</CustomScrollView>
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: n(47),
	},
	emptyState: {
		paddingTop: n(8),
	},
	emptyStateText: {
		fontSize: n(18),
	},
});
