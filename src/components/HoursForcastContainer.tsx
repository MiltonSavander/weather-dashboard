"use client";
import React, { useEffect, useState } from "react";
import HourForcast from "./HourForcast";
import { getWeatherByCoords } from "@/utils/getWeatherByCoords";
import { Coords } from "@/utils/types";
import { WeatherByHour } from "@/utils/types";

function HoursForcastContainer({ coords }: { coords: Coords | null }) {
  const [weatherArray, setWeatherArray] = useState<WeatherByHour[]>([]);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const weather = await getWeatherByCoords(coords.latitude, coords.longitude, 15);
          setWeatherArray(weather);
          console.log(weather);
        } catch (err: any) {
          console.error("Failed to get weather by coords", err);
        }
      };
      fetchWeather();
    }
  }, [coords]);
  return (
    <div className="w-full flex gap-5 bg-gray-900">
      {weatherArray.map((weather, index) => (
        <HourForcast
          key={index}
          time={weather.time}
          weatherCode={weather.weatherCode}
          temp={weather.temp}
        />
      ))}
    </div>
  );
}

export default HoursForcastContainer;
