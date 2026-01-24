import React from "react";
import { View, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useShowIcons } from "@/contexts/ShowIconsContext";
import { StyledText } from "@/components/StyledText";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { getWeatherDescription } from "@/utils/weatherDescriptionMap";
import { WeatherData } from "@/utils/weather";
import { AirQualityData } from "@/utils/airQuality";
import IconDirectionUp from "@/assets/weather/wi-direction-up.svg";
import IconSunrise from "@/assets/weather/wi-sunrise.svg";
import IconSunset from "@/assets/weather/wi-sunset.svg";
import { useUnits } from "@/contexts/UnitsContext";
import { useTimeFormat, TimeFormat } from "@/contexts/TimeFormatContext";
import { n } from "@/utils/scaling";
import { formatNumber } from "@/utils/numberFormatting";

interface HourlyForecastProps {
	hourlyData?: WeatherData["hourly"];
	dailyData?: WeatherData["daily"];
	selectedDetails: string[];
	airQualityData?: AirQualityData | null;
}

interface HourlyVariableData {
	label: string;
	value: string;
	unit: string;
	windAngle?: number;
}

const getVariableDataAndUnit = (
	hourlyData: WeatherData["hourly"],
	variableName: string,
	index: number,
	units: ReturnType<typeof useUnits>,
	airQualityData?: AirQualityData | null
): HourlyVariableData => {
	const { windSpeedUnit, precipitationUnit } = units;

	switch (variableName) {
		case "Temp":
			return {
				label: "T:",
				value: formatNumber(hourlyData.temperature2m[index], 0),
				unit: "°",
			};
		case "Feels Like":
			return {
				label: "FL:",
				value: formatNumber(hourlyData.apparentTemperature[index], 0),
				unit: "°",
			};
		case "Precip Chance":
			return {
				label: "P:",
				value: formatNumber(hourlyData.precipitationProbability[index], 0),
				unit: "%",
			};
		case "Precip Amount":
			return {
				label: "P:",
				value: formatNumber(hourlyData.precipitation[index], 2),
				unit: precipitationUnit === "Millimeter" ? "mm" : "in",
			};
		case "Wind Speed":
			return {
				label: "W:",
				value: formatNumber(hourlyData.windSpeed10m[index], 0),
				unit: windSpeedUnit,
				windAngle: hourlyData.windDirection10m[index],
			};
		case "Wind Gusts":
			return {
				label: "G:",
				value: formatNumber(hourlyData.windGusts10m[index], 0),
				unit: windSpeedUnit,
			};
		case "UV Index":
			return {
				label: "UV:",
				value: formatNumber(hourlyData.uvIndex[index], 1),
				unit: "",
			};
		case "Humidity":
			return {
				label: "H:",
				value: formatNumber(hourlyData.relativeHumidity2m[index], 0),
				unit: "%",
			};
		case "Dew Point":
			return {
				label: "DP:",
				value: formatNumber(hourlyData.dewPoint2m[index], 0),
				unit: "°",
			};
		case "Cloud Cover":
			return {
				label: "C:",
				value: formatNumber(hourlyData.cloudCover[index], 0),
				unit: "%",
			};
		case "Visibility":
			return {
				label: "V:",
				value: formatNumber(hourlyData.visibility[index] / 1000, 1),
				unit: "km",
			};
		case "Pressure":
			return {
				label: "P:",
				value: formatNumber(hourlyData.surfacePressure[index], 0),
				unit: "hPa",
			};
		case "AQI (US)":
			return {
				label: "AQI:",
				value: airQualityData?.hourly.usAqi[index] != null
					? formatNumber(airQualityData.hourly.usAqi[index], 0)
					: "-",
				unit: "",
			};
		case "AQI (EU)":
			return {
				label: "AQI:",
				value: airQualityData?.hourly.europeanAqi[index] != null
					? formatNumber(airQualityData.hourly.europeanAqi[index], 0)
					: "-",
				unit: "",
			};
		case "PM2.5":
			return {
				label: "PM:",
				value: airQualityData?.hourly.pm25[index] != null
					? formatNumber(airQualityData.hourly.pm25[index], 0)
					: "-",
				unit: "μg/m³",
			};
		case "PM10":
			return {
				label: "PM:",
				value: airQualityData?.hourly.pm10[index] != null
					? formatNumber(airQualityData.hourly.pm10[index], 0)
					: "-",
				unit: "μg/m³",
			};
		default:
			return {
				label: "T:",
				value: formatNumber(hourlyData.temperature2m[index], 0),
				unit: "°",
			};
	}
};

interface DetailSegment {
	text: string;
	hasWindArrow: boolean;
	windAngle?: number;
	suffix: string;
}

interface HourlyItemProps {
	time: Date;
	weatherCode: number;
	isDay: number;
	detailSegments: DetailSegment[];
	description: string;
	invertColors: boolean;
	showIcons: boolean;
	timeFormat: TimeFormat;
}

const HourlyItem = React.memo(function HourlyItem({
	time,
	weatherCode,
	isDay,
	detailSegments,
	description,
	invertColors,
	showIcons,
	timeFormat,
}: HourlyItemProps) {
	const WeatherIconComponent = React.useMemo(
		() => getWeatherIcon(weatherCode, isDay),
		[weatherCode, isDay]
	);

	const leftColumnWidth = timeFormat === "12h" ? n(125) : n(84);

	return (
		<View style={styles.rowContainer}>
			<StyledText style={[styles.leftColumn, { width: leftColumnWidth }]}>
				{time.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: timeFormat === "12h",
					timeZone: "UTC",
				})}
			</StyledText>
			<View style={styles.infoContainer}>
				<View style={styles.firstLine}>
					{showIcons && (
						<WeatherIconComponent
							width={n(32)}
							height={n(32)}
							fill={invertColors ? "black" : "white"}
						/>
					)}
					<StyledText style={[styles.firstLineText, showIcons && styles.firstLineTextWithIcon]}>{description}</StyledText>
				</View>
				<View style={styles.secondLine}>
					{detailSegments.map((segment, idx) => (
						<React.Fragment key={idx}>
							<StyledText style={styles.secondLineText}>
								{segment.text}
							</StyledText>
							{segment.hasWindArrow && typeof segment.windAngle === "number" && (
								<View
									style={[
										styles.windContainer,
										{ transform: [{ rotate: `${segment.windAngle}deg` }] },
									]}
								>
									<IconDirectionUp
										width={n(16)}
										height={n(16)}
										fill={invertColors ? "black" : "white"}
									/>
								</View>
							)}
							{segment.suffix && (
								<StyledText style={styles.secondLineText}>
									{segment.suffix}
								</StyledText>
							)}
						</React.Fragment>
					))}
				</View>
			</View>
		</View>
	);
});

interface SunEventItemProps {
	time: Date;
	isSunrise: boolean;
	invertColors: boolean;
	showIcons: boolean;
	timeFormat: TimeFormat;
}

const SunEventItem = React.memo(function SunEventItem({
	time,
	isSunrise,
	invertColors,
	showIcons,
	timeFormat,
}: SunEventItemProps) {
	const IconComponent = isSunrise ? IconSunrise : IconSunset;
	const label = isSunrise ? "Sunrise" : "Sunset";

	const leftColumnWidth = timeFormat === "12h" ? n(125) : n(84);

	return (
		<View style={styles.sunEventRow}>
			<StyledText style={[styles.leftColumn, { width: leftColumnWidth }]}>
				{time.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: timeFormat === "12h",
					timeZone: "UTC",
				})}
			</StyledText>
			<View style={styles.infoContainer}>
				<View style={styles.firstLine}>
					{showIcons && (
						<IconComponent
							width={n(32)}
							height={n(32)}
							fill={invertColors ? "black" : "white"}
						/>
					)}
					<StyledText style={[styles.firstLineText, showIcons && styles.firstLineTextWithIcon]}>{label}</StyledText>
				</View>
			</View>
		</View>
	);
});

const HourlyForecast = React.memo(function HourlyForecast({
	hourlyData,
	dailyData,
	selectedDetails,
	airQualityData,
}: HourlyForecastProps) {
	const { invertColors } = useInvertColors();
	const { showIcons } = useShowIcons();
	const units = useUnits();
	const { timeFormat } = useTimeFormat();
	return (
		<View style={styles.container}>
			<StyledText style={styles.sectionTitle}>
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
					return (
						<SunEventItem
							key={index}
							time={eventDate}
							isSunrise={isSunrise}
							invertColors={invertColors}
							showIcons={showIcons}
							timeFormat={timeFormat}
						/>
					);
				}

				const detailSegments: DetailSegment[] = selectedDetails.map(
					(detail, detailIdx) => {
						const data = getVariableDataAndUnit(
							hourlyData,
							detail,
							index,
							units,
							airQualityData
						);
						const isLast = detailIdx === selectedDetails.length - 1;
						const hasWindArrow =
							detail === "Wind Speed" && data.windAngle !== undefined;
						const text = `${data.label} ${data.value}${data.unit}`;
						const suffix = isLast ? "" : " • ";
						return {
							text,
							hasWindArrow,
							windAngle: data.windAngle,
							suffix,
						};
					}
				);

				return (
					<HourlyItem
						key={index}
						time={hourlyData.time[index]}
						weatherCode={hourlyData.weatherCode[index] as number}
						isDay={hourlyData.isDay[index] as number}
						detailSegments={detailSegments}
						description={getWeatherDescription(
							hourlyData.weatherCode[index] as number
						)}
						invertColors={invertColors}
						showIcons={showIcons}
						timeFormat={timeFormat}
					/>
				);
			})}
		</View>
	);
});

export default HourlyForecast;

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	sunEventRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: n(12),
	},
	leftColumn: {
		fontSize: n(26),
		width: n(84),
		paddingRight: n(8),
	},
	infoContainer: {
		flex: 1,
		paddingRight: n(10),
	},
	firstLine: {
		flexDirection: "row",
		alignItems: "center",
	},
	firstLineText: {
		fontSize: n(26),
	},
	firstLineTextWithIcon: {
		paddingLeft: n(8),
	},
	secondLine: {
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: n(6),
	},
	secondLineText: {
		fontSize: n(16),
		lineHeight: n(18),
	},
	windContainer: {
		marginLeft: n(5),
		flexDirection: "row",
		alignItems: "center",
	},
	container: {
		paddingTop: n(32),
	},
	sectionTitle: {
		fontSize: n(16),
		paddingBottom: n(4),
	},
});
