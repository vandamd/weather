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
import { PermissionsAndroid, AppState, AppStateStatus } from "react-native";
import Geolocation from "react-native-geolocation-service";
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

		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: "Location Permission",
				message:
					"This app needs access to your location to show current weather.",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK",
			}
		);
		if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
			setErrorMsg("Permission to access location was denied");
			console.log("Location permission denied.");
			setDataLoaded(true);
			return;
		}

		const getCurrentPositionPromise =
			(): Promise<Geolocation.GeoPosition> => {
				return new Promise((resolve, reject) => {
					Geolocation.getCurrentPosition(
						(position) => resolve(position),
						(error) => reject(error),
						{
							enableHighAccuracy: true,
							timeout: 15000,
							maximumAge: 10000,
						}
					);
				});
			};

		try {
			const fetchedLocation = await getCurrentPositionPromise();

			// Set a generic location name as reverse geocoding is removed
			setCurrentLocation("Current Location");

			const data = await getWeatherData(
				fetchedLocation.coords.latitude,
				fetchedLocation.coords.longitude,
				units.temperatureUnit,
				units.windSpeedUnit,
				units.precipitationUnit
			);
			setWeatherData(data);
			setErrorMsg(null); // Clear any previous errors

			// Cache the fetched data
			if (data) {
				const timestamp = Date.now();
				await setCachedWeather(
					fetchedLocation.coords.latitude,
					fetchedLocation.coords.longitude,
					data
				);
				setLastUpdated(timestamp);
			}
		} catch (error: any) {
			if (error.code && error.message) {
				setErrorMsg(`Error (code ${error.code}): ${error.message}`);
				console.error("Geolocation error:", error.code, error.message);
			} else {
				setErrorMsg("Error fetching location or weather");
				console.error("Error in focus effect:", error);
			}
		} finally {
			setDataLoaded(true);
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
