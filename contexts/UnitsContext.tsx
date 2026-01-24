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

export type TemperatureUnit = "Celsius" | "Fahrenheit";
export type WindSpeedUnit = "km/h" | "m/s" | "mph" | "Knots";
export type PrecipitationUnit = "Millimeter" | "Inch";

interface UnitsContextType {
	temperatureUnit: TemperatureUnit;
	setTemperatureUnit: (unit: TemperatureUnit) => void;
	windSpeedUnit: WindSpeedUnit;
	setWindSpeedUnit: (unit: WindSpeedUnit) => void;
	precipitationUnit: PrecipitationUnit;
	setPrecipitationUnit: (unit: PrecipitationUnit) => void;
	unitsLoaded: boolean;
}

const UnitsContext = createContext<UnitsContextType>({
	temperatureUnit: "Celsius",
	setTemperatureUnit: () => {},
	windSpeedUnit: "km/h",
	setWindSpeedUnit: () => {},
	precipitationUnit: "Millimeter",
	setPrecipitationUnit: () => {},
	unitsLoaded: false,
});

export const useUnits = () => useContext(UnitsContext);

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
	const [temperatureUnit, setTemperatureUnitState] =
		useState<TemperatureUnit>("Celsius");
	const [windSpeedUnit, setWindSpeedUnitState] =
		useState<WindSpeedUnit>("km/h");
	const [precipitationUnit, setPrecipitationUnitState] =
		useState<PrecipitationUnit>("Millimeter");
	const [unitsLoaded, setUnitsLoaded] = useState(false);

	useEffect(() => {
		const loadUnits = async () => {
			try {
				const [tempUnit, windUnit, precipUnit] = await Promise.all([
					AsyncStorage.getItem("temperatureUnit"),
					AsyncStorage.getItem("windSpeedUnit"),
					AsyncStorage.getItem("precipitationUnit"),
				]);

				if (tempUnit !== null) {
					setTemperatureUnitState(tempUnit as TemperatureUnit);
				}
				if (windUnit !== null) {
					setWindSpeedUnitState(windUnit as WindSpeedUnit);
				}
				if (precipUnit !== null) {
					setPrecipitationUnitState(precipUnit as PrecipitationUnit);
				}
			} finally {
				setUnitsLoaded(true);
			}
		};

		loadUnits();
	}, []);

	const setTemperatureUnit = useCallback(async (unit: TemperatureUnit) => {
		setTemperatureUnitState(unit);
		await AsyncStorage.setItem("temperatureUnit", unit);
	}, []);

	const setWindSpeedUnit = useCallback(async (unit: WindSpeedUnit) => {
		setWindSpeedUnitState(unit);
		await AsyncStorage.setItem("windSpeedUnit", unit);
	}, []);

	const setPrecipitationUnit = useCallback(async (unit: PrecipitationUnit) => {
		setPrecipitationUnitState(unit);
		await AsyncStorage.setItem("precipitationUnit", unit);
	}, []);

	const value = useMemo(
		() => ({
			temperatureUnit,
			setTemperatureUnit,
			windSpeedUnit,
			setWindSpeedUnit,
			precipitationUnit,
			setPrecipitationUnit,
			unitsLoaded,
		}),
		[temperatureUnit, setTemperatureUnit, windSpeedUnit, setWindSpeedUnit, precipitationUnit, setPrecipitationUnit, unitsLoaded]
	);

	return (
		<UnitsContext.Provider value={value}>
			{children}
		</UnitsContext.Provider>
	);
};
