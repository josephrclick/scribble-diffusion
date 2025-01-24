import { NextResponse } from "next/server";
import Replicate from "replicate";
import packageData from "../../../package.json";

export default async function handler(req) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    const predictionId = req.nextUrl.searchParams.get("id");
    
    if (!predictionId) {
      return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      userAgent: `${packageData.name}/${packageData.version}`,
    });

    const prediction = await replicate.predictions.get(predictionId);

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};