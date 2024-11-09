import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

/**
 * Generate a WHO, WHAT, and HOW.
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const exampleTitles = `🐶🧮🦴 Machiko is teaching about abacus math while gnawing on a bone.
    👩‍🎤🔭🎨 Bob Ross is teaching about astronomy by painting a beautiful landscape.
    👨🏻‍🦰🪐🥘 Ronald Weasley is teaching about Saturn's rings by describing his favorite meal.
    🕵🏻‍♂️📈🔎 Sherlock Holmes is teaching about economics by solving a whodunnit mystery.
    🏎️⚛️🏁 Lightning McQueen is teaching about Newton's laws of motion by racing in a car.
    🥷🏻⛅🗡️ Inej Ghafa is teaching about meteorology while fighting Jan Van Eck's minions.
    🪖🔬🧪 Steve Irwin is teaching about biology by swimming with a crocodile.
    🧙‍♂️🦕🎩 Gandalf is teaching about paleontology by pulling dinosaur bones out of his hat.
    🧜‍♀️📐🌊 Ariel is teaching about geometry while swimming through underwater caves.
    🧙‍♂️🔮🔥 Merlin is teaching about communism by brewing a potion.
    🤖💰💸 Iron Man is teaching about opportunity cost by analyzing different crime-fighting techniques.
    🧚‍♀️⚡✨ Tinkerbell is teaching about electricity by sprinkling pixie dust.
    🐱📅🛋️ Garfield is teaching about time management while lazing on the couch.
    👸🏻🕰️👗 Cinderella is teaching about timezones at the royal ball.
    👴🏻🤔🌐 Socrates is teaching about philosophical debate through TikTok videos. 
    🤴🏻🤝🏻🪑 King Arthur is teaching about leadership styles through round table discussions.
    👱🏻‍♀️🏛️☕ Jane Austen is teaching about social class systems by hosting a Regency-era tea party.
    👩🏿🪧🚌 Rosa Parks is teaching about the Civil Rights Movement through public transportation stories.
    👴🏻⚖️🌐 Confucius is teaching about ethics by moderating an online forum.
    🐷📈🏘️ The Three Little Pigs are teaching about real estate by analyzing their houses' cost-benefit ratios during wolf attacks.
    🧒🏻📺🌪️ Dorothy from Oz is teaching about how color TVs work by analyzing tornado patterns.
    🧛‍♂️🩸🦇 Count Dracula is teaching about blood types while conducting a blood bank inventory.
    🧝‍♀️🌿🏹 Legolas is teaching about photosynthesis while practicing archery in the forest.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 1,
    tools: [
      {
        name: "slot_generator",
        description: "Generate 10 WHOs, WHATs, and HOWs.",
        input_schema: {
          type: "object",
          properties: {
            who: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emoji: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                },
                required: ["emoji", "description"],
              },
              description: "An array of WHO objects.",
              minItems: 10,
              maxItems: 10,
            },
            what: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emoji: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                },
                required: ["emoji", "description"],
              },
              description: "An array of WHAT objects describing topics.",
              minItems: 10,
              maxItems: 10,
            },
            how: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emoji: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                },
                required: ["emoji", "description"],
              },
              description: "An array of HOW objects.",
              minItems: 10,
              maxItems: 10,
            },
          },
          required: ["who", "what", "how"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "slot_generator" },
    messages: [
      {
        role: "user",
        content:
          `You are given the following examples of conversation scenarios. Each scenario is made up of three parts: a WHO, a WHAT, and a HOW.
            Each part is described by an emoji and a short description. For example, 🐶🧮🦴 means WHO: dog, WHAT: abacus math, and HOW: while gnawing on a bone.
            Based on the following examples, generate 10 new WHOs, 10 new WHATs, and 10 new HOWs. Your response should be a JSON object with three arrays: who, what, and how. Each array should contain 10 objects with emoji and description properties.
            Be creative, diverse, and concise. Here are the examples:` +
          `${exampleTitles}`,
      },
    ],
  });
  console.log(JSON.stringify(msg, null, 2)); // TODO: remove
  return NextResponse.json(msg.content[0].input);
}
