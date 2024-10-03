import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

// Initialize the Groq SDK with your API key
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("Groq API key is not defined");
}

const groq = new Groq({ apiKey });
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);

export async function POST(req: Request) {
  try {
    console.log("Authenticating user...");
    const { userId } = auth(); // Authenticate user with Clerk
    if (!userId) {
      console.error("Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract formData from the request (for the file upload)
    console.log("Extracting form data...");
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    // Check if an audio file was provided
    if (!audioFile) {
      console.error("No audio file provided.");
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log("Converting audio file to buffer...");
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Define a temporary file path to save the audio
    const tempFilePath = path.join("/tmp", `${Date.now()}-${audioFile.name}`);

    console.log(`Saving audio file to disk at: ${tempFilePath}`);
    await writeFile(tempFilePath, audioBuffer);

    // Use Groq API to transcribe the audio using fs.createReadStream()
    console.log("Sending file to Groq API...");
    const transcriptionResponse = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath), // Use fs.createReadStream on the saved file
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    console.log("Groq API response received.");

    // Extract the transcription text from the response
    const transcription = transcriptionResponse.text || "";

    console.log("Transcription result: ", transcription);

    // Delete the temporary audio file
    console.log("Cleaning up temporary file...");
    await unlinkFile(tempFilePath);

    if (!transcription) {
      console.error("Transcription failed.");
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    // Return the transcription result
    return NextResponse.json({ transcription });

  } catch (error) {
    console.error("[WHISPER_TRANSCRIPTION_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
