import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherData } from "./weather";

const CACHE_KEY = "weather_cache_current_location";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedWeatherData {
	data: WeatherData;
	timestamp: number;
	latitude: number;
	longitude: number;
}

/**
 * Deserialize cached weather data, converting date strings back to Date objects
 */
function deserializeWeatherData(cached: CachedWeatherData): CachedWeatherData {
	// Convert current time
	cached.data.current.time = new Date(cached.data.current.time);

	// Convert hourly times
	cached.data.hourly.time = cached.data.hourly.time.map((t) => new Date(t));

	// Convert daily times
	cached.data.daily.time = cached.data.daily.time.map((t) => new Date(t));

	// Convert sunrise/sunset times
	cached.data.daily.sunrise = cached.data.daily.sunrise.map(
		(t) => new Date(t)
	);
	cached.data.daily.sunset = cached.data.daily.sunset.map(
		(t) => new Date(t)
	);

	return cached;
}

/**
 * Get cached weather data for current location
 */
export async function getCachedWeather(): Promise<{
	data: WeatherData;
	timestamp: number;
} | null> {
	try {
		const cached = await AsyncStorage.getItem(CACHE_KEY);

		if (cached) {
			const parsed: CachedWeatherData = JSON.parse(cached);
			const deserialized = deserializeWeatherData(parsed);

			return {
				data: deserialized.data,
				timestamp: deserialized.timestamp,
			};
		}

		return null;
	} catch (error) {
		console.error("Error getting cached weather:", error);
		return null;
	}
}

/**
 * Store weather data in cache for current location
 */
export async function setCachedWeather(
	latitude: number,
	longitude: number,
	data: WeatherData
): Promise<void> {
	try {
		const cacheEntry: CachedWeatherData = {
			data,
			timestamp: Date.now(),
			latitude,
			longitude,
		};

		await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
	} catch (error) {
		console.error("Error setting cached weather:", error);
	}
}

/**
 * Check if cached data is still valid (within TTL)
 */
export async function isCacheValid(): Promise<boolean> {
	const age = await getCacheAge();
	if (age === null) return false;
	return age < CACHE_TTL_MS;
}

/**
 * Get the age of cached data in milliseconds
 */
export async function getCacheAge(): Promise<number | null> {
	try {
		const cached = await AsyncStorage.getItem(CACHE_KEY);

		if (cached) {
			const parsed: CachedWeatherData = JSON.parse(cached);
			return Date.now() - parsed.timestamp;
		}

		return null;
	} catch (error) {
		console.error("Error getting cache age:", error);
		return null;
	}
}

/**
 * Clear cached weather data
 */
export async function clearCachedWeather(): Promise<void> {
	try {
		await AsyncStorage.removeItem(CACHE_KEY);
	} catch (error) {
		console.error("Error clearing cached weather:", error);
	}
}
