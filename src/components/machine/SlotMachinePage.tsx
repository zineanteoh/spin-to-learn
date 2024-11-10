"use client";
import { SlotMachine } from "@/components/machine/SlotMachine";
import { fetchData, ItemProp, parseSpinResult, Spin } from "@/lib/utils";
import { SpinInsert } from "@/utils/supabase-utils";
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const data: SlotData = await fetchData("/api/slots");
    setSlotData(data);
    setIsLoading(false);
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

    console.log("spinResult", spin);
    // TODO: this is causing animation to break
    // setSpinResult(spin);
    // setIsModalOpen(true);
  }, []);

  return (
    <Fragment>
      {slotData && (
        <SlotMachine
          key={JSON.stringify(slotData.who.map((item) => item.emoji))}
          isLoading={isLoading}
          whoChoices={slotData.who}
          whatChoices={slotData.what}
          howChoices={slotData.how}
          onSpin={handleSpin}
          // onSpinEnd={() => setIsModalOpen(true)}
        />
      )}
      {/* {isModalOpen && spinResult && (
        <SpinResult
          id={spinResult.id}
          who={spinResult.who}
          what={spinResult.what}
          how={spinResult.how}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
      <Button
        onClick={fetchSlots}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg sm:px-3 sm:py-1"
      >
        {isLoading ? "Regenerating..." : "Regenerate Slots"}
      </Button>
    </Fragment>
  );
}
