"use client";
import { SlotMachine } from "@/components/machine/SlotMachine";
import { fetchData, ItemProp, parseSpinResult, Spin } from "@/lib/utils";
import { SpinInsert } from "@/utils/supabase-utils";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "../shadcn-ui/button";
type SlotItem = {
  emoji: string;
  description: string;
};

type SlotData = {
  who: SlotItem[];
  what: SlotItem[];
  how: SlotItem[];
};

export function SlotMachinePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [spinResult, setSpinResult] = useState<Spin | null>(null);
  const [showSpinResult, setShowSpinResult] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data: SlotData = await fetchData("/api/initial_slots");
      setSlotData(data);
      setIsLoading(false);
    })();
  }, []);

  const fetchSlots = useCallback(async () => {
    setIsRegenerating(true);
    const data: SlotData = await fetchData("/api/slots");
    setSlotData(data);
    setIsRegenerating(false);
  }, []);

  const handleSpin = useCallback(async (chosenItems: ItemProp[]) => {
    console.log("chosenItems", chosenItems);

    const result = await fetchData<SpinInsert>("/api/createSlot", {
      method: "POST",
      body: JSON.stringify({
        who: chosenItems[0],
        what: chosenItems[1],
        how: chosenItems[2],
      }),
    });

    const spin = parseSpinResult(result);

    // 1 million IQ way to overcome react
    localStorage.setItem("spinId", JSON.stringify(spin.id));
  }, []);

  return (
    <Fragment>
      {slotData && (
        <SlotMachine
          key={JSON.stringify(slotData.who.map((item) => item.emoji))}
          whoChoices={slotData.who}
          whatChoices={slotData.what}
          howChoices={slotData.how}
          onSpin={handleSpin}
        />
      )}
      <Button
        onClick={fetchSlots}
        disabled={isRegenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg sm:px-3 sm:py-1"
      >
        {isRegenerating ? "Regenerating..." : "Regenerate Slots"}
      </Button>
    </Fragment>
  );
}
