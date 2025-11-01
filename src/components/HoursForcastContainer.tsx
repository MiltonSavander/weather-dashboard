"use client";
import React from "react";
import HourForcast from "./HourForcast";
import { WeatherByHour, WeatherByDay } from "@/utils/types";

interface HoursForcastContainerProps {
  weatherHourArray: WeatherByHour[];
  weatherDailyArray: WeatherByDay[];
}

function HoursForcastContainer({
  weatherHourArray,
  weatherDailyArray,
}: HoursForcastContainerProps) {
  return (
    <div className="flex gap-2 ">
      {weatherHourArray.map((weather, index) => (
        <HourForcast
          key={index}
          time={weather.time}
          weatherCode={weather.weatherCode}
          temp={weather.temp}
          sunset={weatherDailyArray[0].sunset}
          sunrise={weatherDailyArray[0].sunrise}
        />
      ))}
    </div>
  );
}

export default HoursForcastContainer;
