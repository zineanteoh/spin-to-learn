import { ConversationPage } from "@/components/ConversationPage";
import { parseSpinResult } from "@/lib/utils";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ spinId: string | undefined }>;
}) {
  const { spinId } = await params;
  const supabase = await createServerSupabase();

  if (!spinId) {
    redirect("/");
  }

  console.log("fetching spinId", spinId);

  const { data: spin } = await supabase
    .from("spins")
    .select("*")
    .eq("id", spinId)
    .single();

  if (!spin) {
    redirect("/");
  }

  const spinResult = parseSpinResult(spin);

  return <ConversationPage spin={spinResult} />;
}
