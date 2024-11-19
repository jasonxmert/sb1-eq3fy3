import { NextResponse } from "next/server";

export const runtime = 'edge';

interface Place {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
  'state abbreviation': string;
}

interface ZippopotamResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const country = searchParams.get("country");

  if (!query || !country) {
    return NextResponse.json(
      { message: "Missing query or country parameter" },
      { status: 400 }
    );
  }

  try {
    const cleanQuery = query.trim().replace(/[^\w\s-]/g, "");
    const baseUrl = "https://api.zippopotam.us";
    const apiUrl = `${baseUrl}/${country.toLowerCase()}/${cleanQuery}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: `No results found for ${cleanQuery} in the selected country` },
          { status: 404 }
        );
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ZippopotamResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch location data" },
      { status: 500 }
    );
  }
}