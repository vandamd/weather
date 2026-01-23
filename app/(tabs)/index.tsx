import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { View } from "react-native";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import WeatherVariableSelector from "@/components/WeatherVariableSelector";
import CustomScrollView from "@/components/CustomScrollView";
import { useCurrentLocation } from "@/contexts/CurrentLocationContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";

/**
 * Format time difference for display
 */
function formatTimeSince(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}d ago`;
	} else if (hours > 0) {
		return `${hours}h ago`;
	} else if (minutes > 0) {
		return `${minutes}m ago`;
	} else {
		return "just now";
	}
}

export default function CurrentLocationScreen() {
	const {
		currentLocation,
		weatherData,
		errorMsg,
		dataLoaded,
		lastUpdated,
		refetchWeather,
	} = useCurrentLocation();
	const { invertColors } = useInvertColors();
	const [selectedWeatherVariable, setSelectedWeatherVariable] =
		useState<string>("Temp");
	const [headerTitle, setHeaderTitle] = useState<string>(
		currentLocation?.toString() || ""
	);

	// Update header with timestamp every minute
	useEffect(() => {
		const updateHeader = () => {
			if (lastUpdated) {
				const timeAgo = formatTimeSince(lastUpdated);
				setHeaderTitle(`${currentLocation} (${timeAgo})`);
			} else {
				setHeaderTitle(currentLocation?.toString() || "");
			}
		};

		updateHeader();
		const interval = setInterval(updateHeader, 60000); // Update every minute

		return () => clearInterval(interval);
	}, [currentLocation, lastUpdated]);

	useFocusEffect(
		useCallback(() => {
			if (dataLoaded && lastUpdated) {
				const timeSinceLastUpdate = Date.now() - lastUpdated;
				if (timeSinceLastUpdate > 60000) { // 1 minute minimum
					refetchWeather();
				}
			}
		}, [dataLoaded, lastUpdated, refetchWeather])
	);

	// Show blank screen with correct background color while loading
	if (!dataLoaded) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: invertColors ? "white" : "black",
				}}
			/>
		);
	}

	return weatherData ? (
		<ContentContainer headerTitle={headerTitle} hideBackButton={true}>
			<CustomScrollView style={{ width: "100%" }} overScrollMode="never">
				<CurrentSummary
					currentTemperature={weatherData?.current.temperature2m ?? 0}
					apparentTemperature={
						weatherData?.current.apparentTemperature ?? 0
					}
					maxTemperature={
						weatherData?.daily.temperature2mMax?.[0] as number
					}
					minTemperature={
						weatherData?.daily.temperature2mMin?.[0] as number
					}
					weatherCode={weatherData?.current.weatherCode ?? 0}
					isDay={weatherData?.current.isDay ?? 0}
				/>
				<WeatherVariableSelector
					onSelectionChange={setSelectedWeatherVariable}
				/>
				<HourlyForecast
					hourlyData={weatherData?.hourly}
					dailyData={weatherData?.daily}
					selectedWeatherVariable={selectedWeatherVariable}
				/>
				<WeeklyForecast
					weeklyData={weatherData?.daily}
					selectedWeatherVariable={selectedWeatherVariable}
				/>
			</CustomScrollView>
		</ContentContainer>
	) : (
		<ContentContainer headerTitle={headerTitle} hideBackButton={true}></ContentContainer>
	);
}
