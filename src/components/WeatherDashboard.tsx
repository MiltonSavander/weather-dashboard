"use client";
import React, { useState, useEffect } from "react";
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
  const [userCity, setUserCity] = useState<string>("null");
  const [weatherHourArray, setWeatherHourArray] = useState<WeatherByHour[]>([]);
  const [weatherDailyArray, setWeatherDailyArray] = useState<WeatherByDay[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [query, setQuery] = useState("");

  const [foundCoords, setFoundCoords] = useState<true | false>(false);

  const fetchCoords = async () => {
    try {
      const position = await getUserCoords();
      setCoords({
        latitude: position.latitude,
        longitude: position.longitude,
      });
      setFoundCoords(true);
      console.log("position", position);
    } catch (err) {
      console.error("Failed to getUserCoords", err);
    }
  };

  useEffect(() => {
    fetchCoords();
  }, []);

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
    } catch (err) {
      setUserCity("Could not find location");
      console.error("Failed to get city from coords", err);
    }
  };

  useEffect(() => {
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
        } catch (err) {
          console.error("Failed to get weather by coords", err);
        }
      };
      fetchWeather();
    }
  }, [coords]);

  // manages sroll function on desctop for hour forcast
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

  const handleOnClick = () => {
    fetchCoords();
    setCurrentLocation(userCity);
    setQuery("");
    console.log("userCity", userCity);
  };

  return (
    <div className="w-full max-w-7xl bg-card rounded-2xl p-8 flex flex-col items-start gap-2 ">
      <div className="w-full flex justify-center items-center gap-4">
        <LocationSearchBox
          onSelectLocation={handleLocationSelect}
          userCity={userCity}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          query={query}
          setQuery={setQuery}
        />
        <div>
          <button
            className="h-[42px] w-[42px] bg-card-info cursor-pointer hover:bg-highlight select-none flex justify-center items-center border border-card-info rounded-full"
            onClick={handleOnClick}
          >
            <img
              className="size-8"
              src="/location-icon.svg"
              alt="location icon"
            />
          </button>
        </div>
      </div>
      <hr className="h-[2px] w-full my-2 bg-card-info border-0" />
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
