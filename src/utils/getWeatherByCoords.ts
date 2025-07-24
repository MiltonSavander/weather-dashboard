import { fetchWeatherApi } from "openmeteo";
import { WeatherByDay, WeatherByHour } from "./types";

export async function getWeatherByCoords(
  lat: number,
  lon: number,
  count: number
): Promise<[WeatherByHour[], WeatherByDay[]]> {
  const params = {
    latitude: lat,
    longitude: lon,
    daily: ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "weathercode"],
    hourly: ["temperature_2m", "weather_code"],
    timezone: "auto",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const hourly = response.hourly()!;
  const daily = response.daily()!;

  const sunrise = daily.variables(2)!;
  const sunset = daily.variables(3)!;

  const resolvedTimezone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
        (_, i) =>
          new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      weather_code: hourly.variables(1)!.valuesArray()!,
    },
    daily: {
      time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature2mMax: daily.variables(0)!.valuesArray()!,
      temperature2mMin: daily.variables(1)!.valuesArray()!,
      sunset: [...Array(sunset.valuesInt64Length())].map((_, i) => {
        const date = new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds - 6900) * 1000);
        return formatter.format(date);
      }),
      sunrise: [...Array(sunrise.valuesInt64Length())].map((_, i) => {
        const date = new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds - 4600) * 1000);
        return formatter.format(date);
      }),
      weatherCode: daily.variables(4)!.valuesArray()!,
    },
  };
  console.log("utcOffset in seconds", utcOffsetSeconds);
  console.log("fosrodah", sunset);
  console.log("this is weatherData", weatherData);

  const now = new Date();
  now.setHours(now.getHours() - 1);

  const weatherHourArray: WeatherByHour[] = [];

  for (let i = now.getHours() - 1; i < count + now.getHours(); i++) {
    const time = weatherData.hourly.time[i];
    if (time > now) {
      const formattedTime = formatter.format(time);
      weatherHourArray.push({
        time: formattedTime,
        temp: Math.round(weatherData.hourly.temperature2m[i]),
        weatherCode: weatherData.hourly.weather_code[i],
      });
    }
  }

  const weatherDailyArray: WeatherByDay[] = [];

  for (let i = 0; i < weatherData.daily.time.length; i++) {
    weatherDailyArray.push({
      tempMax: weatherData.daily.temperature2mMax[i],
      tempMin: weatherData.daily.temperature2mMin[i],
      sunset: weatherData.daily.sunset[i],
      sunrise: weatherData.daily.sunrise[i],
      wetherCode: weatherData.daily.weatherCode[i],
    });
  }

  console.log("this is weatherDailyArray", weatherDailyArray);

  return [weatherHourArray, weatherDailyArray];
}
