import { NextResponse } from "next/server";

// return 6 choices for each reel
const MAX_CHOICES = 6;

/**
 * Generate an initial WHO, WHAT, and HOW.
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  const examples = [
    {
      who: { emoji: "🐶", description: "Hachiko" },
      what: { emoji: "🧮", description: "abacus math" },
      how: { emoji: "🦴", description: "while gnawing on a bone" },
    },
    {
      who: { emoji: "👩‍🎤", description: "Bob Ross" },
      what: { emoji: "🔭", description: "astronomy" },
      how: { emoji: "🎨", description: "by painting a beautiful landscape" },
    },
    {
      who: { emoji: "👨🏻‍🦰", description: "Ronald Weasley" },
      what: { emoji: "🪐", description: "Saturn's rings" },
      how: { emoji: "🥘", description: "by describing his favorite meal" },
    },
    {
      who: { emoji: "🕵🏻‍♂️", description: "Sherlock Holmes" },
      what: { emoji: "📈", description: "economics" },
      how: { emoji: "🔎", description: "by solving a whodunnit mystery" },
    },
    {
      who: { emoji: "🏎️", description: "Lightning McQueen" },
      what: { emoji: "⚛️", description: "Newton's laws of motion" },
      how: { emoji: "🏁", description: "by racing in a car" },
    },
    {
      who: { emoji: "🥷🏻", description: "Inej Ghafa" },
      what: { emoji: "⛅", description: "meteorology" },
      how: { emoji: "🗡️", description: "while fighting Jan Van Eck's minions" },
    },
    {
      who: { emoji: "🪖", description: "Steve Irwin" },
      what: { emoji: "🔬", description: "biology" },
      how: { emoji: "🧪", description: "by swimming with a crocodile" },
    },
    {
      who: { emoji: "🧙‍♂️", description: "Gandalf" },
      what: { emoji: "🦕", description: "paleontology" },
      how: {
        emoji: "🎩",
        description: "by pulling dinosaur bones out of his hat",
      },
    },
    {
      who: { emoji: "🧜‍♀️", description: "Ariel" },
      what: { emoji: "📐", description: "geometry" },
      how: {
        emoji: "🌊",
        description: "while swimming through underwater caves",
      },
    },
    {
      who: { emoji: "🧙‍♂️", description: "Merlin" },
      what: { emoji: "🔮", description: "communism" },
      how: { emoji: "🔥", description: "by brewing a potion" },
    },
    {
      who: { emoji: "🤖", description: "Iron Man" },
      what: { emoji: "💰", description: "opportunity cost" },
      how: {
        emoji: "💸",
        description: "by analyzing different crime-fighting techniques",
      },
    },
    {
      who: { emoji: "🧚‍♀️", description: "Tinkerbell" },
      what: { emoji: "⚡", description: "electricity" },
      how: { emoji: "✨", description: "by sprinkling pixie dust" },
    },
    {
      who: { emoji: "🐱", description: "Garfield" },
      what: { emoji: "📅", description: "time management" },
      how: { emoji: "🛋️", description: "while lazing on the couch" },
    },
    {
      who: { emoji: "👸🏻", description: "Cinderella" },
      what: { emoji: "🕰️", description: "timezones" },
      how: { emoji: "👗", description: "at the royal ball" },
    },
    {
      who: { emoji: "👴🏻", description: "Socrates" },
      what: { emoji: "🤔", description: "philosophical debate" },
      how: { emoji: "🌐", description: "through TikTok videos" },
    },
    {
      who: { emoji: "🤴🏻", description: "King Arthur" },
      what: { emoji: "🤝🏻", description: "leadership styles" },
      how: { emoji: "🪑", description: "through round table discussions" },
    },
    {
      who: { emoji: "👱🏻‍♀️", description: "Jane Austen" },
      what: { emoji: "🏛️", description: "social class systems" },
      how: { emoji: "☕", description: "by hosting a Regency-era tea party" },
    },
    {
      who: { emoji: "👩🏿", description: "Rosa Parks" },
      what: { emoji: "🪧", description: "Civil Rights Movement" },
      how: {
        emoji: "🚌",
        description: "through public transportation stories",
      },
    },
    {
      who: { emoji: "👴🏻", description: "Confucius" },
      what: { emoji: "⚖️", description: "ethics" },
      how: { emoji: "🌐", description: "by moderating an online forum" },
    },
    {
      who: { emoji: "🐷", description: "The Three Little Pigs" },
      what: { emoji: "📈", description: "real estate" },
      how: {
        emoji: "🏘️",
        description:
          "by analyzing their houses' cost-benefit ratios during wolf attacks",
      },
    },
    {
      who: { emoji: "🧒🏻", description: "Dorothy from Oz" },
      what: { emoji: "📺", description: "how color TVs work" },
      how: { emoji: "🌪️", description: "by analyzing tornado patterns" },
    },
    {
      who: { emoji: "🧛‍♂️", description: "Count Dracula" },
      what: { emoji: "🩸", description: "blood types" },
      how: {
        emoji: "🦇",
        description: "while conducting a blood bank inventory",
      },
    },
    {
      who: { emoji: "🧝‍♀️", description: "Legolas" },
      what: { emoji: "🌿", description: "photosynthesis" },
      how: {
        emoji: "🏹",
        description: "while practicing archery in the forest",
      },
    },
    {
      who: { emoji: "👾", description: "Pac-Man" },
      what: { emoji: "📏", description: "shortest path algorithms" },
      how: { emoji: "🧩", description: "by navigating mazes" },
    },
    {
      who: { emoji: "🐶", description: "Wallace & Gromit" },
      what: { emoji: "🌉", description: "engineering" },
      how: { emoji: "🧀", description: "by building a cheese machine" },
    },
    {
      who: { emoji: "👸🏻", description: "Queen Victoria" },
      what: { emoji: "📠", description: "Industrial Revolution" },
      how: {
        emoji: "🏭",
        description: "by managing a Roblox factory simulator",
      },
    },
    {
      who: { emoji: "👨🏻‍🦳", description: "Warren Buffett" },
      what: { emoji: "🎨", description: "Renaissance art" },
      how: { emoji: "💹", description: "through the stock market" },
    },
    {
      who: { emoji: "👱🏻‍♂️", description: "Andy Warhol" },
      what: { emoji: "🎉", description: "pop art" },
      how: { emoji: "😜", description: "by creating social media memes" },
    },
    {
      who: { emoji: "🥷🏻", description: "Carmen Sandiego" },
      what: { emoji: "🌍", description: "world geography" },
      how: { emoji: "💰", description: "by planning her next heist" },
    },
    {
      who: { emoji: "👵🏻", description: "Violet Crawley" },
      what: { emoji: "🧍🏻‍♂️", description: "the patriarchy" },
      how: { emoji: "☕", description: "during an elegant high tea gala" },
    },
  ];

  // Separate the examples into WHO, WHAT, and HOW arrays
  const whos = examples.map((ex) => ex.who);
  const whats = examples.map((ex) => ex.what);
  const hows = examples.map((ex) => ex.how);

  // Randomly select MAX_CHOICES of each
  const selectedWhos = getRandomElements(whos, MAX_CHOICES);
  const selectedWhats = getRandomElements(whats, MAX_CHOICES);
  const selectedHows = getRandomElements(hows, MAX_CHOICES);

  return NextResponse.json({
    who: selectedWhos,
    what: selectedWhats,
    how: selectedHows,
  });
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
