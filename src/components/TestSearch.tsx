import React, { useState, useEffect, useRef } from "react";

type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function LocationSearchBox({
  onSelectLocation,
  userCity,
}: {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  userCity: string | null;
}) {
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 3 || query === selectedValue) {
      setSuggestions([]);
      setHighlightIndex(-1);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5`
        );
        const data: LocationSuggestion[] = await response.json();
        setSuggestions(data);
        setHighlightIndex(-1);
      } catch (error) {
        console.error("Failed to fetch location suggestions", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    setSelectedValue(suggestion.display_name);
    setQuery(suggestion.display_name);
    setCurrentLocation(suggestion.display_name);
    setSuggestions([]);
    setHighlightIndex(-1);
    onSelectLocation(Number(suggestion.lat), Number(suggestion.lon), suggestion.display_name);

    if (inputRef.current) {
      inputRef.current.blur(); // this removes focus from the input
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(null);
    setQuery(e.target.value);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSelect(suggestions[highlightIndex]);
      } else {
        // If no highlight, select top suggestion
        handleSelect(suggestions[0]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Move highlight down and wrap around
      const nextIndex = (highlightIndex + 1) % suggestions.length;
      setHighlightIndex(nextIndex);
      setQuery(suggestions[nextIndex].display_name);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys, arrows, etc.
      if (
        e.key.length === 1 && // Only normal characters
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        if (inputRef.current !== document.activeElement) {
          e.preventDefault(); // prevent unwanted actions
          inputRef.current?.focus();

          // Insert the pressed key into the input value
          setQuery((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="relative w-full flex gap-4">
      <input
        ref={inputRef}
        type="text"
        className="w-80 border border-gray-300 rounded p-2"
        placeholder={currentLocation ? currentLocation : userCity ? userCity : "Search location..."}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setQuery("");
          setSelectedValue(null);
          setSuggestions([]);
          setHighlightIndex(-1);
        }}
        autoComplete="off"
      />
      <div className="flex justify-center items-center">
        <img
          className="size-8"
          src="/location-icon.svg"
          alt="location icon"
        />
      </div>
      {loading && (
        <div className="absolute w-80 top-full text-black left-0 right-0 bg-white p-2">
          Loading...
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute w-80 top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto z-10">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className={`p-2 text-black cursor-pointer ${
                idx === highlightIndex ? "bg-blue-200" : "hover:bg-gray-200"
              }`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightIndex(idx)} // highlight on hover
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
