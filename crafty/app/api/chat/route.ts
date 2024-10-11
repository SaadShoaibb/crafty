import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Retrieve the API key from the environment
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("Groq API key is not defined");
}

// Initialize the Groq SDK with the API key
const groq = new Groq({
  apiKey,  // Pass the API key as part of the client options
});

export async function POST(req: Request) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Check if the user is still within their API limit (free trial)
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    // Start a chat session with the LLaMA model using the message history
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",  // LLaMA model version
      messages,  // Chat history
      temperature: 1,
      top_p: 1,
      max_tokens: 1024,
      stream: false,
      stop: null,
    });

    // Increase the API limit count for the user after a successful request
    if(!isPro){
    await increaseApiLimit();
    }

    // Extract the generated content from the response
    const result = chatCompletion.choices[0]?.message?.content || "";

    // Return the generated content as JSON
    return NextResponse.json({ content: result });

  } catch (error) {
    console.error("[LLAMA_CHAT_ERROR]", error);  // Log the error
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
