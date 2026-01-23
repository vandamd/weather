import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useUnits, WindSpeedUnit } from "@/contexts/UnitsContext";

export default function WindSpeedUnitScreen() {
	const { windSpeedUnit, setWindSpeedUnit } = useUnits();

	const handleUnitSelect = (unit: WindSpeedUnit) => {
		setWindSpeedUnit(unit);
		router.back();
	};

	const units: WindSpeedUnit[] = ["km/h", "m/s", "mph", "Knots"];

	return (
		<ContentContainer headerTitle="Wind Speed Unit">
			{units.map((unit) => (
				<StyledButton
					key={unit}
					text={unit}
					onPress={() => handleUnitSelect(unit)}
					underline={windSpeedUnit === unit}
				/>
			))}
		</ContentContainer>
	);
}
