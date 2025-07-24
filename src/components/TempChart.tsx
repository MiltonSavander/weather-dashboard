"use client";
import { WeatherByHour } from "@/utils/types";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "12:00", temperature: 21 },
  { time: "13:00", temperature: 22 },
  { time: "14:00", temperature: 23 },
  { time: "15:00", temperature: 21 },
  { time: "16:00", temperature: 22 },
  { time: "17:00", temperature: 23 },
];

function TempChart({ weatherHourArray }: { weatherHourArray: WeatherByHour[] }) {
  const minTemp = Math.min(...weatherHourArray.map((item) => item.temp));
  const maxTemp = Math.max(...weatherHourArray.map((item) => item.temp));

  return (
    <div className="w-full h-20 mb-4 pl-[26px] pr-[26px] ">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={weatherHourArray}>
          <YAxis
            domain={[minTemp, maxTemp]}
            tick={false}
            axisLine={false}
            width={0}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TempChart;
