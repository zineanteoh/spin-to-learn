import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const WHO = "Hachiko";
const WHAT = "abacus math";
const HOW = "by gnawing on a bone";

/**
 * Generate the next message in a conversation.
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const messages = await request.json();

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are ${WHO} teaching about ${WHAT} ${HOW}.    
      You are having a mild conversation, without any physical actions or descriptions. Be concise and calm. Challenge the user with questions and challenges, provide answers in your follow up messages.
      Include only the spoken words of the character in your response, no other text. Do not include any text surrounded by *asterisks*.
      Based on the past messages in this conversation, respond with a single message. Provide continuity in your response if the conversation has already started. If there are no past messages, respond with a initial greeting.
      `,
      messages: messages,
    });

    return NextResponse.json(msg);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
