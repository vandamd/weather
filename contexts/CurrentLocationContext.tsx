import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { getWeatherData, WeatherData } from "@/utils/weather";
import { useUnits } from "./UnitsContext";
import {
	getCachedWeather,
	setCachedWeather,
} from "@/utils/weatherCache";

interface CurrentLocationContextType {
	currentLocation: string;
	weatherData: WeatherData | null;
	errorMsg: string | null;
	dataLoaded: boolean;
	lastUpdated: number | null;
	refetchWeather: () => Promise<void>;
}

const CurrentLocationContext = createContext<CurrentLocationContextType>({
	currentLocation: "",
	weatherData: null,
	errorMsg: null,
	dataLoaded: false,
	lastUpdated: null,
	refetchWeather: async () => {},
});

export const useCurrentLocation = () => useContext(CurrentLocationContext);

export const CurrentLocationProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const units = useUnits();
	const [currentLocation, setCurrentLocation] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<number | null>(null);
	const appState = useRef(AppState.currentState);
	const isFetchingRef = useRef(false);

	// Load cached data immediately on mount
	useEffect(() => {
		const loadCache = async () => {
			const cached = await getCachedWeather();
			if (cached) {
				setWeatherData(cached.data);
				setLastUpdated(cached.timestamp);
				setCurrentLocation("Current Location");
				setDataLoaded(true);
			}
		};

		loadCache();
	}, []);

	const fetchLocationAndWeather = useCallback(async () => {
		if (!units.unitsLoaded) {
			return;
		}

		// Prevent concurrent fetches
		if (isFetchingRef.current) {
			return;
		}
		isFetchingRef.current = true;

		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				console.log("Location permission denied.");
				setDataLoaded(true);
				return;
			}

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
			});

			// Set a generic location name
			setCurrentLocation("Current Location");

			const data = await getWeatherData(
				location.coords.latitude,
				location.coords.longitude,
				units.temperatureUnit,
				units.windSpeedUnit,
				units.precipitationUnit
			);
			setWeatherData(data);
			setErrorMsg(null);

			// Cache the fetched data
			if (data) {
				const timestamp = Date.now();
				await setCachedWeather(
					location.coords.latitude,
					location.coords.longitude,
					data
				);
				setLastUpdated(timestamp);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMsg(`Error: ${error.message}`);
				console.error("Location error:", error.message);
			} else {
				setErrorMsg("Error fetching location or weather");
				console.error("Error in fetch:", error);
			}
		} finally {
			setDataLoaded(true);
			isFetchingRef.current = false;
		}
	}, [
		units.temperatureUnit,
		units.windSpeedUnit,
		units.precipitationUnit,
		units.unitsLoaded,
	]);

	// Initial fetch when units are loaded
	useEffect(() => {
		if (units.unitsLoaded && !dataLoaded) {
			fetchLocationAndWeather();
		}
	}, [units.unitsLoaded, dataLoaded, fetchLocationAndWeather]);

	// Refetch when app comes to foreground
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState: AppStateStatus) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					fetchLocationAndWeather();
				}

				appState.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [fetchLocationAndWeather]);

	const value = useMemo(
		() => ({
			currentLocation,
			weatherData,
			errorMsg,
			dataLoaded,
			lastUpdated,
			refetchWeather: fetchLocationAndWeather,
		}),
		[currentLocation, weatherData, errorMsg, dataLoaded, lastUpdated, fetchLocationAndWeather]
	);

	return (
		<CurrentLocationContext.Provider value={value}>
			{children}
		</CurrentLocationContext.Provider>
	);
};
