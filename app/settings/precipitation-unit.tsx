import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useUnits, PrecipitationUnit } from "@/contexts/UnitsContext";

export default function PrecipitationUnitScreen() {
	const { precipitationUnit, setPrecipitationUnit } = useUnits();

	const handleUnitSelect = (unit: PrecipitationUnit) => {
		setPrecipitationUnit(unit);
		router.back();
	};

	const units: PrecipitationUnit[] = ["Millimeter", "Inch"];

	return (
		<ContentContainer headerTitle="Precipitation Unit">
			{units.map((unit) => (
				<StyledButton
					key={unit}
					text={unit}
					onPress={() => handleUnitSelect(unit)}
					underline={precipitationUnit === unit}
				/>
			))}
		</ContentContainer>
	);
}
