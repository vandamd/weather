import React from "react";
import { View, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { StyledText } from "@/components/StyledText";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { getWeatherDescription } from "@/utils/weatherDescriptionMap";
import { WeatherData } from "@/utils/weather";
import IconDirectionUp from "@/assets/weather/wi-direction-up.svg";
import IconSunrise from "@/assets/weather/wi-sunrise.svg";
import IconSunset from "@/assets/weather/wi-sunset.svg";
import { useUnits } from "@/contexts/UnitsContext";

interface HourlyForecastProps {
	hourlyData?: WeatherData["hourly"];
	dailyData?: WeatherData["daily"];
	selectedWeatherVariable: string;
}

interface HourlyVariableData {
	value: string;
	unit: string;
	windAngle?: number;
}

const getVariableDataAndUnit = (
	hourlyData: WeatherData["hourly"],
	variableName: string,
	index: number,
	units: ReturnType<typeof useUnits>
): HourlyVariableData => {
	const { windSpeedUnit, precipitationUnit } = units;

	switch (variableName) {
		case "Temp":
			return {
				value: hourlyData.temperature2m[index].toFixed(0),
				unit: "°",
			};
		case "Feels Like":
			return {
				value: hourlyData.apparentTemperature[index].toFixed(0),
				unit: "°",
			};
		case "Precip Chance":
			return {
				value: hourlyData.precipitationProbability[index].toFixed(0),
				unit: "%",
			};
		case "Precip Amount":
			return {
				value: hourlyData.precipitation[index].toFixed(2),
				unit: precipitationUnit === "Millimeter" ? "mm" : "in",
			};
		case "Wind Speed":
			return {
				value: hourlyData.windSpeed10m[index].toFixed(0),
				unit: windSpeedUnit,
				windAngle: hourlyData.windDirection10m[index],
			};
		case "Wind Gusts":
			return {
				value: hourlyData.windGusts10m[index].toFixed(0),
				unit: windSpeedUnit,
			};
		case "UV Index":
			return {
				value: hourlyData.uvIndex[index].toFixed(1),
				unit: "",
			};
		case "Humidity":
			return {
				value: hourlyData.relativeHumidity2m[index].toFixed(0),
				unit: "%",
			};
		case "Dew Point":
			return {
				value: hourlyData.dewPoint2m[index].toFixed(0),
				unit: "°",
			};
		case "Cloud Cover":
			return {
				value: hourlyData.cloudCover[index].toFixed(0),
				unit: "%",
			};
		case "Visibility":
			return {
				value: (hourlyData.visibility[index] / 1000).toFixed(1),
				unit: "km",
			};
		case "Pressure":
			return {
				value: hourlyData.surfacePressure[index].toFixed(0),
				unit: "hPa",
			};
		default:
			return {
				value: hourlyData.temperature2m[index].toFixed(0),
				unit: "°",
			};
	}
};

export default function HourlyForecast({
	hourlyData,
	dailyData,
	selectedWeatherVariable,
}: HourlyForecastProps) {
	const { invertColors } = useInvertColors();
	const units = useUnits();
	return (
		<View style={{ paddingTop: 16 }}>
			<StyledText style={{ fontSize: 19, paddingBottom: 4 }}>
				Hourly Forecast
			</StyledText>
			{hourlyData?.time.map((_, index) => {
				const currentTime = hourlyData.time[index];

				const sunriseDates = dailyData?.sunrise || [];
				const sunsetDates = dailyData?.sunset || [];
				const hourStart = currentTime.getTime();
				const hourEnd = hourStart + 60 * 60 * 1000;

				const sunriseEvent = sunriseDates.find((d) => {
					const t = d.getTime();
					return t >= hourStart && t < hourEnd;
				});
				const sunsetEvent = sunsetDates.find((d) => {
					const t = d.getTime();
					return t >= hourStart && t < hourEnd;
				});
				const eventDate = sunriseEvent || sunsetEvent;
				if (eventDate) {
					const isSunrise = !!sunriseEvent;
					const IconComponent = isSunrise ? IconSunrise : IconSunset;
					const label = isSunrise ? "Sunrise" : "Sunset";
					return (
						<View key={index} style={styles.hourlyItem}>
							<IconComponent
								width={32}
								height={32}
								fill={invertColors ? "black" : "white"}
							/>
							<StyledText
								style={{ fontSize: 19, paddingLeft: 8 }}
							>
								{eventDate.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
									timeZone: "UTC",
								})}
								{" - "}
								{label}
							</StyledText>
						</View>
					);
				}

				const WeatherIconComponent = getWeatherIcon(
					hourlyData.weatherCode[index] as number,
					hourlyData.isDay[index] as number
				);

				const { value, unit, windAngle } = getVariableDataAndUnit(
					hourlyData,
					selectedWeatherVariable,
					index,
					units
				);

				return (
					<View key={index} style={styles.hourlyItem}>
						<WeatherIconComponent
							width={32}
							height={32}
							fill={invertColors ? "black" : "white"}
						/>
						<StyledText style={{ fontSize: 19, paddingLeft: 8 }}>
							{new Date(
								hourlyData.time[index]
							).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
								timeZone: "UTC",
							})}
							{" - "}
							{getWeatherDescription(
								hourlyData.weatherCode[index] as number
							)}
							{", "}
							{value}
							{unit}
							{typeof windAngle === "number" && (
								<View
									style={[
										{
											marginLeft: 5,
											flexDirection: "row",
											alignItems: "center",
										},
										{
											transform: [
												{ rotate: `${windAngle}deg` },
											],
										},
									]}
								>
									<IconDirectionUp
										width={20}
										height={20}
										fill={invertColors ? "black" : "white"}
									/>
								</View>
							)}
						</StyledText>
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	hourlyItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 0,
	},
});
