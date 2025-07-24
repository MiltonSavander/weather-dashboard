export default function getIconName(code: number, isDay: boolean = true): string {
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
