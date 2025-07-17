"use client";
import React, { useEffect, useState } from "react";
import { getUserCoords } from "@/utils/getUserCoords";

const cities = [
  { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
  { name: "Gothenburg", lat: 57.7089, lon: 11.9746 },
  { name: "Malmö", lat: 55.604981, lon: 13.003822 },
  { name: "Uppsala", lat: 59.8586, lon: 17.6389 },
];

function Location() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      } catch (err: any) {
        console.log("Failed to getUserCoords", err.message);
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
      } catch (err: any) {
        setUserCity("Unknown location");
        console.log("Failed to get city from coords", err);
      }
    };
    fetchCity();
  }, [foundCoords]);

  useEffect(() => {
    if (userCity) {
      console.log(userCity);
    }
  }, [userCity]);

  const handleCitySelect = (city: { name: string; lat: number; lon: number }) => {
    setUserCity(city.name);
    setCoords({ latitude: city.lat, longitude: city.lon });
    setDropdownOpen(false);
  };

  return (
    <div className="h-10 w-full bg-amber-700 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="flex justify-center items-center">
          <img
            className="size-8"
            src="/location-icon.svg"
            alt="location icon"
          />
        </div>
        {userCity && userCity}
      </div>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
        >
          Change
        </button>

        {dropdownOpen && (
          <ul className="absolute right-0 mt-2 bg-white text-black border rounded shadow-md z-10 w-40">
            {cities.map((city) => (
              <li
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Location;
