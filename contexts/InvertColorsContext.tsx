import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InvertColorsContextType {
	invertColors: boolean;
	setInvertColors: (value: boolean) => void;
}

const InvertColorsContext = createContext<InvertColorsContextType>({
	invertColors: false,
	setInvertColors: () => {},
});

export const useInvertColors = () => useContext(InvertColorsContext);

export const InvertColorsProvider = ({ children }: { children: ReactNode }) => {
	const [invertColors, setInvertColorsState] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem("invertColors").then((value) => {
			if (value !== null) {
				setInvertColorsState(value === "true");
			}
		});
	}, []);

	const setInvertColors = async (value: boolean) => {
		setInvertColorsState(value);
		await AsyncStorage.setItem("invertColors", value.toString());
	};

	const value = useMemo(
		() => ({ invertColors, setInvertColors }),
		[invertColors]
	);

	return (
		<InvertColorsContext.Provider value={value}>
			{children}
		</InvertColorsContext.Provider>
	);
};
