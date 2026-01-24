import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useUnits, TemperatureUnit } from "@/contexts/UnitsContext";

export default function TemperatureUnitScreen() {
	const { temperatureUnit, setTemperatureUnit } = useUnits();

	const handleUnitSelect = (unit: TemperatureUnit) => {
		setTemperatureUnit(unit);
		router.back();
	};

	return (
		<ContentContainer headerTitle="Temperature Unit">
			<StyledButton
				text="Celsius"
				onPress={() => handleUnitSelect("Celsius")}
				underline={temperatureUnit === "Celsius"}
			/>
			<StyledButton
				text="Fahrenheit"
				onPress={() => handleUnitSelect("Fahrenheit")}
				underline={temperatureUnit === "Fahrenheit"}
			/>
		</ContentContainer>
	);
}
