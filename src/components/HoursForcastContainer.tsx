"use client";
import React, { useEffect, useState } from "react";
import HourForcast from "./HourForcast";
import { getWeatherByCoords } from "@/utils/getWeatherByCoords";
import { Coords } from "@/utils/types";
import { WeatherByHour, WeatherByDay } from "@/utils/types";

interface HoursForcastContainerProps {
  weatherArray: WeatherByHour[];
  weatherDailyArray: WeatherByDay[];
}

function HoursForcastContainer({ weatherArray, weatherDailyArray }: HoursForcastContainerProps) {
  console.log("this is length of weatherarray", weatherArray.length);
  return (
    <div className="w-full flex gap-5 bg-gray-900">
      {weatherArray.map((weather, index) => (
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
