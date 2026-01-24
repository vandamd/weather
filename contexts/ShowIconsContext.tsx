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

interface ShowIconsContextType {
	showIcons: boolean;
	setShowIcons: (value: boolean) => void;
}

const ShowIconsContext = createContext<ShowIconsContextType>({
	showIcons: true,
	setShowIcons: () => {},
});

export const useShowIcons = () => useContext(ShowIconsContext);

export const ShowIconsProvider = ({ children }: { children: ReactNode }) => {
	const [showIcons, setShowIconsState] = useState(true);

	useEffect(() => {
		AsyncStorage.getItem("showIcons").then((value) => {
			if (value !== null) {
				setShowIconsState(value === "true");
			}
		});
	}, []);

	const setShowIcons = useCallback(async (value: boolean) => {
		setShowIconsState(value);
		await AsyncStorage.setItem("showIcons", value.toString());
	}, []);

	const value = useMemo(
		() => ({ showIcons, setShowIcons }),
		[showIcons, setShowIcons]
	);

	return (
		<ShowIconsContext.Provider value={value}>
			{children}
		</ShowIconsContext.Provider>
	);
};
