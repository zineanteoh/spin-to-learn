"use client";

import { Spin, parseSpinResult } from "@/lib/utils";
import { Database } from "@/utils/supabase";
import { createClientSupabase } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface SidebarContextType {
  spins: Spin[];
  conversations: { id: string; spin: Spin }[];
  refreshSidebarData: () => Promise<void>;
  refreshSpins: () => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [spins, setSpins] = useState<Spin[]>([]);
  const [conversations, setConversations] = useState<
    { id: string; spin: Spin }[]
  >([]);

  const fetchAllSpins = useCallback(
    async (supabase: SupabaseClient<Database>) => {
      const { data: spins } = await supabase
        .from("spins")
        .select("*")
        .not("ai_initial_message", "is", null)
        .order("created_at", { ascending: false });
      return spins?.map(parseSpinResult) ?? [];
    },
    []
  );

  const fetchAllConversations = useCallback(
    async (supabase: SupabaseClient<Database>) => {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id,spin:spins!inner(*)")
        .order("created_at", { ascending: false });
      if (!conversations) return [];
      return conversations.map((convo) => ({
        id: convo.id,
        spin: parseSpinResult(convo.spin),
      }));
    },
    []
  );

  const refreshSidebarData = useCallback(async () => {
    const supabase = await createClientSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const [spins, conversations] = await Promise.all([
      fetchAllSpins(supabase),
      fetchAllConversations(supabase),
    ]);

    setSpins(spins);
    setConversations(conversations);
  }, [fetchAllSpins, fetchAllConversations]);

  const refreshSpins = useCallback(async () => {
    const supabase = await createClientSupabase();
    const spins = await fetchAllSpins(supabase);
    setSpins(spins);
  }, [fetchAllSpins]);

  const refreshConversations = useCallback(async () => {
    const supabase = await createClientSupabase();
    const conversations = await fetchAllConversations(supabase);
    setConversations(conversations);
  }, [fetchAllConversations]);

  useEffect(() => {
    refreshSidebarData();
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        spins,
        conversations,
        refreshSidebarData,
        refreshSpins,
        refreshConversations,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
