import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessage } from "groq-sdk/resources/chat/completions.mjs";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";


const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("Groq API key is not defined");
}

// Initialize the Groq SDK with the API key passed as part of the client options
const groq = new Groq({
  apiKey,  // Pass the API key as part of the client options
});

// Create an instruction message for the AI
const instructionMessage: ChatCompletionMessage = {
  role: "assistant",  // Using the correct role supported by the SDK
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export async function POST(req: Request) {
  try {
    auth(); // Clerk authentication
    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Include the instruction message along with the user input
    const allMessages = [instructionMessage, ...messages];

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired.", { status: 403 });
    }

    // Start a chat session with LLaMA model using the history and instruction
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // LLaMA model version
      messages: allMessages, // Include the instruction message followed by user messages
      temperature: 1,
      top_p: 1,
      max_tokens: 1024,
      stream: false,
      stop: null
    });

    if(!isPro){
    await increaseApiLimit();
    }


    // Extract the generated content
    const result = chatCompletion.choices[0]?.message?.content || "";

    // Return the generated content as JSON
    return NextResponse.json({ content: result });

  } catch (error) {
    console.error("[LLAMA_CHAT_ERROR]", error); // Log the error
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
