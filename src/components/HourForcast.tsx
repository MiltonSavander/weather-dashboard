import getHoursWeatherIconfromCode from "@/utils/getHoursWeatherIconfromCode";
import isDay from "@/utils/isDay";
import { WeatherByHour } from "@/utils/types";
import React from "react";

type HourForecastProps = WeatherByHour & { sunset: string; sunrise: string };

function HourForcast({ time, weatherCode, temp, sunset, sunrise }: HourForecastProps) {
  return (
    <div className="flex flex-col p-2 w-[58px] rounded-sm items-center bg-card-info">
      <div>{time}</div>
      {getHoursWeatherIconfromCode(weatherCode, isDay(time, sunset, sunrise))}
      <div>{temp}°C</div>
    </div>
  );
}

export default HourForcast;
