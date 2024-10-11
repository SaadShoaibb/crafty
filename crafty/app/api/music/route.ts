import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";


const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingFaceApiKey) {
  throw new Error("Hugging Face API key is not defined");
}

export async function POST(req: Request) {
  try {
    // Authenticate user with Clerk
    auth();

    const body = await req.json();
    const { inputs } = body;

    // Validate the input prompt
    if (!inputs || inputs.trim().length === 0) {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    // Log the input for debugging
    console.log("Generating music with input:", inputs);

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    // Fetch request to Hugging Face MusicGen model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs }),
      }
    );

    if(!isPro){
    await increaseApiLimit();
    }


    // Check if the response from Hugging Face was successful
    if (!response.ok) {
      const errorMsg = await response.text(); // Log the error message from Hugging Face API
      console.error("Hugging Face API Error:", errorMsg);
      return NextResponse.json({ error: "Error generating music" }, { status: 500 });
    }

    // Get the binary data from the response (audio file)
    const audioArrayBuffer = await response.arrayBuffer();

    // Send back the binary data to the frontend
    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg", // Ensure the right MIME type
      },
    });
  } catch (error) {
    console.error("[MUSIC_GEN_ERROR]", error); // Log any unexpected errors
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
