export type Coords = {
  latitude: number;
  longitude: number;
};

export type WeatherByHour = { time: string; weatherCode: number; temp: number };

export type WeatherByDay = {
  tempMax: number;
  tempMin: number;
  sunset: string;
  sunrise: string;
  wetherCode: number;
};
