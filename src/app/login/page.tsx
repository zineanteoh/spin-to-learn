import { LoginForm } from "@/components/LoginForm";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        Spin to Learn!
      </h1>
      <LoginForm />
    </div>
  );
}
