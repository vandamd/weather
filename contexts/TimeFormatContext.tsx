import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useMemo,
	useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TimeFormat = "24h" | "12h";

interface TimeFormatContextType {
	timeFormat: TimeFormat;
	setTimeFormat: (format: TimeFormat) => void;
	timeFormatLoaded: boolean;
}

const TimeFormatContext = createContext<TimeFormatContextType>({
	timeFormat: "24h",
	setTimeFormat: () => {},
	timeFormatLoaded: false,
});

export const useTimeFormat = () => useContext(TimeFormatContext);

export const TimeFormatProvider = ({ children }: { children: ReactNode }) => {
	const [timeFormat, setTimeFormatState] = useState<TimeFormat>("24h");
	const [timeFormatLoaded, setTimeFormatLoaded] = useState(false);

	useEffect(() => {
		const loadTimeFormat = async () => {
			try {
				const savedFormat = await AsyncStorage.getItem("timeFormat");
				if (savedFormat !== null) {
					setTimeFormatState(savedFormat as TimeFormat);
				}
			} finally {
				setTimeFormatLoaded(true);
			}
		};

		loadTimeFormat();
	}, []);

	const setTimeFormat = useCallback(async (format: TimeFormat) => {
		setTimeFormatState(format);
		await AsyncStorage.setItem("timeFormat", format);
	}, []);

	const value = useMemo(
		() => ({
			timeFormat,
			setTimeFormat,
			timeFormatLoaded,
		}),
		[timeFormat, setTimeFormat, timeFormatLoaded]
	);

	return (
		<TimeFormatContext.Provider value={value}>
			{children}
		</TimeFormatContext.Provider>
	);
};
