import { NextResponse } from "next/server";
import Replicate from "replicate";
import packageData from "../../../package.json";

export default async function handler(req) {
  const authHeader = req.headers.get("authorization");
  const replicate_api_token = authHeader.split(" ")[1]; // Assuming a "Bearer" token

  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  try {
    const { id } = req.query;

    const replicate = new Replicate({
      auth: replicate_api_token,
      userAgent: `${packageData.name}/${packageData.version}`,
    });

    //const predictionId = req.nextUrl.searchParams.get("id");
    const prediction = await replicate.predictions.get(id);

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const config = {
  runtime: "edge",
};
