import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirQualityData } from "./airQuality";

const CACHE_KEY = "air_quality_cache_current_location";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedAirQualityData {
	data: AirQualityData;
	timestamp: number;
	latitude: number;
	longitude: number;
}

/**
 * Deserialize cached air quality data, converting date strings back to Date objects
 */
function deserializeAirQualityData(
	cached: CachedAirQualityData
): CachedAirQualityData {
	cached.data.hourly.time = cached.data.hourly.time.map((t) => new Date(t));
	return cached;
}

/**
 * Get cached air quality data for current location
 */
export async function getCachedAirQuality(): Promise<{
	data: AirQualityData;
	timestamp: number;
} | null> {
	try {
		const cached = await AsyncStorage.getItem(CACHE_KEY);

		if (cached) {
			const parsed: CachedAirQualityData = JSON.parse(cached);
			const deserialized = deserializeAirQualityData(parsed);

			return {
				data: deserialized.data,
				timestamp: deserialized.timestamp,
			};
		}

		return null;
	} catch (error) {
		console.error("Error getting cached air quality:", error);
		return null;
	}
}

/**
 * Store air quality data in cache for current location
 */
export async function setCachedAirQuality(
	latitude: number,
	longitude: number,
	data: AirQualityData
): Promise<void> {
	try {
		const cacheEntry: CachedAirQualityData = {
			data,
			timestamp: Date.now(),
			latitude,
			longitude,
		};

		await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
	} catch (error) {
		console.error("Error setting cached air quality:", error);
	}
}

/**
 * Check if cached data is still valid (within TTL)
 */
export async function isAirQualityCacheValid(): Promise<boolean> {
	const age = await getAirQualityCacheAge();
	if (age === null) return false;
	return age < CACHE_TTL_MS;
}

/**
 * Get the age of cached data in milliseconds
 */
export async function getAirQualityCacheAge(): Promise<number | null> {
	try {
		const cached = await AsyncStorage.getItem(CACHE_KEY);

		if (cached) {
			const parsed: CachedAirQualityData = JSON.parse(cached);
			return Date.now() - parsed.timestamp;
		}

		return null;
	} catch (error) {
		console.error("Error getting air quality cache age:", error);
		return null;
	}
}
