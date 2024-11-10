"use client";
import { ItemProp, SlotMachine } from "@/components/machine/SlotMachine";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../shadcn-ui/button";
import { fetchData } from "@/lib/utils";

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

  const handleSpin = useCallback((chosenItems: ItemProp[]) => {
    // TODO: save spin result to database for the user
    console.log("chosenItems", chosenItems);
  }, []);

  return (
    <>
      {slotData && (
        <SlotMachine
          key={JSON.stringify(slotData.who.map((item) => item.emoji))}
          isLoading={isLoading}
          whoChoices={slotData.who}
          whatChoices={slotData.what}
          howChoices={slotData.how}
          onSpin={handleSpin}
        />
      )}
      <Button
        onClick={fetchSlots}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg sm:px-3 sm:py-1"
      >
        {isLoading ? "Regenerating..." : "Regenerate Slots"}
      </Button>
    </>
  );
}
