import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import CustomScrollView from "@/components/CustomScrollView";
import { useCurrentLocation } from "@/contexts/CurrentLocationContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useDetails } from "@/contexts/DetailsContext";

export default function CurrentLocationScreen() {
	const router = useRouter();
	const {
		currentLocation,
		weatherData,
		errorMsg,
		dataLoaded,
		lastUpdated,
		refetchWeather,
	} = useCurrentLocation();
	const { invertColors } = useInvertColors();
	const { selectedDetails } = useDetails();
	const headerTitle = currentLocation?.toString() || "";

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
		<ContentContainer
			headerTitle={headerTitle}
			hideBackButton={true}
			rightIcon="tune"
			showRightIcon={true}
			onRightIconPress={() => router.push("/settings/details")}
		>
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
				<HourlyForecast
					hourlyData={weatherData?.hourly}
					dailyData={weatherData?.daily}
					selectedDetails={selectedDetails}
				/>
				<WeeklyForecast
					weeklyData={weatherData?.daily}
					selectedDetails={selectedDetails}
				/>
			</CustomScrollView>
		</ContentContainer>
	) : (
		<ContentContainer
			headerTitle={headerTitle}
			hideBackButton={true}
			rightIcon="tune"
			showRightIcon={true}
			onRightIconPress={() => router.push("/settings/details")}
		/>
	);
}
