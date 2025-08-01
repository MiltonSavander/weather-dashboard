"use client";
import React, { useState } from "react";

const cities = [
  { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
  { name: "Gothenburg", lat: 57.7089, lon: 11.9746 },
  { name: "Malmö", lat: 55.604981, lon: 13.003822 },
  { name: "Uppsala", lat: 59.8586, lon: 17.6389 },
];

interface LocationProps {
  setCoords: (coords: { latitude: number; longitude: number }) => void;
  userCity: string | null;
  setUserCity: (city: string) => void;
}

function Location({ setCoords, userCity, setUserCity }: LocationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCitySelect = (city: { name: string; lat: number; lon: number }) => {
    setUserCity(city.name);
    setCoords({ latitude: city.lat, longitude: city.lon });
    setDropdownOpen(false);
  };

  return (
    <div className="h-10 w-full bg-card-info rounded-lg flex justify-between items-center">
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
          className="bg-card px-2 py-1 rounded-3xl hover:bg-gray-200"
        >
          ...
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
