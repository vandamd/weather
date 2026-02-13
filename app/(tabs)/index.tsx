import ContentContainer from "@/components/ContentContainer";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import CustomScrollView from "@/components/CustomScrollView";
import { StyledText } from "@/components/StyledText";
import { useCurrentLocation } from "@/contexts/CurrentLocationContext";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useDetails } from "@/contexts/DetailsContext";
import { n } from "@/utils/scaling";

export default function CurrentLocationScreen() {
	const router = useRouter();
	const {
		currentLocation,
		weatherData,
		airQualityData,
		errorMsg,
		dataLoaded,
		lastUpdated,
		refetchWeather,
	} = useCurrentLocation();
	const { invertColors } = useInvertColors();
	const { selectedDetails } = useDetails();
	const headerTitle = currentLocation || "";

	useFocusEffect(
		useCallback(() => {
			if (dataLoaded && lastUpdated) {
				const timeSinceLastUpdate = Date.now() - lastUpdated;
				if (timeSinceLastUpdate > 60000) {
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

	return (
		<ContentContainer
			headerTitle={headerTitle}
			hideBackButton={true}
			rightIcon="tune"
			showRightIcon={true}
			onRightIconPress={() => router.push("/settings/details")}
		>
			{weatherData && (
				<CustomScrollView style={{ width: "100%" }} overScrollMode="never">
					<CurrentSummary
						currentTemperature={weatherData.current.temperature2m ?? 0}
						apparentTemperature={weatherData.current.apparentTemperature ?? 0}
						maxTemperature={weatherData.daily.temperature2mMax?.[0] as number}
						minTemperature={weatherData.daily.temperature2mMin?.[0] as number}
						weatherCode={weatherData.current.weatherCode ?? 0}
						isDay={weatherData.current.isDay ?? 0}
					/>
					<HourlyForecast
						hourlyData={weatherData.hourly}
						dailyData={weatherData.daily}
						selectedDetails={selectedDetails}
						airQualityData={airQualityData}
					/>
					<WeeklyForecast
						weeklyData={weatherData.daily}
						selectedDetails={selectedDetails}
						airQualityData={airQualityData}
					/>
				</CustomScrollView>
			)}
			{!weatherData && errorMsg && (
				<View style={styles.emptyState}>
					<StyledText
						style={[
							styles.emptyStateText,
							{ color: invertColors ? "black" : "white" },
						]}
					>
						{errorMsg}
					</StyledText>
				</View>
			)}
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	emptyState: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
	},
	emptyStateText: {
		fontSize: n(18),
		textAlign: "center",
	},
});
