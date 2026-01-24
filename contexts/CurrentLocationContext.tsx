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
import { getAirQualityData, AirQualityData } from "@/utils/airQuality";
import { useUnits } from "./UnitsContext";
import {
	getCachedWeather,
	setCachedWeather,
	isCacheValid,
} from "@/utils/weatherCache";
import {
	getCachedAirQuality,
	setCachedAirQuality,
} from "@/utils/airQualityCache";

interface CurrentLocationContextType {
	currentLocation: string;
	weatherData: WeatherData | null;
	airQualityData: AirQualityData | null;
	errorMsg: string | null;
	dataLoaded: boolean;
	lastUpdated: number | null;
	refetchWeather: () => Promise<void>;
}

const CurrentLocationContext = createContext<CurrentLocationContextType>({
	currentLocation: "",
	weatherData: null,
	airQualityData: null,
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
	const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<number | null>(null);
	const appState = useRef(AppState.currentState);
	const isFetchingRef = useRef(false);

	useEffect(() => {
		const loadCache = async () => {
			const [cachedWeather, cachedAirQuality] = await Promise.all([
				getCachedWeather(),
				getCachedAirQuality(),
			]);
			if (cachedWeather) {
				setWeatherData(cachedWeather.data);
				setLastUpdated(cachedWeather.timestamp);
				setCurrentLocation("Current Location");
				setDataLoaded(true);
			}
			if (cachedAirQuality) {
				setAirQualityData(cachedAirQuality.data);
			}
		};

		loadCache();
	}, []);

	const fetchLocationAndWeather = useCallback(async () => {
		if (!units.unitsLoaded) {
			return;
		}

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

			setCurrentLocation("Current Location");

			const [weatherResult, airQualityResult] = await Promise.all([
				getWeatherData(
					location.coords.latitude,
					location.coords.longitude,
					units.temperatureUnit,
					units.windSpeedUnit,
					units.precipitationUnit
				),
				getAirQualityData(
					location.coords.latitude,
					location.coords.longitude
				),
			]);

			setWeatherData(weatherResult);
			setAirQualityData(airQualityResult);
			setErrorMsg(null);

			const timestamp = Date.now();
			const cachePromises: Promise<void>[] = [];
			if (weatherResult) {
				cachePromises.push(
					setCachedWeather(
						location.coords.latitude,
						location.coords.longitude,
						weatherResult
					)
				);
			}
			if (airQualityResult) {
				cachePromises.push(
					setCachedAirQuality(
						location.coords.latitude,
						location.coords.longitude,
						airQualityResult
					)
				);
			}
			await Promise.all(cachePromises);
			if (weatherResult) {
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

	useEffect(() => {
		if (units.unitsLoaded && !dataLoaded) {
			fetchLocationAndWeather();
		}
	}, [units.unitsLoaded, dataLoaded, fetchLocationAndWeather]);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			async (nextAppState: AppStateStatus) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					const cacheValid = await isCacheValid();
					if (!cacheValid) {
						fetchLocationAndWeather();
					}
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
			airQualityData,
			errorMsg,
			dataLoaded,
			lastUpdated,
			refetchWeather: fetchLocationAndWeather,
		}),
		[currentLocation, weatherData, airQualityData, errorMsg, dataLoaded, lastUpdated, fetchLocationAndWeather]
	);

	return (
		<CurrentLocationContext.Provider value={value}>
			{children}
		</CurrentLocationContext.Provider>
	);
};
