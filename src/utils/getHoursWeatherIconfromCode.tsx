import { JSX } from "react";
import getIconName from "./getIconName";

export default function getHoursWeatherIconfromCode(
  code: number,
  isDay: boolean = true
): JSX.Element {
  const iconName = getIconName(code, isDay);
  return (
    <img
      src={`/weatherCodeIcons/${iconName}.svg`}
      alt={iconName}
      className="w-10 h-10"
    />
  );
}
