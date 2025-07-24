import React from "react";
import DailyForcast from "./DailyForcast";
import { WeatherByDay } from "@/utils/types";

function DailyForcastsContainer({ weatherDailyArray }: { weatherDailyArray: WeatherByDay[] }) {
  return (
    <div className="w-full flex flex-col gap-2 ">
      {weatherDailyArray.map((item, index) => (
        <DailyForcast
          key={index}
          index={index}
          weatherByDay={item}
        />
      ))}
    </div>
  );
}

export default DailyForcastsContainer;
