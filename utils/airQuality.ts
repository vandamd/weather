export interface AirQualityData {
	hourly: {
		time: Date[];
		usAqi: number[];
		europeanAqi: number[];
		pm25: number[];
		pm10: number[];
	};
}

export async function getAirQualityData(
	latitude: number,
	longitude: number
): Promise<AirQualityData | null> {
	const url = new URL(
		"https://air-quality-api.open-meteo.com/v1/air-quality"
	);
	url.searchParams.set("latitude", latitude.toString());
	url.searchParams.set("longitude", longitude.toString());
	url.searchParams.set("hourly", "us_aqi,european_aqi,pm2_5,pm10");
	url.searchParams.set("timezone", "auto");
	url.searchParams.set("forecast_days", "7");

	try {
		const response = await fetch(url.toString());
		if (!response.ok) {
			console.error("Air quality API error:", response.status);
			return null;
		}

		const data = await response.json();

		if (!data.hourly) {
			console.error("Air quality hourly data is undefined");
			return null;
		}

		const utcOffsetSeconds = data.utc_offset_seconds || 0;

		const airQualityData: AirQualityData = {
			hourly: {
				time: data.hourly.time.map(
					(t: string) =>
						new Date(new Date(t).getTime() + utcOffsetSeconds * 1000)
				),
				usAqi: data.hourly.us_aqi || [],
				europeanAqi: data.hourly.european_aqi || [],
				pm25: data.hourly.pm2_5 || [],
				pm10: data.hourly.pm10 || [],
			},
		};

		return airQualityData;
	} catch (error) {
		console.error("Error fetching air quality data:", error);
		return null;
	}
}
