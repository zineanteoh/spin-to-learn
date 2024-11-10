import { SpinInsert } from "@/utils/supabase-utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// helper function to fetch data
export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function fetchStream<T>(
  url: string,
  body: T
): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed to fetch stream");
    if (!response.body) throw new Error("No body in response");

    return response.body;
  } catch (error) {
    console.error("Error fetching stream:", error);
    return null;
  }
}

export type ItemProp = {
  emoji: string;
  description: string;
};

export type Spin = {
  id: string;
  who: ItemProp;
  what: ItemProp;
  how: ItemProp;
  ai_initial_message?: string;
};

export function parseSpinResult(spin: SpinInsert): Spin {
  // Parse JSONB data
  const who = typeof spin.who === "string" ? JSON.parse(spin.who) : spin.who;
  const what =
    typeof spin.what === "string" ? JSON.parse(spin.what) : spin.what;
  const how = typeof spin.how === "string" ? JSON.parse(spin.how) : spin.how;

  return {
    id: spin.id ?? "",
    who: who as ItemProp,
    what: what as ItemProp,
    how: how as ItemProp,
    ai_initial_message: spin.ai_initial_message ?? "",
  };
}

export function createScenario(spin: Spin) {
  return `${spin.who.description} is teaching you about ${spin.what.description} ${spin.how.description}`;
}
