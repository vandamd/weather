import { Stack } from "expo-router";

export default function SettingsLayout() {
	return (
		<Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
			<Stack.Screen name="temperature-unit" />
			<Stack.Screen name="wind-speed-unit" />
			<Stack.Screen name="precipitation-unit" />
		</Stack>
	);
}
