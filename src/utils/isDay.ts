export default function isDay(time: string, sunset: string, sunrise: string): boolean {
  // Convert "HH:mm" to minutes since midnight
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const timeMin = toMinutes(time);
  const sunriseMin = toMinutes(sunrise);
  const sunsetMin = toMinutes(sunset);

  // Handles normal and overnight sunrise/sunset (e.g., polar regions)
  if (sunriseMin < sunsetMin) {
    return timeMin >= sunriseMin && timeMin < sunsetMin;
  } else {
    // If sunrise is after sunset (rare, but possible in some locations/seasons)
    return timeMin >= sunriseMin || timeMin < sunsetMin;
  }
}
