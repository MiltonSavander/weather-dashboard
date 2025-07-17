import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${lat}&lon=${lon}`,
    {
      headers: {
        "User-Agent": "data-dashboard/1.0 (milton.savander@gmail.com)",
        "Accept-Language": "sv",
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
