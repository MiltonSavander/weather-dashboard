import { NextResponse } from "next/server";

export async function GET(req: Request){
  const {searchParams} = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5`,
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
