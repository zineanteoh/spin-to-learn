import { useCallback } from "react";

import {
  ItemProp,
  SLOT_MACHINE_EXTRA_BATCHES,
} from "@/components/machine/SlotMachine";

export function useSlotMachineHook({
  choices,
  spinDuration,
}: {
  choices: ItemProp[];
  spinDuration: number;
}) {
  // create n batches and shuffle choices within each batch before joining them
  const shuffledSlots = useCallback(() => {
    const batches =
      calculateSlotCount(spinDuration) / choices.length +
      SLOT_MACHINE_EXTRA_BATCHES;
    const slots = [];
    // shuffle a batch of choices and append to slots
    for (let i = 0; i < batches; i++) {
      slots.push(...choices.sort(() => Math.random() - 0.5));
    }
    return slots;
  }, [spinDuration, choices]);

  return {
    shuffledSlots,
  };
}

// calculate the number of items to display depending on duration
function calculateSlotCount(duration: number): number {
  // i want slot to pass by 10 items per second
  const SLOTS_PER_SECOND = 10;
  return Math.floor((duration / 1000) * SLOTS_PER_SECOND);
}
