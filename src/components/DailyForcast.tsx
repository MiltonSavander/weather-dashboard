import getHoursWeatherIconfromCode from "@/utils/getHoursWeatherIconfromCode";
import { WeatherByDay } from "@/utils/types";
import React from "react";

function DailyForcast({ index, weatherByDay }: { index: number; weatherByDay: WeatherByDay }) {
  const day = new Date();
  const weekday = new Intl.DateTimeFormat(navigator.language, { weekday: "short" }).format(
    day.setDate(day.getDate() + index)
  );

  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" });
  const todayLabel = rtf.format(0, "day");
  const todayLabelFirstLetterUpper = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);
  return (
    <div className="flex flex-row justify-between items-center p-1 pr-4 pl-4 rounded-2xl bg-card-info">
      <div>{index === 0 ? todayLabelFirstLetterUpper : weekday}</div>
      <div className="flex items-center gap-2">
        {getHoursWeatherIconfromCode(weatherByDay.wetherCode)}
        <div>{Math.round(weatherByDay.tempMax)}°</div>
        <div>{Math.round(weatherByDay.tempMin)}°</div>
      </div>
    </div>
  );
}

export default DailyForcast;
