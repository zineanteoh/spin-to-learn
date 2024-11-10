import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import { NextResponse } from "next/server";

/**
 * Generate a new conversation scenario (generic).
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const exampleTitles = `🐶🧮🦴 Hachiko is teaching about abacus math while gnawing on a bone.
    👩‍🎤🔭🎨 Bob Ross is teaching about astronomy by painting a beautiful landscape.
    👨🏻‍🦰🪐🥘 Ronald Weasley is teaching about Saturn's rings by describing his favorite meal.
    🕵🏻‍♂️📈🔎 Sherlock Holmes is teaching about economics by solving a whodunnit mystery.
    🏎️⚛️🏁 Lightning McQueen is teaching about Newton's laws of motion by racing in a car.
    🥷🏻⛅🗡️ Inej Ghafa is teaching about meteorology while fighting Jan Van Eck's minions.
    🪖🔬🧪 Steve Irwin is teaching about biology by swimming with a crocodile.
    🧙‍♂️🦕🎩 Gandalf is teaching about paleontology by pulling dinosaur bones out of his hat.
    🧜‍♀️📐🌊 Ariel is teaching about geometry while swimming through underwater caves.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `The following are examples of conversation scenarios. Each scenario is made up of three parts: a who, a what, and a how.
          Each part is described by an emoji and a short phrase. For example, 🐶🧮🦴 means who: dog, what: teaching about abacus math, and how: while gnawing on a bone.
          Based on the following examples, generate one new scenario. Provide only the scenario, no other text.
          Here are the examples:
          ${exampleTitles}`,
      },
    ],
  });
  return NextResponse.json({ message: (msg.content[0] as TextBlock).text });
}
