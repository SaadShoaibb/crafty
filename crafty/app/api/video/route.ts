import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingFaceApiKey) {
  throw new Error("Hugging Face API key is not defined");
}

export async function POST(req: Request) {
  try {
    auth(); // Clerk authentication
    const body = await req.json();
    const { prompt, amount = 1, resolution } = body; // Default amount is 1 if not provided

    if (!prompt || prompt.length === 0) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Ensure 'amount' is a number and valid
    const numImages = Math.min(Math.max(parseInt(amount), 1), 5); // Limiting the amount to a max of 5 for safety

    const images: string[] = [];

    // Function to generate a single image
    const generateImage = async () => {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${huggingFaceApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true } // Optionally, make the API wait for model availability
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate image");
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      const imageUrl = `data:image/png;base64,${base64Image}`;

      return imageUrl;
    };

    // Loop to generate multiple images based on the 'amount'
    for (let i = 0; i < numImages; i++) {
      const imageUrl = await generateImage();
      images.push(imageUrl); // Add the generated image to the array
    }

    // Return the generated images as an array
    return NextResponse.json({ images });

  } catch (error) {
    console.error("[HUGGING_FACE_IMAGE_GENERATION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
