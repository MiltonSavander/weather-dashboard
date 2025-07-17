import React from "react";
import Location from "@/components/Location";

function WeatherDashboard() {
  return (
    <main className="w-7xl h-[600px] bg-card rounded-2xl p-8 m-2 flex flex-col gap-2">
      <Location />
      <hr className=" bg-amber-500" />
    </main>
  );
}

export default WeatherDashboard;
