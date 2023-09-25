// import Replicate from "replicate";

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// export default async function handler(req, res) {
//   const prediction = await replicate.predictions.get(req.query.id);

//   if (prediction?.error) {
//     res.statusCode = 500;
//     res.end(JSON.stringify({ detail: prediction.error }));
//     return;
//   }

//   res.end(JSON.stringify(prediction));
// }

export default async function handler(req, res) {
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + req.query.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}