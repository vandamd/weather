import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { HapticProvider } from "../contexts/HapticContext";
import { useFonts } from "expo-font";
import { setStatusBarHidden } from "expo-status-bar";
import {
    InvertColorsProvider,
    useInvertColors,
} from "@/contexts/InvertColorsContext";
import { DisplayModeProvider } from "@/contexts/DisplayModeContext";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';


function RootNavigation() {
    const { invertColors } = useInvertColors();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(invertColors ? "white" : "black");
        NavigationBar.setVisibilityAsync("hidden");
    }, [invertColors]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
                contentStyle: {
                    backgroundColor: invertColors ? "white" : "black",
                },
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings/customise" />
            <Stack.Screen name="settings/customise-interface" />
            <Stack.Screen name="settings/display-mode" />
            <Stack.Screen name="confirm" />
        </Stack>
    );
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        "PublicSans-Regular": require("../assets/fonts/PublicSans-Regular.ttf"),
    });

    useEffect(() => {
        setStatusBarHidden(true, "none");
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <InvertColorsProvider>
            <DisplayModeProvider>
                <HapticProvider>
                    <RootNavigation />
                </HapticProvider>
            </DisplayModeProvider>
        </InvertColorsProvider>
    );
}
