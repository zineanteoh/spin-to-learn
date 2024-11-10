import { TablesInsert } from "@/utils/supabase";

export type User = TablesInsert<"users">;
export type Spin = TablesInsert<"spins">;
export type Conversation = TablesInsert<"conversations">;
