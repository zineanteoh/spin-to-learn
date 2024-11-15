import { createServerSupabase } from "@/utils/supabase/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { TextDelta } from "@anthropic-ai/sdk/resources/index.mjs";

/**
 * Generate the next message in a conversation.
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  // Set up the response encoder
  const encoder = new TextEncoder();

  // Create a TransformStream for handling the stream
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  try {
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const supabase = await createServerSupabase();

    // Get all the messages up until this point
    const { messages, who, what, how, conversationId } = await request.json();

    // Get the next message
    const anthropicStream = await anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: `You are ${who} teaching the user about ${what} ${how}.
      You are having a mild conversation, without any physical actions or descriptions. Be concise and calm. Challenge the user with questions and challenges, provide answers in your follow up messages.
      Include only the spoken words of the character in your response, no other text. Do not include any text surrounded by *asterisks*.
      Based on the past messages in this conversation, respond with a single message. Provide continuity in your response if the conversation has already started. If there are no past messages, respond with an initial greeting.
      `,
      messages: messages,
    });

    let completeMessage = "";

    // Start processing the stream
    (async () => {
      for await (const event of anthropicStream) {
        if (event.type === "content_block_delta") {
          const text = (event.delta as TextDelta).text;
          completeMessage += text;
          // Write each chunk to the stream
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
      }

      // Close the stream when done
      await writer.close();

      // save the message to the database
      const { error } = await supabase.from("messages").insert({
        content: completeMessage,
        conversation_id: conversationId,
      });
      if (error) {
        console.error("Error saving message to database", error);
      }
    })();

    // Return the stream with appropriate headers
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    // Handle any errors
    await writer.abort(error);
    return new Response(JSON.stringify({ error: "Stream failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
