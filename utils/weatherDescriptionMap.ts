export function getWeatherDescription(weatherCode: number): string {
	if (weatherCode === 0) {
		return "Clear sky";
	}
	if (weatherCode >= 1 && weatherCode <= 3) {
		if (weatherCode === 1) {
			return "Mainly clear";
		}
		if (weatherCode === 2) {
			return "Partly cloudy";
		}
		if (weatherCode === 3) {
			return "Overcast";
		}
	}
	if (weatherCode === 45 || weatherCode === 48) {
		return "Fog";
	}
	if (weatherCode >= 51 && weatherCode <= 55) {
		if (weatherCode === 51) {
			return "Light drizzle";
		}
		if (weatherCode === 53) {
			return "Drizzle";
		}
		if (weatherCode === 55) {
			return "Dense drizzle";
		}
	}
	if (weatherCode === 56 || weatherCode === 57) {
		if (weatherCode === 56) {
			return "Light freezing drizzle";
		}
		if (weatherCode === 57) {
			return "Dense freezing drizzle";
		}
	}
	if (weatherCode >= 61 && weatherCode <= 65) {
		if (weatherCode === 61) {
			return "Light rain";
		}
		if (weatherCode === 63) {
			return "Rain";
		}
		if (weatherCode === 65) {
			return "Heavy rain";
		}
	}
	if (weatherCode === 66 || weatherCode === 67) {
		if (weatherCode === 66) {
			return "Light freezing rain";
		}
		if (weatherCode === 67) {
			return "Heavy freezing rain";
		}
	}
	if (weatherCode >= 71 && weatherCode <= 75) {
		if (weatherCode === 71) {
			return "Light snow fall";
		}
		if (weatherCode === 73) {
			return "Snow fall";
		}
		if (weatherCode === 75) {
			return "Heavy snow fall";
		}
	}
	if (weatherCode === 77) {
		return "Snow grains";
	}
	if (weatherCode >= 80 && weatherCode <= 82) {
		if (weatherCode === 80) {
			return "Light rain showers";
		}
		if (weatherCode === 81) {
			return "Rain showers";
		}
		if (weatherCode === 82) {
			return "Violent rain showers";
		}
	}
	if (weatherCode === 85 || weatherCode === 86) {
		if (weatherCode === 85) {
			return "Snow showers";
		}
		if (weatherCode === 86) {
			return "Heavy snow showers";
		}
	}
	if (weatherCode === 95) {
		return "Thunderstorm";
	}
	if (weatherCode === 96 || weatherCode === 99) {
		if (weatherCode === 96) {
			return "Thunderstorm, hail";
		}
		if (weatherCode === 99) {
			return "Thunderstorm, hail";
		}
	}
	return "Unknown weather";
}
