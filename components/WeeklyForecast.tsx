import React from "react";
import { View, StyleSheet } from "react-native";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { StyledText } from "@/components/StyledText";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { getWeatherDescription } from "@/utils/weatherDescriptionMap";
import { WeatherData } from "@/utils/weather";
import IconDirectionUp from "@/assets/weather/wi-direction-up.svg";
import { useUnits } from "@/contexts/UnitsContext";
import { n } from "@/utils/scaling";
import { formatNumber } from "@/utils/numberFormatting";

interface WeeklyForecastProps {
    weeklyData?: WeatherData["daily"];
    selectedDetails: string[];
}

interface DailyVariableData {
    label: string;
    value: string;
    unit: string;
    windAngle?: number;
}

const getDailyVariableData = (
    dailyData: WeatherData["daily"],
    variableName: string,
    index: number,
    units: ReturnType<typeof useUnits>
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
}

const WeeklyItem = React.memo(function WeeklyItem({
    date,
    weatherCode,
    description,
    detailSegments,
    invertColors,
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
                    <WeatherIconComponent
                        width={n(32)}
                        height={n(32)}
                        fill={invertColors ? "black" : "white"}
                    />
                    <StyledText style={styles.firstLineText}>{description}</StyledText>
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
}: WeeklyForecastProps) {
    const { invertColors } = useInvertColors();
    const units = useUnits();
    return (
        <View style={styles.container}>
            <StyledText style={styles.sectionTitle}>
                Weekly Forecast
            </StyledText>
            {weeklyData?.time.map((_, index) => {
                // Build detail segments for inline wind arrow placement
                const detailSegments: DetailSegment[] = selectedDetails.map(
                    (detail, detailIdx) => {
                        const data = getDailyVariableData(
                            weeklyData,
                            detail,
                            index,
                            units
                        );
                        const isLast = detailIdx === selectedDetails.length - 1;
                        const hasWindArrow =
                            detail === "Wind Speed" && data.windAngle !== undefined;
                        const text = `${data.label} ${data.value}${data.unit}`;
                        // Put separator after arrow, not before
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
        fontSize: n(20),
        paddingBottom: n(4),
    },
});
