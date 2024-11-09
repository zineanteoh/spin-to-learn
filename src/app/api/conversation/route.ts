import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const WHO = "Sherlock Holmes";
const WHAT = "economics";
const HOW = "by solving a whodunnit mystery";

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

    const body = await request.json();
    console.log(body);

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are ${WHO} teaching about ${WHAT} ${HOW}. 
      You are having a mild conversation, without any physical actions or descriptions. 
      Be concise and calm. Include only the spoken words of the character in your response, no other text. Do not include any text surrounded by *asterisks*.
      Here is an example of a good response for the system prompt "You are Hachiko teaching about abacus math by gnawing on a bone": 
      Ah, welcome to today's lesson. Like this bone, the abacus is simple but incredibly rewarding. Just like how I faithfully waited at Shibuya station each day, we must be patient when learning these calculations.`,
      messages: body,
    });

    console.log(msg);
    return NextResponse.json(msg);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
