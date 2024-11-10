import { createServerSupabase } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { who, what, how } = body;

    if (!who || !what || !how) {
      return NextResponse.json(
        { error: "who, what, and how parameters are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    console.log("who", who);
    console.log("what", what);
    console.log("how", how);

    const { data, error } = await supabase
      .from("spins")
      .select("id")
      .contains("who", { description: who.description })
      .contains("what", { description: what.description })
      .contains("how", { description: how.description })
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to find matching spin" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No matching spin found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
