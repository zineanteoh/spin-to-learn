import { PageProps } from "@/lib/utils";

export default async function Page({
  params: { spinId, conversationId },
}: PageProps<"spinId" | "conversationId">) {
  return (
    <div>
      Hello /spin/{spinId}/conversation/{conversationId}
    </div>
  );
}
