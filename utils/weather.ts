import { fetchWeatherApi } from "openmeteo";
import {
	TemperatureUnit,
	WindSpeedUnit,
	PrecipitationUnit,
} from "@/contexts/UnitsContext";

export interface WeatherData {
	current: {
		time: Date;
		weatherCode: number;
		temperature2m: number;
		apparentTemperature: number;
		isDay: number;
	};
	hourly: {
		time: Date[];
		temperature2m: Float32Array | number[];
		apparentTemperature: Float32Array | number[];
		precipitationProbability: Float32Array | number[];
		precipitation: Float32Array | number[];
		weatherCode: Float32Array | number[];
		windSpeed10m: Float32Array | number[];
		windDirection10m: Float32Array | number[];
		windGusts10m: Float32Array | number[];
		uvIndex: Float32Array | number[];
		relativeHumidity2m: Float32Array | number[];
		dewPoint2m: Float32Array | number[];
		cloudCover: Float32Array | number[];
		visibility: Float32Array | number[];
		surfacePressure: Float32Array | number[];
		isDay: Float32Array | number[];
	};
	daily: {
		time: Date[];
		temperature2mMax: Float32Array | number[];
		temperature2mMin: Float32Array | number[];
		weatherCode: Float32Array | number[];
		apparentTemperatureMax: Float32Array | number[];
		apparentTemperatureMin: Float32Array | number[];
		precipitationProbabilityMax: Float32Array | number[];
		uvIndexMax: Float32Array | number[];
		precipitationSum: Float32Array | number[];
		windSpeed10mMax: Float32Array | number[];
		windGusts10mMax: Float32Array | number[];
		windDirection10mDominant: Float32Array | number[];
		relativeHumidity2mMean: Float32Array | number[];
		dewPoint2mMean: Float32Array | number[];
		cloudCoverMean: Float32Array | number[];
		visibilityMean: Float32Array | number[];
		surfacePressureMean: Float32Array | number[];
		sunrise: Date[];
		sunset: Date[];
	};
}

export async function getWeatherData(
	latitude: number,
	longitude: number,
	temperatureUnit: TemperatureUnit,
	windSpeedUnit: WindSpeedUnit,
	precipitationUnit: PrecipitationUnit
): Promise<WeatherData | null> {
	const apiTemperatureUnit =
		temperatureUnit === "Celsius" ? "celsius" : "fahrenheit";
	let apiWindSpeedUnit: string;
	switch (windSpeedUnit) {
		case "km/h":
			apiWindSpeedUnit = "kmh";
			break;
		case "m/s":
			apiWindSpeedUnit = "ms";
			break;
		case "mph":
			apiWindSpeedUnit = "mph";
			break;
		case "Knots":
			apiWindSpeedUnit = "kn";
			break;
		default:
			apiWindSpeedUnit = "kmh"; // Default
	}
	const apiPrecipitationUnit =
		precipitationUnit === "Millimeter" ? "mm" : "inch";

	const params = {
		latitude,
		longitude,
		daily: [
			"temperature_2m_max",
			"temperature_2m_min",
			"weather_code",
			"apparent_temperature_max",
			"apparent_temperature_min",
			"precipitation_probability_max",
			"uv_index_max",
			"precipitation_sum",
			"wind_speed_10m_max",
			"wind_gusts_10m_max",
			"wind_direction_10m_dominant",
			"relative_humidity_2m_mean",
			"dew_point_2m_mean",
			"cloud_cover_mean",
			"visibility_mean",
			"surface_pressure_mean",
			"sunrise",
			"sunset",
		],
		hourly: [
			"temperature_2m",
			"apparent_temperature",
			"precipitation_probability",
			"precipitation",
			"weather_code",
			"wind_speed_10m",
			"wind_direction_10m",
			"wind_gusts_10m",
			"uv_index",
			"relative_humidity_2m",
			"dew_point_2m",
			"cloud_cover",
			"visibility",
			"surface_pressure",
			"is_day",
		],
		current: [
			"weather_code",
			"temperature_2m",
			"apparent_temperature",
			"is_day",
		],
		timezone: "auto",
		forecast_days: 7,
		wind_speed_unit: apiWindSpeedUnit,
		temperature_unit: apiTemperatureUnit,
		precipitation_unit: apiPrecipitationUnit,
		forecast_hours: 24,
	};
	const url = "https://api.open-meteo.com/v1/forecast";

	try {
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const timezone = response.timezone();
		const timezoneAbbreviation = response.timezoneAbbreviation();

		const current = response.current();
		if (!current) {
			console.error("Current weather data is undefined");
			return null;
		}
		const hourly = response.hourly();
		if (!hourly) {
			console.error("Hourly weather data is undefined");
			return null;
		}
		const daily = response.daily();
		if (!daily) {
			console.error("Daily weather data is undefined");
			return null;
		}
		const sunrise = daily.variables(16)!;
		const sunset = daily.variables(17)!;

		// Note: The order of weather variables in the URL query and the indices below need to match!
		const weatherData: WeatherData = {
			current: {
				time: new Date(
					(Number(current.time()) + utcOffsetSeconds) * 1000
				),
				weatherCode: current.variables(0)!.value(),
				temperature2m: current.variables(1)!.value(),
				apparentTemperature: current.variables(2)!.value(),
				isDay: current.variables(3)!.value(),
			},
			hourly: {
				time: [
					...Array(
						(Number(hourly.timeEnd()) - Number(hourly.time())) /
							hourly.interval()
					),
				].map(
					(_, i) =>
						new Date(
							(Number(hourly.time()) +
								i * hourly.interval() +
								utcOffsetSeconds) *
								1000
						)
				),
				temperature2m: hourly.variables(0)!.valuesArray()!,
				apparentTemperature: hourly.variables(1)!.valuesArray()!,
				precipitationProbability: hourly.variables(2)!.valuesArray()!,
				precipitation: hourly.variables(3)!.valuesArray()!,
				weatherCode: hourly.variables(4)!.valuesArray()!,
				windSpeed10m: hourly.variables(5)!.valuesArray()!,
				windDirection10m: hourly.variables(6)!.valuesArray()!,
				windGusts10m: hourly.variables(7)!.valuesArray()!,
				uvIndex: hourly.variables(8)!.valuesArray()!,
				relativeHumidity2m: hourly.variables(9)!.valuesArray()!,
				dewPoint2m: hourly.variables(10)!.valuesArray()!,
				cloudCover: hourly.variables(11)!.valuesArray()!,
				visibility: hourly.variables(12)!.valuesArray()!,
				surfacePressure: hourly.variables(13)!.valuesArray()!,
				isDay: hourly.variables(14)!.valuesArray()!,
			},
			daily: {
				time: [
					...Array(
						Math.round(
							(Number(daily.timeEnd()) - Number(daily.time())) /
								daily.interval()
						)
					),
				].map(
					(_, i) =>
						new Date(
							(Number(daily.time()) +
								i * daily.interval() +
								utcOffsetSeconds) *
								1000
						)
				),
				temperature2mMax: daily.variables(0)!.valuesArray()!,
				temperature2mMin: daily.variables(1)!.valuesArray()!,
				weatherCode: daily.variables(2)!.valuesArray()!,
				apparentTemperatureMax: daily.variables(3)!.valuesArray()!,
				apparentTemperatureMin: daily.variables(4)!.valuesArray()!,
				precipitationProbabilityMax: daily.variables(5)!.valuesArray()!,
				uvIndexMax: daily.variables(6)!.valuesArray()!,
				precipitationSum: daily.variables(7)!.valuesArray()!,
				windSpeed10mMax: daily.variables(8)!.valuesArray()!,
				windGusts10mMax: daily.variables(9)!.valuesArray()!,
				windDirection10mDominant: daily.variables(10)!.valuesArray()!,
				relativeHumidity2mMean: daily.variables(11)!.valuesArray()!,
				dewPoint2mMean: daily.variables(12)!.valuesArray()!,
				cloudCoverMean: daily.variables(13)!.valuesArray()!,
				visibilityMean: daily.variables(14)!.valuesArray()!,
				surfacePressureMean: daily.variables(15)!.valuesArray()!,
				sunrise: [...Array(sunrise.valuesInt64Length())].map(
					(_, i) =>
						new Date(
							(Number(sunrise.valuesInt64(i)) +
								utcOffsetSeconds) *
								1000
						)
				),
				sunset: [...Array(sunset.valuesInt64Length())].map(
					(_, i) =>
						new Date(
							(Number(sunset.valuesInt64(i)) + utcOffsetSeconds) *
								1000
						)
				),
			},
		};
		return weatherData;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		return null;
	}
}
