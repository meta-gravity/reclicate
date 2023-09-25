import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SaveAs from "@/components/SaveAs";
import { Input } from "@/components/ui/input";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };

  const handleDownloadExcel = () => {
    router.push('/download')
  }

  return (
    <div className="flex container text-center py-4 mx-auto p-6 items-center">
      <Head>
        <title>Reclicate</title>
      </Head>

      <h1 className="py-8 text-center mx-auto font-bold text-3xl hover:text-blue-500 cursor-pointer items-center">
        Dream something with Reclicate AI
      </h1>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <Input
          type="text"
          className="flex-grow borde"
          name="prompt"
          placeholder="Enter a prompt to display an image"
          required
        />
        <Button className="button" type="submit">
          Go!
        </Button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
          <div>
            <SaveAs />
          </div>
        </>

      )}
    </div>
  );
}