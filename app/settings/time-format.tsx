import React from "react";
import { StyledButton } from "@/components/StyledButton";
import { router } from "expo-router";
import ContentContainer from "@/components/ContentContainer";
import { useTimeFormat, TimeFormat } from "@/contexts/TimeFormatContext";

export default function TimeFormatScreen() {
	const { timeFormat, setTimeFormat } = useTimeFormat();

	const handleFormatSelect = (format: TimeFormat) => {
		setTimeFormat(format);
		router.back();
	};

	return (
		<ContentContainer headerTitle="Time Format">
			<StyledButton
				text="24 Hour"
				onPress={() => handleFormatSelect("24h")}
				underline={timeFormat === "24h"}
			/>
			<StyledButton
				text="12 Hour (AM/PM)"
				onPress={() => handleFormatSelect("12h")}
				underline={timeFormat === "12h"}
			/>
		</ContentContainer>
	);
}
