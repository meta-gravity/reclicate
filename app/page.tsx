'use client'

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import '../styles/globals.css'

const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState<string | null>(null); // Specify the type of error

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; currentTarget: { prompt: { value: any; }; }; }) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: e.currentTarget.prompt.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      let prediction = await response.json();
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const predictionResponse = await fetch(
          `/api/predictions/${prediction.id}`
        );
        if (!predictionResponse.ok) {
          const errorData = await predictionResponse.json();
          throw new Error(errorData.detail);
        }

        prediction = await predictionResponse.json();
        setPrediction(prediction);
      }

      router.push(`/prediction/${prediction.id}`);
    } catch (error) {
      setError(error.message as string); // Cast error.message to string
    }
  };
  return (
    <div className="p-8 text-lg max-w-48rem mx-auto">
      <p>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </p>

      <form onSubmit className="flex mb-8">
        <input
          type="text"
          name="prompt"
          placeholder="Enter a prompt to display an image"
          className="w-full p-4 border border-black rounded-md text-lg mr-4"
        />
        <button
          type="submit"
          className="p-4 border-none rounded-md box-border cursor-pointer text-lg"
        >
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className="w-full aspect-w-1 aspect-h-1 relative">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
