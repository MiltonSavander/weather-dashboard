import getHoursWeatherIconfromCode from "@/utils/getHoursWeatherIconfromCode";
import { WeatherByHour } from "@/utils/types";
import React from "react";

type HourForecastProps = WeatherByHour & { sunset: string; sunrise: string };

function HourForcast({ time, weatherCode, temp, sunset, sunrise }: HourForecastProps) {
  return (
    <div className="flex flex-col w-[40px] items-center bg-gray-700">
      <div>{time}</div>
      {getHoursWeatherIconfromCode(weatherCode, time, sunset, sunrise)}
      <div>{temp}°C</div>
    </div>
  );
}

export default HourForcast;
