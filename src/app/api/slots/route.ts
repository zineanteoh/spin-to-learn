import { Anthropic } from "@anthropic-ai/sdk";
import { ToolUseBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import { NextResponse } from "next/server";

// generate 6 choices for each reel
const MAX_CHOICES = 6;

/**
 * Regenerates 6 WHOs, WHATs, and HOWs. For the initial slots, see initial_slots/route.ts
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
    🧝‍♀️🌿🏹 Legolas is teaching about photosynthesis while practicing archery in the forest.
    👾📏🧩 Pac-Man is teaching about shortest path algorithms by navigating mazes.
    🐶🌉🧀 Wallace & Gromit are teaching about engineering by building a cheese machine.
    👸🏻📠🏭 Queen Victoria is teaching about the Industrial Revolution by managing a Roblox factory simulator.
    👨🏻‍🦳🎨💹 Warren Buffett is teaching about Renaissance art through the stock market.
    👱🏻‍♂️🎉😜 Andy Warhol is teaching about pop art by creating social media memes.
    🥷🏻🌍💰 Carmen Sandiego is teaching about world geography by planning her next heist.
    👵🏻🧍🏻‍♂️☕ Violet Crawley is teaching about the patriarchy during an elegant high tea gala.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 1,
    tools: [
      {
        name: "slot_generator",
        description: "Generate 6 WHOs, WHATs, and HOWs.",
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
              minItems: MAX_CHOICES,
              maxItems: MAX_CHOICES,
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
              minItems: 6,
              maxItems: 6,
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
              minItems: 6,
              maxItems: 6,
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
            Based on the following examples, generate 6 new WHOs, 6 new WHATs, and 6 new HOWs. Your response should be a JSON object with three arrays: who, what, and how. Each array should contain 10 objects with emoji and description properties.
            Be creative, diverse, and concise. Here are the examples:` +
          `${exampleTitles}`,
      },
    ],
  });
  return NextResponse.json((msg.content[0] as ToolUseBlock).input);
}
