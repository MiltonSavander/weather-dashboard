import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 59.4542592,
  longitude: 18.087936,
  hourly: "temperature_2m",
  daily: "weather_code,temperature_2m_max,temperature_2m_min",
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

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
  hourly: {
    time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
      (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    ),
    temperature2m: hourly.variables(0)!.valuesArray()!,
  },
};

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const now = new Date();
now.setHours(now.getHours() - 1);

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < 24 + now.getHours(); i++) {
  const time = weatherData.hourly.time[i];
  if (time > now) {
    const formattedTime = formatter.format(time);
    console.log(formattedTime, Math.round(weatherData.hourly.temperature2m[i]));
  }
}
