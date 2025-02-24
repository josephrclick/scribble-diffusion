import { NextResponse } from "next/server";
import Replicate from "replicate";
import packageData from "../../../package.json";

async function getObjectFromRequestBodyStream(body) {
  const input = await body.getReader().read();
  const decoder = new TextDecoder();
  const string = decoder.decode(input.value);
  return JSON.parse(string);
}

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

  export default async function handler(req) {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed.'}, { status: 405 });
    }
    
    try {
      const input = await req.json();
  
      const { prompt, image, structure } = input;
  
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
        userAgent: `${packageData.name}/${packageData.version}`,
      });
  
      const prediction = await replicate.predictions.create({
        version: "795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
        input: { prompt, image, structure },
        webhook: `${WEBHOOK_HOST}/api/replicate-webhook`,
        webhook_events_filter: ["start", "completed"],
      });
  
      if (prediction?.error) {
        return NextResponse.json({ detail: prediction.error }, { status: 500 });
      }
  
      return NextResponse.json(prediction, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

export const config = {
  runtime: "edge",
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
