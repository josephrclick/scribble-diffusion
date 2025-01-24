import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useState } from "react";
import Predictions from "components/predictions";
import Error from "components/error";
import uploadFile from "lib/upload";
import Script from "next/script";
import seeds from "lib/seeds";
import sleep from "lib/sleep";

const HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function Home() {
  const [error, setError] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [predictions, setPredictions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [scribbleExists, setScribbleExists] = useState(false);
  const [seed] = useState(seeds[Math.floor(Math.random() * seeds.length)]);
  const [initialPrompt] = useState(seed.prompt);
  const [scribble, setScribble] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // track submissions so we can show a spinner while waiting for the next prediction to be created
    setSubmissionCount(submissionCount + 1);

    const prompt = e.target.prompt.value;
    setError(null);
    setIsProcessing(true);

    const fileUrl = await uploadFile(scribble);

    const body = {
      prompt,
      image: fileUrl,
      structure: "scribble",
      replicate_api_token: process.env.REPLICATE_API_TOKEN,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();

    setPredictions((predictions) => ({
      ...predictions,
      [prediction.id]: prediction,
    }));

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id, {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      prediction = await response.json();
      setPredictions((predictions) => ({
        ...predictions,
        [prediction.id]: prediction,
      }));
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
    }

    setIsProcessing(false);
  };

  return (
    <>
        <div className="min-h-screen bg-gray-100">
          <Head>
            <title>Scribble App</title>
            <meta name="description" content="Draw something and get an AI-generated image" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <main className="container max-w-[768px] mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Scribble App</h1>
              <p className="text-gray-600">
                Draw something and submit a brief description. Wait a bit and get an AI-generated image based on your sketch.
              </p>
            </div>
    
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <Canvas
          startingPaths={seed.paths}
                onScribble={setScribble}
                scribbleExists={scribbleExists}
                setScribbleExists={setScribbleExists}
              />
    
              <PromptForm
          initialPrompt={initialPrompt}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                scribbleExists={scribbleExists}
              />
    
              <Error error={error} />
            </div>
    
            <Predictions
              predictions={predictions}
              isProcessing={isProcessing}
              submissionCount={submissionCount}
            />
          </main>
        </div>
      <Script src="https://js.bytescale.com/upload-js-full/v1" />
    </>
  );
}