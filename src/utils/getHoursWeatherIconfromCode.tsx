import { JSX } from "react";

export default function getHoursWeatherIconfromCode(
  code: number,
  time: string,
  sunset: string,
  sunrise: string
): JSX.Element {
  const iconName = getIconName(code, isDay(time, sunset, sunrise));
  return (
    <img
      src={`/weatherCodeIcons/${iconName}.svg`}
      alt={iconName}
      className="w-10 h-10"
    />
  );
}

function isDay(time: string, sunset: string, sunrise: string): boolean {
  // Convert "HH:mm" to minutes since midnight
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const timeMin = toMinutes(time);
  const sunriseMin = toMinutes(sunrise);
  const sunsetMin = toMinutes(sunset);

  // Handles normal and overnight sunrise/sunset (e.g., polar regions)
  if (sunriseMin < sunsetMin) {
    return timeMin >= sunriseMin && timeMin < sunsetMin;
  } else {
    // If sunrise is after sunset (rare, but possible in some locations/seasons)
    return timeMin >= sunriseMin || timeMin < sunsetMin;
  }
}

function getIconName(code: number, isDay: boolean): string {
  const day = isDay ? "day" : "night";

  if (code === 0) return `clear-${day}`;
  if (code === 1) return `partly-cloudy-${day}`;
  if (code === 2) return `partly-cloudy-${day}`;
  if (code === 3) return `overcast-${day}`;

  if (code === 45 || code === 48) return `fog-${day}`;

  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";

  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";

  if ([95, 96].includes(code)) return "sleet"; // sleet as a general thunder-rain alt

  if (code === 99) return "thunderstorms-snow";

  return "overcast-day"; // fallback/default
}
