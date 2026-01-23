import { Stack } from "expo-router";

export default function SearchLayout() {
	return (
		<Stack screenOptions={{ headerShown: false, animation: "none" }}>
			<Stack.Screen name="results" />
			<Stack.Screen name="weather" />
		</Stack>
	);
}
