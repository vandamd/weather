import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SavedLocation {
	id: number; // Keep using the ID from GeocodingResult for uniqueness
	name: string;
	admin1?: string;
	country: string;
	latitude: number;
	longitude: number;
}

const SAVED_LOCATIONS_KEY = "saved_locations";

// Fetch all saved locations
export const getSavedLocations = async (): Promise<SavedLocation[]> => {
	try {
		const jsonValue = await AsyncStorage.getItem(SAVED_LOCATIONS_KEY);
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.error("Failed to fetch saved locations", e);
		return [];
	}
};

// Save a new location
export const saveLocation = async (
	location: SavedLocation
): Promise<boolean> => {
	try {
		const currentLocations = await getSavedLocations();
		// Prevent duplicates by checking ID
		if (currentLocations.find((l) => l.id === location.id)) {
			return false;
		}
		const newLocations = [...currentLocations, location];
		await AsyncStorage.setItem(
			SAVED_LOCATIONS_KEY,
			JSON.stringify(newLocations)
		);
		return true;
	} catch (e) {
		console.error("Failed to save location", e);
		return false;
	}
};

// Remove a location
export const removeLocation = async (locationId: number): Promise<boolean> => {
	try {
		const currentLocations = await getSavedLocations();
		const newLocations = currentLocations.filter(
			(loc) => loc.id !== locationId
		);
		await AsyncStorage.setItem(
			SAVED_LOCATIONS_KEY,
			JSON.stringify(newLocations)
		);
		return true;
	} catch (e) {
		console.error("Failed to remove location", e);
		return false;
	}
};

// Check if a location is saved
export const isLocationSaved = async (locationId: number): Promise<boolean> => {
	try {
		const currentLocations = await getSavedLocations();
		return currentLocations.some((loc) => loc.id === locationId);
	} catch (e) {
		console.error("Failed to check if location is saved", e);
		return false;
	}
};
