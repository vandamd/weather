import { createContext, useContext, ReactNode } from "react";
import * as Haptics from "expo-haptics";

const HapticContext = createContext<{
	triggerHaptic: () => void;
}>({
	triggerHaptic: () => {},
});

export const useHaptic = () => useContext(HapticContext);

export const HapticProvider = ({ children }: { children: ReactNode }) => {
	const triggerHaptic = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<HapticContext.Provider value={{ triggerHaptic }}>
			{children}
		</HapticContext.Provider>
	);
};
