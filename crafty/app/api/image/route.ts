import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";


const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingFaceApiKey) {
  throw new Error("Hugging Face API key is not defined");
}

export async function POST(req: Request) {
  try {
    auth(); // Clerk authentication
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!prompt || prompt.length === 0) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

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
        }),
      }
    );

    await increaseApiLimit();


    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to generate image" }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`; // Return base64 image

    return NextResponse.json({ images: [imageUrl] });

  } catch (error) {
    console.error("[HUGGING_FACE_IMAGE_GENERATION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
