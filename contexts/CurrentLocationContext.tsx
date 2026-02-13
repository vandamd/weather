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
import { AppState, AppStateStatus, PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { getWeatherData, WeatherData } from "@/utils/weather";
import { getAirQualityData, AirQualityData } from "@/utils/airQuality";
import { useUnits } from "./UnitsContext";
import { useMainLocation } from "./MainLocationContext";
import {
	getCachedWeather,
	setCachedWeather,
	isCacheValid,
} from "@/utils/weatherCache";
import {
	getCachedAirQuality,
	setCachedAirQuality,
	isAirQualityCacheValid,
} from "@/utils/airQualityCache";
import { SavedLocation } from "@/utils/savedLocations";
import { formatLocationName } from "@/utils/formatting";

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

const CURRENT_SOURCE_KEY = "current";
const LOCATION_PERMISSION_DISABLED_MESSAGE =
	"Location permission is off. Select a main page location in Settings or enable location in system settings.";

function getSourceKey(location: SavedLocation | null): string {
	if (!location) {
		return CURRENT_SOURCE_KEY;
	}

	return `saved:${location.id}:${location.latitude}:${location.longitude}`;
}

function getLocationLabel(location: SavedLocation | null): string {
	if (!location) {
		return "Current Location";
	}

	return formatLocationName(location);
}

export const CurrentLocationProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const units = useUnits();
	const { mainLocation, mainLocationLoaded } = useMainLocation();
	const [currentLocation, setCurrentLocation] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<number | null>(null);
	const appState = useRef(AppState.currentState);
	const isFetchingRef = useRef(false);
	const hasRequestedLocationPermissionRef = useRef(false);
	const sourceKey = useMemo(() => getSourceKey(mainLocation), [mainLocation]);
	const locationLabel = useMemo(
		() => getLocationLabel(mainLocation),
		[mainLocation]
	);

	const isCacheForCurrentSource = useCallback(
		(cacheSourceKey?: string) => {
			if (cacheSourceKey) {
				return cacheSourceKey === sourceKey;
			}
			// Backward compatibility: old cache entries did not include sourceKey.
			return !mainLocation;
		},
		[sourceKey, mainLocation]
	);

	useEffect(() => {
		if (!mainLocationLoaded) {
			return;
		}

		const loadCache = async () => {
			const [cachedWeather, cachedAirQuality] = await Promise.all([
				getCachedWeather(),
				getCachedAirQuality(),
			]);

			setCurrentLocation(locationLabel);
			setErrorMsg(null);

			if (cachedWeather && isCacheForCurrentSource(cachedWeather.sourceKey)) {
				setWeatherData(cachedWeather.data);
				setLastUpdated(cachedWeather.timestamp);
				setDataLoaded(true);
			} else {
				setWeatherData(null);
				setLastUpdated(null);
				setDataLoaded(false);
			}

			if (
				cachedAirQuality &&
				isCacheForCurrentSource(cachedAirQuality.sourceKey)
			) {
				setAirQualityData(cachedAirQuality.data);
			} else {
				setAirQualityData(null);
			}
		};

		loadCache();
	}, [mainLocationLoaded, locationLabel, isCacheForCurrentSource]);

	const fetchLocationAndWeather = useCallback(async () => {
		if (!units.unitsLoaded || !mainLocationLoaded) {
			return;
		}

		if (isFetchingRef.current) {
			return;
		}
		isFetchingRef.current = true;

		try {
			let latitude: number;
			let longitude: number;

			if (mainLocation) {
				latitude = mainLocation.latitude;
				longitude = mainLocation.longitude;
				setCurrentLocation(locationLabel);
			} else {
				if (Platform.OS === "android") {
					const locationPermission =
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
					const hasLocationPermission = await PermissionsAndroid.check(
						locationPermission
					);

					if (!hasLocationPermission) {
						if (hasRequestedLocationPermissionRef.current) {
							setWeatherData(null);
							setAirQualityData(null);
							setLastUpdated(null);
							setErrorMsg(LOCATION_PERMISSION_DISABLED_MESSAGE);
							return;
						}

						hasRequestedLocationPermissionRef.current = true;

						const granted = await PermissionsAndroid.request(
							locationPermission,
							{
								title: "Location Permission",
								message: "This app needs access to your location to show local weather.",
								buttonNeutral: "Ask Me Later",
								buttonNegative: "Cancel",
								buttonPositive: "OK",
							}
						);
						if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
							setWeatherData(null);
							setAirQualityData(null);
							setLastUpdated(null);
							setErrorMsg(LOCATION_PERMISSION_DISABLED_MESSAGE);
							console.log("Location permission denied.");
							return;
						}
					}
				}

				const location = await new Promise<{
					coords: { latitude: number; longitude: number };
				}>((resolve, reject) => {
					Geolocation.getCurrentPosition(
						(position) => resolve(position),
						(error) => reject(error),
						{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
					);
				});

				latitude = location.coords.latitude;
				longitude = location.coords.longitude;
				setCurrentLocation("Current Location");
			}

			const [weatherResult, airQualityResult] = await Promise.all([
				getWeatherData(
					latitude,
					longitude,
					units.temperatureUnit,
					units.windSpeedUnit,
					units.precipitationUnit
				),
				getAirQualityData(
					latitude,
					longitude
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
						latitude,
						longitude,
						sourceKey,
						weatherResult
					)
				);
			}
			if (airQualityResult) {
				cachePromises.push(
					setCachedAirQuality(
						latitude,
						longitude,
						sourceKey,
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
		mainLocation,
		mainLocationLoaded,
		locationLabel,
		sourceKey,
	]);

	useEffect(() => {
		if (units.unitsLoaded && mainLocationLoaded && !dataLoaded) {
			fetchLocationAndWeather();
		}
	}, [units.unitsLoaded, mainLocationLoaded, dataLoaded, fetchLocationAndWeather]);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			async (nextAppState: AppStateStatus) => {
				if (
					appState.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					const [weatherCacheValid, airQualityCacheValid] = await Promise.all([
						isCacheValid(),
						isAirQualityCacheValid(),
					]);
					if (
						!weatherData ||
						!airQualityData ||
						!weatherCacheValid ||
						!airQualityCacheValid
					) {
						fetchLocationAndWeather();
					}
				}

				appState.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [fetchLocationAndWeather, weatherData, airQualityData]);

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
