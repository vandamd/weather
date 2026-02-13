import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
	ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedLocation } from "@/utils/savedLocations";

const MAIN_LOCATION_KEY = "main_page_location";

interface MainLocationContextType {
	mainLocation: SavedLocation | null;
	mainLocationLoaded: boolean;
	setMainLocation: (location: SavedLocation | null) => Promise<void>;
}

const MainLocationContext = createContext<MainLocationContextType>({
	mainLocation: null,
	mainLocationLoaded: false,
	setMainLocation: async () => {},
});

export const useMainLocation = () => useContext(MainLocationContext);

export const MainLocationProvider = ({ children }: { children: ReactNode }) => {
	const [mainLocation, setMainLocationState] = useState<SavedLocation | null>(
		null
	);
	const [mainLocationLoaded, setMainLocationLoaded] = useState(false);

	useEffect(() => {
		const loadMainLocation = async () => {
			try {
				const saved = await AsyncStorage.getItem(MAIN_LOCATION_KEY);
				if (saved) {
					setMainLocationState(JSON.parse(saved) as SavedLocation);
				}
			} catch (error) {
				console.error("Failed to load main page location", error);
				setMainLocationState(null);
			} finally {
				setMainLocationLoaded(true);
			}
		};

		loadMainLocation();
	}, []);

	const setMainLocation = useCallback(async (location: SavedLocation | null) => {
		setMainLocationState(location);

		try {
			if (location) {
				await AsyncStorage.setItem(MAIN_LOCATION_KEY, JSON.stringify(location));
			} else {
				await AsyncStorage.removeItem(MAIN_LOCATION_KEY);
			}
		} catch (error) {
			console.error("Failed to persist main page location", error);
		}
	}, []);

	const value = useMemo(
		() => ({
			mainLocation,
			mainLocationLoaded,
			setMainLocation,
		}),
		[mainLocation, mainLocationLoaded, setMainLocation]
	);

	return (
		<MainLocationContext.Provider value={value}>
			{children}
		</MainLocationContext.Provider>
	);
};
