import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	useCallback,
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

	const toggleDetail = useCallback(async (detail: WeatherDetail) => {
		setSelectedDetails((prev) => {
			const isSelected = prev.includes(detail);
			let newDetails: WeatherDetail[];

			if (isSelected) {
				if (prev.length === 1) return prev;
				newDetails = prev.filter((d) => d !== detail);
			} else {
				if (prev.length >= MAX_DETAILS) return prev;
				newDetails = [...prev, detail];
			}

			AsyncStorage.setItem("selectedDetails", JSON.stringify(newDetails));
			return newDetails;
		});
	}, []);

	const isDetailSelected = useCallback((detail: WeatherDetail) => {
		return selectedDetails.includes(detail);
	}, [selectedDetails]);

	const reorderDetail = useCallback(async (detail: WeatherDetail, direction: "up" | "down") => {
		setSelectedDetails((prev) => {
			const currentIndex = prev.indexOf(detail);
			if (currentIndex === -1) return prev;

			const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
			if (newIndex < 0 || newIndex >= prev.length) return prev;

			const newDetails = [...prev];
			[newDetails[currentIndex], newDetails[newIndex]] = [newDetails[newIndex], newDetails[currentIndex]];

			AsyncStorage.setItem("selectedDetails", JSON.stringify(newDetails));
			return newDetails;
		});
	}, []);

	const value = useMemo(
		() => ({ selectedDetails, toggleDetail, isDetailSelected, reorderDetail }),
		[selectedDetails, toggleDetail, isDetailSelected, reorderDetail]
	);

	return (
		<DetailsContext.Provider value={value}>
			{children}
		</DetailsContext.Provider>
	);
};
