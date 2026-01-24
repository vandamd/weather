import { createContext, useContext, useMemo, useCallback, ReactNode } from "react";
import * as Haptics from "expo-haptics";

const HapticContext = createContext<{
	triggerHaptic: () => void;
}>({
	triggerHaptic: () => {},
});

export const useHaptic = () => useContext(HapticContext);

export const HapticProvider = ({ children }: { children: ReactNode }) => {
	const triggerHaptic = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}, []);

	const value = useMemo(() => ({ triggerHaptic }), [triggerHaptic]);

	return (
		<HapticContext.Provider value={value}>
			{children}
		</HapticContext.Provider>
	);
};
