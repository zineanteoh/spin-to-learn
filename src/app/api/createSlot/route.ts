import { createServerSupabase } from "@/utils/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = await createServerSupabase();
  const { data: user } = await supabase.auth.getUser();

  const { who, what, how } = body;

  const { data, error } = await supabase
    .from("spins")
    .insert({
      creator_id: user?.user?.id,
      who: JSON.stringify(who),
      what: JSON.stringify(what),
      how: JSON.stringify(how),
    })
    .select("*");

  const spin = data?.[0];
  if (!spin) {
    return Response.json({ error: "Failed to create slot" }, { status: 500 });
  }

  // run without async
  generateInitialMessage(spin.id, supabase, {
    who: who.description,
    what: what.description,
    how: how.description,
  });

  return Response.json(spin);
}

// generate initial message and save to supabase without async
async function generateInitialMessage(
  id: string,
  supabase: SupabaseClient,
  { who, what, how }: { who: string; what: string; how: string }
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const initialMessage = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are ${who} teaching the user about ${what} ${how}.
        You are having a mild conversation, without any physical actions or descriptions. Be concise and calm.
        Challenge the user with questions and challenges, provide answers in your follow up messages.
        Include only the spoken words of the character in your response, no other text. Do not include any text surrounded by *asterisks*.
        Respond with an initial greeting.`,
      },
    ],
  });

  const initialMessageText = (initialMessage.content[0] as TextBlock).text;

  const { error } = await supabase
    .from("spins")
    .update({ ai_initial_message: initialMessageText })
    .eq("id", id);

  console.log("error", error);
}
