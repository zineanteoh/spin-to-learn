import { LayoutContainer } from "@/components/LayoutContainer";
import { SlotMachinePage } from "@/components/machine/SlotMachinePage";
import { BreadcrumbPage } from "@/shadcn-ui/breadcrumb";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function App() {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.getUser();
  if (error) {
    redirect("/login");
  }

  return (
    <LayoutContainer
      breadcrumb={<BreadcrumbPage>🎰 Spin To Learn</BreadcrumbPage>}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SlotMachinePage />
      </div>
    </LayoutContainer>
  );
}
