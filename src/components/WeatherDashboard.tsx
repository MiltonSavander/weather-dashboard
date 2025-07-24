"use client";
import React, { useState, useEffect } from "react";
import Location from "@/components/Location";
import HoursForcastContainer from "@/components/HoursForcastContainer";
import { getUserCoords } from "@/utils/getUserCoords";
import { WeatherByDay, WeatherByHour } from "@/utils/types";
import { getWeatherByCoords } from "@/utils/getWeatherByCoords";
import TempChart from "@/components/TempChart";
import DailyForcastsContainer from "./DailyForcastsContainer";
import LocationSearchBox from "./TestSearch";

type Coords = {
  latitude: number;
  longitude: number;
};

function WeatherDashboard() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [weatherHourArray, setWeatherHourArray] = useState<WeatherByHour[]>([]);
  const [weatherDailyArray, setWeatherDailyArray] = useState<WeatherByDay[]>([]);

  const [foundCoords, setFoundCoords] = useState<true | false>(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const position = await getUserCoords();
        setCoords({
          latitude: position.latitude,
          longitude: position.longitude,
        });
        setFoundCoords(true);
        console.log("position", position);
      } catch (err: unknown) {
        console.error("Failed to getUserCoords", err);
      }
    };

    fetchCoords();
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        if (coords !== null) {
          const res = await fetch(
            `/api/reverse-geocode?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();

          const properties = data.features?.[0]?.properties?.geocoding;

          const locationName =
            properties.city ||
            properties.town ||
            properties.village ||
            properties.hamlet ||
            properties.state ||
            properties.country ||
            "Unknown location";

          setUserCity(locationName);
          console.log("hello", data);
        }
      } catch (err: unknown) {
        setUserCity("Could not find location");
        console.error("Failed to get city from coords", err);
      }
    };
    fetchCity();
  }, [foundCoords]);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const [hourWeather, dailyWeather] = await getWeatherByCoords(
            coords.latitude,
            coords.longitude,
            24
          );
          setWeatherHourArray(hourWeather);
          setWeatherDailyArray(dailyWeather);
          console.log(hourWeather);
        } catch (err: unknown) {
          console.error("Failed to get weather by coords", err);
        }
      };
      fetchWeather();
    }
  }, [coords]);

  useEffect(() => {
    const container = document.getElementById("scrollable-container");
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // Let browser handle horizontal (e.g., shift+wheel or touchpad)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault(); // prevent vertical scroll
      container.scrollLeft += e.deltaY; // native feel, no smooth animation
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    console.log("Selected:", { lat, lon, name });
    setCoords({ latitude: lat, longitude: lon });
  };

  return (
    <div className="w-full max-w-7xl bg-card rounded-2xl p-8 flex flex-col items-start gap-2 ">
      {/* <Location
        setCoords={setCoords}
        userCity={userCity}
        setUserCity={setUserCity}
      /> */}
      <LocationSearchBox
        onSelectLocation={handleLocationSelect}
        userCity={userCity}
      />
      <hr className=" bg-amber-500" />
      <div
        className="scrollable-container scroll-smooth w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-track-card scrollbar-thumb-card-info"
        id="scrollable-container"
      >
        <div className="wrapper min-w-max">
          <div className="flex flex-col gap-4 w-max">
            <HoursForcastContainer
              weatherHourArray={weatherHourArray}
              weatherDailyArray={weatherDailyArray}
            />
            <TempChart weatherHourArray={weatherHourArray} />
          </div>
        </div>
      </div>
      <DailyForcastsContainer weatherDailyArray={weatherDailyArray} />
    </div>
  );
}

export default WeatherDashboard;
