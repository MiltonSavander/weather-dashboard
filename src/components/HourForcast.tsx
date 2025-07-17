import { WeatherByHour } from "@/utils/types";
import React from "react";

function HourForcast({ time, weatherCode, temp }: WeatherByHour) {
  return (
    <div className="flex flex-col  items-center bg-gray-700">
      <div>{time}</div>
      <div>{weatherCode}</div>
      <div>{temp}°C</div>
    </div>
  );
}

export default HourForcast;
