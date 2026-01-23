import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DisplayMode = "standard" | "compact" | "comfortable";

interface DisplayModeContextType {
    displayMode: DisplayMode;
    setDisplayMode: (value: DisplayMode) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType>({
    displayMode: "standard",
    setDisplayMode: () => {},
});

export const useDisplayMode = () => useContext(DisplayModeContext);

export const DisplayModeProvider = ({ children }: { children: ReactNode }) => {
    const [displayMode, setDisplayModeState] = useState<DisplayMode>("standard");

    useEffect(() => {
        AsyncStorage.getItem("displayMode").then((value) => {
            if (value !== null) {
                setDisplayModeState(value as DisplayMode);
            }
        });
    }, []);

    const setDisplayMode = async (value: DisplayMode) => {
        setDisplayModeState(value);
        await AsyncStorage.setItem("displayMode", value);
    };

    return (
        <DisplayModeContext.Provider value={{ displayMode, setDisplayMode }}>
            {children}
        </DisplayModeContext.Provider>
    );
};
