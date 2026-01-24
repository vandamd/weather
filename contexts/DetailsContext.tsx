import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WEATHER_DETAILS = [
	"Temp",
	"Feels Like",
	"Precip Chance",
	"Precip Amount",
	"Wind Speed",
	"Wind Gusts",
	"UV Index",
	"Humidity",
	"Dew Point",
	"Cloud Cover",
	"Visibility",
	"Pressure",
	"AQI (US)",
	"AQI (EU)",
	"PM2.5",
	"PM10",
] as const;

export const MAX_DETAILS = 3;

export type WeatherDetail = (typeof WEATHER_DETAILS)[number];

export const DETAIL_SHORTHANDS: Record<WeatherDetail, string> = {
	"Temp": "T",
	"Feels Like": "FL",
	"Precip Chance": "P",
	"Precip Amount": "PA",
	"Wind Speed": "W",
	"Wind Gusts": "G",
	"UV Index": "UV",
	"Humidity": "H",
	"Dew Point": "DP",
	"Cloud Cover": "C",
	"Visibility": "V",
	"Pressure": "PR",
	"AQI (US)": "AQI",
	"AQI (EU)": "AQI",
	"PM2.5": "PM",
	"PM10": "PM",
};

interface DetailsContextType {
	selectedDetails: WeatherDetail[];
	toggleDetail: (detail: WeatherDetail) => void;
	isDetailSelected: (detail: WeatherDetail) => boolean;
	reorderDetail: (detail: WeatherDetail, direction: "up" | "down") => void;
}

const DEFAULT_DETAILS: WeatherDetail[] = ["Temp", "Feels Like", "Precip Chance"];

const DetailsContext = createContext<DetailsContextType>({
	selectedDetails: DEFAULT_DETAILS,
	toggleDetail: () => {},
	isDetailSelected: () => false,
	reorderDetail: () => {},
});

export const useDetails = () => useContext(DetailsContext);

export const DetailsProvider = ({ children }: { children: ReactNode }) => {
	const [selectedDetails, setSelectedDetails] =
		useState<WeatherDetail[]>(DEFAULT_DETAILS);

	useEffect(() => {
		AsyncStorage.getItem("selectedDetails").then((value) => {
			if (value !== null) {
				const parsed = JSON.parse(value) as WeatherDetail[];
				if (parsed.length > 0) {
					setSelectedDetails(parsed);
				}
			}
		});
	}, []);

	const toggleDetail = async (detail: WeatherDetail) => {
		const isSelected = selectedDetails.includes(detail);
		let newDetails: WeatherDetail[];

		if (isSelected) {
			// Don't allow deselecting if it's the only one
			if (selectedDetails.length === 1) {
				return;
			}
			newDetails = selectedDetails.filter((d) => d !== detail);
		} else {
			// Don't allow selecting more than MAX_DETAILS
			if (selectedDetails.length >= MAX_DETAILS) {
				return;
			}
			newDetails = [...selectedDetails, detail];
		}

		setSelectedDetails(newDetails);
		await AsyncStorage.setItem("selectedDetails", JSON.stringify(newDetails));
	};

	const isDetailSelected = (detail: WeatherDetail) => {
		return selectedDetails.includes(detail);
	};

	const reorderDetail = async (detail: WeatherDetail, direction: "up" | "down") => {
		const currentIndex = selectedDetails.indexOf(detail);
		if (currentIndex === -1) return;

		const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		if (newIndex < 0 || newIndex >= selectedDetails.length) return;

		const newDetails = [...selectedDetails];
		[newDetails[currentIndex], newDetails[newIndex]] = [newDetails[newIndex], newDetails[currentIndex]];

		setSelectedDetails(newDetails);
		await AsyncStorage.setItem("selectedDetails", JSON.stringify(newDetails));
	};

	const value = useMemo(
		() => ({ selectedDetails, toggleDetail, isDetailSelected, reorderDetail }),
		[selectedDetails]
	);

	return (
		<DetailsContext.Provider value={value}>
			{children}
		</DetailsContext.Provider>
	);
};
