export interface GeocodingResult {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation: number;
	feature_code: string;
	country_code: string;
	admin1_id?: number;
	admin2_id?: number;
	admin3_id?: number;
	admin4_id?: number;
	timezone: string;
	population?: number;
	postcodes?: string[];
	country_id?: number;
	country: string;
	admin1?: string;
	admin2?: string;
	admin3?: string;
	admin4?: string;
}

export interface GeocodingAPIResponse {
	results: GeocodingResult[];
	generationtime_ms: number;
}

export async function searchLocations(
	name: string,
	count: number = 10,
	language: string = "en",
	format: string = "json"
): Promise<GeocodingResult[]> {
	const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
		name
	)}&count=${count}&language=${language}&format=${format}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.error(
				"Failed to fetch geocoding data:",
				response.statusText
			);
			return [];
		}
		const data: GeocodingAPIResponse = await response.json();
		return data.results || [];
	} catch (error) {
		console.error("Error fetching or parsing geocoding data:", error);
		return [];
	}
}
