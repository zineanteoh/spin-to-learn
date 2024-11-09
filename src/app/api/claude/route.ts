import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// talking to claude
export async function GET(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const exampleTitles = `Hermione Granger is teaching about chemical reactions by making brownies.
Steve Jobs is teaching about european history by giving an iPhone launch style presentation. 
Usain Bolt is teaching about speed of light by sprinting.
A Jigglypuff is teaching about newton’s laws of motion by describing a rollercoaster. 
Lightning McQueen is teaching about photosynthesis by writing a plant journal. 
Baby Yoda is teaching about water management systems through the Aquaduct of Rome. 
Bruce Lee is teaching about the 5 stages of grief by acting out each stage. 
Bob Ross is teaching about plate tectonics by painting "happy little earthquakes". 
Gordon Ramsay is teaching about cell division by cooking a mitosis-inspired meal.
Spider-Man is teaching about gravity by swinging through New York City.
Mary Poppins is teaching about weather patterns by flying with her umbrella.    
Tony Hawk is teaching about momentum and inertia by demonstrating skateboard tricks.
Indiana Jones is teaching about ancient civilizations by exploring a temple. 
Bill Nye is teaching about states of matter by making ice cream.
Sherlock Holmes is teaching about the periodic table by solving element-based mysteries.
Mario is teaching about geometry by navigating through platform levels.
Shakespeare is teaching about creative writing by directing a modern reality TV show.
Frida Kahlo is teaching about self-expression through painting emotional self-portraits.
Martin Luther King Jr. is teaching about civil rights movements by organizing a peaceful march.
Jane Austen is teaching about social class systems by hosting a Regency-era tea party.
Vincent van Gogh is teaching about post-impressionism by painting with starry night colors.
Cleopatra is teaching about ancient Egyptian politics by running a modern election campaign.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content:
          "Based on the following examples, generate one session title for a new session. Provide only the title, no other text." +
          "Here are some examples:" +
          exampleTitles,
      },
    ],
  });
  console.log(msg);
  return NextResponse.json({ message: msg.content[0].text });
}
