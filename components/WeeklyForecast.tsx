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
import { useUnits } from "@/contexts/UnitsContext";
import { n } from "@/utils/scaling";
import { formatNumber } from "@/utils/numberFormatting";

interface WeeklyForecastProps {
    weeklyData?: WeatherData["daily"];
    selectedDetails: string[];
    airQualityData?: AirQualityData | null;
}

interface DailyVariableData {
    label: string;
    value: string;
    unit: string;
    windAngle?: number;
}

/**
 * Get daily max from hourly air quality data by matching timestamps
 * Compares the date portion of hourly timestamps with the target day
 */
const getDailyMaxFromHourly = (
    hourlyData: number[],
    hourlyTime: Date[],
    targetDate: Date
): number | null => {
    const targetDateStr = targetDate.toISOString().slice(0, 10);
    const dayValues: number[] = [];

    for (let i = 0; i < hourlyTime.length; i++) {
        const hourDateStr = hourlyTime[i].toISOString().slice(0, 10);
        if (hourDateStr === targetDateStr && hourlyData[i] != null) {
            dayValues.push(hourlyData[i]);
        }
    }

    if (dayValues.length === 0) return null;
    return Math.max(...dayValues);
};

const getDailyVariableData = (
    dailyData: WeatherData["daily"],
    variableName: string,
    index: number,
    units: ReturnType<typeof useUnits>,
    airQualityData?: AirQualityData | null,
    targetDate?: Date
): DailyVariableData => {
    const { windSpeedUnit, precipitationUnit } = units;

    switch (variableName) {
        case "Temp":
            return {
                label: "T:",
                value: `(${formatNumber(dailyData.temperature2mMin[index], 0)}°, ${formatNumber(dailyData.temperature2mMax[index], 0)}°)`,
                unit: "",
            };
        case "Feels Like":
            return {
                label: "FL:",
                value: `(${formatNumber(dailyData.apparentTemperatureMin[index], 0)}°, ${formatNumber(dailyData.apparentTemperatureMax[index], 0)}°)`,
                unit: "",
            };
        case "Precip Chance":
            return {
                label: "P:",
                value: formatNumber(dailyData.precipitationProbabilityMax[index], 0),
                unit: "%",
            };
        case "Precip Amount":
            return {
                label: "P:",
                value: formatNumber(dailyData.precipitationSum[index], 2),
                unit: precipitationUnit === "Millimeter" ? "mm" : "in",
            };
        case "Wind Speed":
            return {
                label: "W:",
                value: formatNumber(dailyData.windSpeed10mMax[index], 0),
                unit: windSpeedUnit,
                windAngle: dailyData.windDirection10mDominant[index],
            };
        case "Wind Gusts":
            return {
                label: "G:",
                value: formatNumber(dailyData.windGusts10mMax[index], 0),
                unit: windSpeedUnit,
            };
        case "UV Index":
            return {
                label: "UV:",
                value: formatNumber(dailyData.uvIndexMax[index], 1),
                unit: "",
            };
        case "Humidity":
            return {
                label: "H:",
                value: formatNumber(dailyData.relativeHumidity2mMean[index], 0),
                unit: "%",
            };
        case "Dew Point":
            return {
                label: "DP:",
                value: formatNumber(dailyData.dewPoint2mMean[index], 0),
                unit: "°",
            };
        case "Cloud Cover":
            return {
                label: "C:",
                value: formatNumber(dailyData.cloudCoverMean[index], 0),
                unit: "%",
            };
        case "Visibility":
            return {
                label: "V:",
                value: formatNumber(dailyData.visibilityMean[index] / 1000, 1),
                unit: "km",
            };
        case "Pressure":
            return {
                label: "P:",
                value: formatNumber(dailyData.surfacePressureMean[index], 0),
                unit: "hPa",
            };
        case "AQI (US)": {
            const maxVal = airQualityData && targetDate
                ? getDailyMaxFromHourly(airQualityData.hourly.usAqi, airQualityData.hourly.time, targetDate)
                : null;
            return {
                label: "AQI:",
                value: maxVal != null ? formatNumber(maxVal, 0) : "-",
                unit: "",
            };
        }
        case "AQI (EU)": {
            const maxVal = airQualityData && targetDate
                ? getDailyMaxFromHourly(airQualityData.hourly.europeanAqi, airQualityData.hourly.time, targetDate)
                : null;
            return {
                label: "AQI:",
                value: maxVal != null ? formatNumber(maxVal, 0) : "-",
                unit: "",
            };
        }
        case "PM2.5": {
            const maxVal = airQualityData && targetDate
                ? getDailyMaxFromHourly(airQualityData.hourly.pm25, airQualityData.hourly.time, targetDate)
                : null;
            return {
                label: "PM:",
                value: maxVal != null ? formatNumber(maxVal, 0) : "-",
                unit: "μg/m³",
            };
        }
        case "PM10": {
            const maxVal = airQualityData && targetDate
                ? getDailyMaxFromHourly(airQualityData.hourly.pm10, airQualityData.hourly.time, targetDate)
                : null;
            return {
                label: "PM:",
                value: maxVal != null ? formatNumber(maxVal, 0) : "-",
                unit: "μg/m³",
            };
        }
        default:
            return {
                label: "T:",
                value: `(${formatNumber(dailyData.temperature2mMin[index], 0)}°, ${formatNumber(dailyData.temperature2mMax[index], 0)}°)`,
                unit: "",
            };
    }
};

interface DetailSegment {
    text: string;
    hasWindArrow: boolean;
    windAngle?: number;
    suffix: string;
}

interface WeeklyItemProps {
    date: Date;
    weatherCode: number;
    description: string;
    detailSegments: DetailSegment[];
    invertColors: boolean;
    showIcons: boolean;
}

const WeeklyItem = React.memo(function WeeklyItem({
    date,
    weatherCode,
    description,
    detailSegments,
    invertColors,
    showIcons,
}: WeeklyItemProps) {
    const WeatherIconComponent = React.useMemo(
        () => getWeatherIcon(weatherCode, 1),
        [weatherCode]
    );

    return (
        <View style={styles.rowContainer}>
            <StyledText style={styles.leftColumn}>
                {date.toLocaleDateString("en-US", {
                    weekday: "short",
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

const WeeklyForecast = React.memo(function WeeklyForecast({
    weeklyData,
    selectedDetails,
    airQualityData,
}: WeeklyForecastProps) {
    const { invertColors } = useInvertColors();
    const { showIcons } = useShowIcons();
    const units = useUnits();
    return (
        <View style={styles.container}>
            <StyledText style={styles.sectionTitle}>
                Weekly Forecast
            </StyledText>
            {weeklyData?.time.map((_, index) => {
                const detailSegments: DetailSegment[] = selectedDetails.map(
                    (detail, detailIdx) => {
                        const data = getDailyVariableData(
                            weeklyData,
                            detail,
                            index,
                            units,
                            airQualityData,
                            weeklyData.time[index]
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
                    <WeeklyItem
                        key={index}
                        date={weeklyData.time[index]}
                        weatherCode={weeklyData.weatherCode[index] as number}
                        description={getWeatherDescription(
                            weeklyData.weatherCode[index] as number
                        )}
                        detailSegments={detailSegments}
                        invertColors={invertColors}
                        showIcons={showIcons}
                    />
                );
            })}
        </View>
    );
});

export default WeeklyForecast;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    leftColumn: {
        fontSize: n(26),
        width: n(70),
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
        paddingTop: n(28),
    },
    sectionTitle: {
        fontSize: n(16),
        paddingBottom: n(4),
    },
});
