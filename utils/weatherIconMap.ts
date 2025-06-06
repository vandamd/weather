import { SvgProps } from "react-native-svg";
import React from "react";

import DaySunny from "@/assets/weather/wi-day-sunny.svg";
import DaySunnyOvercast from "@/assets/weather/wi-day-sunny-overcast.svg";
import DayFog from "@/assets/weather/wi-day-fog.svg";
import DaySprinkle from "@/assets/weather/wi-day-sprinkle.svg";
import DaySleet from "@/assets/weather/wi-day-sleet.svg";
import DayRain from "@/assets/weather/wi-day-rain.svg";
import DayRainMix from "@/assets/weather/wi-day-rain-mix.svg";
import DaySnow from "@/assets/weather/wi-day-snow.svg";
import DaySnowWind from "@/assets/weather/wi-day-snow-wind.svg";
import DayShowers from "@/assets/weather/wi-day-showers.svg";
import DayThunderstorm from "@/assets/weather/wi-day-thunderstorm.svg";
import DaySnowThunderstorm from "@/assets/weather/wi-day-snow-thunderstorm.svg";
import NightClear from "@/assets/weather/wi-night-clear.svg";
import NightPartlyCloudy from "@/assets/weather/wi-night-partly-cloudy.svg";
import PartlyCloudy from "@/assets/weather/wi-cloud.svg";
import Overcast from "@/assets/weather/wi-cloudy.svg";
import NightFog from "@/assets/weather/wi-night-fog.svg";
import NightSprinkle from "@/assets/weather/wi-night-sprinkle.svg";
import NightSleet from "@/assets/weather/wi-night-sleet.svg";
import NightRain from "@/assets/weather/wi-night-rain.svg";
import NightRainMix from "@/assets/weather/wi-night-rain-mix.svg";
import NightSnow from "@/assets/weather/wi-night-snow.svg";
import NightSnowWind from "@/assets/weather/wi-night-snow-wind.svg";
import NightShowers from "@/assets/weather/wi-night-showers.svg";
import NightThunderstorm from "@/assets/weather/wi-night-thunderstorm.svg";
import NightSnowThunderstorm from "@/assets/weather/wi-night-snow-thunderstorm.svg";

export type WeatherIconType = React.FC<SvgProps>;

export function getWeatherIcon(
	weatherCode: number,
	isDay: number
): WeatherIconType {
	const day = isDay === 1;

	// 0: Clear sky
	if (weatherCode === 0) {
		return day ? DaySunny : NightClear;
	}

	// 1, 2, 3: Mainly clear, partly cloudy, and overcast
	if (weatherCode >= 1 && weatherCode <= 3) {
		if (weatherCode === 1) {
			// Mainly clear
			return day ? DaySunnyOvercast : NightPartlyCloudy;
		}
		if (weatherCode === 2) {
			// Partly cloudy
			return PartlyCloudy;
		}
		if (weatherCode === 3) {
			// Overcast
			return Overcast;
		}
	}

	// 45, 48: Fog and depositing rime fog
	if (weatherCode === 45 || weatherCode === 48) {
		return day ? DayFog : NightFog;
	}

	// 51, 53, 55: Drizzle: Light, moderate, and dense intensity
	if (weatherCode >= 51 && weatherCode <= 55) {
		return day ? DaySprinkle : NightSprinkle;
	}

	// 56, 57: Freezing Drizzle: Light and dense intensity
	if (weatherCode === 56 || weatherCode === 57) {
		return day ? DaySleet : NightSleet;
	}

	// 61, 63, 65: Rain: Slight, moderate and heavy intensity
	if (weatherCode >= 61 && weatherCode <= 65) {
		return day ? DayRain : NightRain;
	}

	// 66, 67: Freezing Rain: Light and heavy intensity
	if (weatherCode === 66 || weatherCode === 67) {
		return day ? DayRainMix : NightRainMix;
	}

	// 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
	if (weatherCode >= 71 && weatherCode <= 75) {
		return day ? DaySnow : NightSnow;
	}

	// 77: Snow grains
	if (weatherCode === 77) {
		return day ? DaySnowWind : NightSnowWind;
	}

	// 80, 81, 82: Rain showers: Slight, moderate, and violent
	if (weatherCode >= 80 && weatherCode <= 82) {
		return day ? DayShowers : NightShowers;
	}

	// 85, 86: Snow showers slight and heavy
	if (weatherCode === 85 || weatherCode === 86) {
		return day ? DaySnow : NightSnow;
	}

	// 95: Thunderstorm: Slight or moderate
	if (weatherCode === 95) {
		return day ? DayThunderstorm : NightThunderstorm;
	}

	// 96, 99: Thunderstorm with slight and heavy hail
	if (weatherCode === 96 || weatherCode === 99) {
		return day ? DaySnowThunderstorm : NightSnowThunderstorm;
	}

	// Fallback for unknown codes
	return DaySunny;
}
