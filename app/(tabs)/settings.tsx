import ContentContainer from "@/components/ContentContainer";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useInvertColors } from "@/contexts/InvertColorsContext";
import { SelectorButton } from "@/components/SelectorButton";
import { useUnits } from "@/contexts/UnitsContext";
import * as Application from "expo-application";

export default function SettingsScreen() {
	const { invertColors, setInvertColors } = useInvertColors();
	const { temperatureUnit, windSpeedUnit, precipitationUnit } = useUnits();
	const version = Application.nativeApplicationVersion;

	return (
		<ContentContainer
			headerTitle={`Weather Settings (v${version})`}
			hideBackButton={true}
			style={{ gap: 20 }}
		>
			<SelectorButton
				label="Temperature Unit"
				value={temperatureUnit}
				valueChangePage="/settings/temperature-unit"
			/>
			<SelectorButton
				label="Wind Speed Unit"
				value={windSpeedUnit}
				valueChangePage="/settings/wind-speed-unit"
			/>
			<SelectorButton
				label="Precipitation Unit"
				value={precipitationUnit}
				valueChangePage="/settings/precipitation-unit"
			/>
			<ToggleSwitch
				value={invertColors}
				label="Invert Colours"
				onValueChange={setInvertColors}
			/>
		</ContentContainer>
	);
}
