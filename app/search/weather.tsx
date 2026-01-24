import React from "react";
import ContentContainer from "@/components/ContentContainer";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { getWeatherData, WeatherData } from "@/utils/weather";
import { getAirQualityData, AirQualityData } from "@/utils/airQuality";
import { Text, StyleSheet, View, AppState, AppStateStatus } from "react-native";
import CurrentSummary from "@/components/CurrentSummary";
import HourlyForecast from "@/components/HourlyForecast";
import WeeklyForecast from "@/components/WeeklyForecast";
import {
    SavedLocation,
    saveLocation,
    removeLocation,
    isLocationSaved,
} from "@/utils/savedLocations";
import { MaterialIcons } from "@expo/vector-icons";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { useUnits } from "@/contexts/UnitsContext";
import { useDetails } from "@/contexts/DetailsContext";
import CustomScrollView from "@/components/CustomScrollView";
import { n } from "@/utils/scaling";
import { formatLocationName } from "@/utils/formatting";

export default function LocationWeatherScreen() {
    const units = useUnits();
    const { selectedDetails } = useDetails();
    const params = useLocalSearchParams<{
        latitude?: string;
        longitude?: string;
        name?: string;
        admin1?: string;
        country?: string;
        id?: string;
    }>();

    const { invertColors } = useInvertColors();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
    const [locationName, setLocationName] = useState<string>("");
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [currentLocationId, setCurrentLocationId] = useState<number | null>(
        null
    );
    const appState = useRef(AppState.currentState);

    const fetchWeather = useCallback(async () => {
        if (!units.unitsLoaded) {
            return;
        }

        const latStr = params.latitude;
        const lonStr = params.longitude;
        const lat = parseFloat(latStr ?? "0");
        const lon = parseFloat(lonStr ?? "0");

        if (lat && lon) {
            setErrorMsg(null);
            try {
                const [weatherResult, airQualityResult] = await Promise.all([
                    getWeatherData(
                        lat,
                        lon,
                        units.temperatureUnit,
                        units.windSpeedUnit,
                        units.precipitationUnit
                    ),
                    getAirQualityData(lat, lon),
                ]);
                setWeatherData(weatherResult);
                setAirQualityData(airQualityResult);
                if (!weatherResult) {
                    setErrorMsg(
                        "Could not fetch weather data for this location."
                    );
                }
            } catch (error) {
                setErrorMsg("Error fetching weather data");
                console.error("Error fetching weather data:", error);
            }
        } else {
            setErrorMsg("Invalid location coordinates provided.");
        }
    }, [
        params.latitude,
        params.longitude,
        units.temperatureUnit,
        units.windSpeedUnit,
        units.precipitationUnit,
        units.unitsLoaded,
    ]);

    useEffect(() => {
        const name = params.name ?? "Selected Location";
        const country = params.country ?? "";
        const idStr = params.id;

        const displayName = country
            ? formatLocationName({ name, admin1: params.admin1, country })
            : name;
        setLocationName(displayName);

        const id = idStr ? parseInt(idStr, 10) : null;
        setCurrentLocationId(id);

        if (id) {
            isLocationSaved(id).then(setIsSaved);
        }
    }, [params.name, params.admin1, params.country, params.id]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState: AppStateStatus) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    fetchWeather();
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, [fetchWeather]);

    const toggleSaveLocation = async () => {
        if (
            !currentLocationId ||
            !params.name ||
            !params.country ||
            !params.latitude ||
            !params.longitude
        ) {
            console.error("Cannot save/unsave location: Missing data");
            setErrorMsg("Could not save location, essential data missing.");
            return;
        }

        const locationToSave: SavedLocation = {
            id: currentLocationId,
            name: params.name,
            admin1: params.admin1 ?? undefined,
            country: params.country,
            latitude: parseFloat(params.latitude),
            longitude: parseFloat(params.longitude),
        };

        if (isSaved) {
            await removeLocation(currentLocationId);
            setIsSaved(false);
        } else {
            await saveLocation(locationToSave);
            setIsSaved(true);
        }
    };

    const headerTitle = locationName || "Weather Details";
    const headerIconName: keyof typeof MaterialIcons.glyphMap | undefined =
        currentLocationId ? (isSaved ? "star" : "star-border") : undefined;

    return (
        <ContentContainer
            headerTitle={headerTitle}
            hideBackButton={false}
            rightIcon={headerIconName}
            onRightIconPress={currentLocationId ? toggleSaveLocation : undefined}
            showRightIcon={!!currentLocationId}
            style={{ paddingBottom: n(20) }}
        >
            <CustomScrollView
                style={{ width: "100%" }}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
            >
                {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
                {weatherData ? (
                    <View>
                        <CurrentSummary
                            currentTemperature={
                                weatherData.current.temperature2m
                            }
                            apparentTemperature={
                                weatherData.current.apparentTemperature
                            }
                            maxTemperature={
                                weatherData.daily.temperature2mMax?.[0] as number
                            }
                            minTemperature={
                                weatherData.daily.temperature2mMin?.[0] as number
                            }
                            weatherCode={weatherData.current.weatherCode}
                            isDay={weatherData.current.isDay}
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
                    </View>
                ) : (
                    !errorMsg && (
                        <Text
                            style={[
                                styles.loadingText,
                                { color: invertColors ? "black" : "white" },
                            ]}
                            allowFontScaling={false}
                        >
                            Loading weather data...
                        </Text>
                    )
                )}
            </CustomScrollView>
        </ContentContainer>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: "red",
        textAlign: "center",
        marginVertical: n(20),
        fontSize: n(16),
        fontFamily: "PublicSans-Regular",
    },
    loadingText: {
        textAlign: "center",
        marginVertical: n(20),
        fontSize: n(16),
        fontFamily: "PublicSans-Regular",
    },
});
