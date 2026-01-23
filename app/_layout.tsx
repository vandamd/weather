import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { HapticProvider } from "../contexts/HapticContext";
import { useFonts } from "expo-font";
import { setStatusBarHidden } from "expo-status-bar";
import {
	InvertColorsProvider,
	useInvertColors,
} from "@/contexts/InvertColorsContext";
import { UnitsProvider } from "@/contexts/UnitsContext";
import { CurrentLocationProvider } from "@/contexts/CurrentLocationContext";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";

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
			<Stack.Screen name="search" />
			<Stack.Screen name="settings" />
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
			<UnitsProvider>
				<CurrentLocationProvider>
					<HapticProvider>
						<RootNavigation />
					</HapticProvider>
				</CurrentLocationProvider>
			</UnitsProvider>
		</InvertColorsProvider>
	);
}
