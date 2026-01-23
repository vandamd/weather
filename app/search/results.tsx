import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { StyledButton } from "@/components/StyledButton";
import { GeocodingResult, searchLocations } from "@/utils/geocoding";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import CustomScrollView from "@/components/CustomScrollView";
import iso311a2 from "iso-3166-1-alpha-2";
import { n } from "@/utils/scaling";
import { formatLocationName } from "@/utils/formatting";

export default function SearchResultsScreen() {
	const { query } = useLocalSearchParams<{ query?: string }>();
	const [results, setResults] = useState<GeocodingResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { invertColors } = useInvertColors();

	useEffect(() => {
		let canceled = false;

		if (query) {
			const fetchResults = async () => {
				setLoading(true);
				setError(null);
				try {
					const data = await searchLocations(query);
					if (canceled) return;
					if (data.length === 0) {
						setError("No results found for your query.");
					}
					setResults(data);
				} catch (e) {
					if (canceled) return;
					console.error(e);
					setError(
						"Failed to fetch search results. Please try again."
					);
				} finally {
					if (!canceled) {
						setLoading(false);
					}
				}
			};
			fetchResults();
		} else {
			setLoading(false);
			setError("No search query provided.");
		}

		return () => {
			canceled = true;
		};
	}, [query]);

	const handlePressLocation = (location: GeocodingResult) => {
		router.push({
			pathname: "/search/weather",
			params: {
				latitude: location.latitude.toString(),
				longitude: location.longitude.toString(),
				name: location.name,
				admin1: location.admin1 ?? "",
				country: iso311a2.getCountry(location.country_code),
				id: location.id.toString(),
			},
		});
	};

	return (
		<ContentContainer
			headerTitle={`Results for "${query || ""}"`}
			style={{ paddingBottom: n(20) }}
		>
			<CustomScrollView style={styles.container}>
				{loading && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
						allowFontScaling={false}
					>
						Loading...
					</Text>
				)}
				{error && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
						allowFontScaling={false}
					>
						{error}
					</Text>
				)}
				{!loading && !error && results.length === 0 && (
					<Text
						style={[
							styles.messageText,
							{ color: invertColors ? "black" : "white" },
						]}
						allowFontScaling={false}
					>
						No results found.
					</Text>
				)}
				{!loading &&
					!error &&
					results.map((location) => (
						<View key={location.id} style={{ marginBottom: n(16) }}>
							<StyledButton
								text={formatLocationName({
									...location,
									country: iso311a2.getCountry(location.country_code) ?? location.country_code,
								})}
								onPress={() => handlePressLocation(location)}
								fontSize={28}
							/>
						</View>
					))}
			</CustomScrollView>
		</ContentContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	messageText: {
		textAlign: "center",
		fontSize: n(16),
		fontFamily: "PublicSans-Regular",
	},
});
