"use client";

import { SlotReel } from "@/components/machine/SlotReel";
import { useSlotMachineHook } from "@/hooks/useSlotMachineHook";
import { Button } from "@/shadcn-ui/button";
import { useCallback, useMemo, useState } from "react";

export const SLOT_MACHINE_N_REELS = 3;
export const SLOT_MACHINE_SPIN_DURATION = 2000;
export const SLOT_MACHINE_DURATION_OFFSET = 500;
export const SLOT_MACHINE_EXTRA_BATCHES = 3; // extra batches appened to the end to ensure users will never see the end of the reel

export interface ItemProp {
  emoji: string;
  description: string;
}

export function SlotMachine({
  isLoading,
  whoChoices,
  whatChoices,
  howChoices,
  onSpin,
}: {
  isLoading: boolean;
  whoChoices: ItemProp[];
  whatChoices: ItemProp[];
  howChoices: ItemProp[];
  onSpin?: (selectedItems: ItemProp[]) => void;
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [chosenWho, setChosenWho] = useState<ItemProp | null>(null);
  const [chosenWhat, setChosenWhat] = useState<ItemProp | null>(null);
  const [chosenHow, setChosenHow] = useState<ItemProp | null>(null);
  const spinDurations = useMemo(
    () =>
      Array(SLOT_MACHINE_N_REELS)
        .fill(SLOT_MACHINE_SPIN_DURATION)
        .map(
          (duration, index) => duration + index * SLOT_MACHINE_DURATION_OFFSET
        ),
    []
  );
  const { shuffledSlots: shuffleWho } = useSlotMachineHook({
    choices: whoChoices,
    spinDuration: spinDurations[0],
  });
  const { shuffledSlots: shuffleWhat } = useSlotMachineHook({
    choices: whatChoices,
    spinDuration: spinDurations[1],
  });
  const { shuffledSlots: shuffleHow } = useSlotMachineHook({
    choices: howChoices,
    spinDuration: spinDurations[2],
  });
  const [who, setWho] = useState<ItemProp[]>(() => shuffleWho());
  const [what, setWhat] = useState<ItemProp[]>(() => shuffleWhat());
  const [how, setHow] = useState<ItemProp[]>(() => shuffleHow());

  // choose random items from each reel, and call onSpin callback
  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    const whoChoice = getRandomItem(whoChoices);
    const whatChoice = getRandomItem(whatChoices);
    const howChoice = getRandomItem(howChoices);

    setChosenWho(whoChoice);
    setChosenWhat(whatChoice);
    setChosenHow(howChoice);

    const chosenItems = [whoChoice, whatChoice, howChoice];
    chosenItems.forEach((item) => console.log(item.emoji));
    onSpin?.(chosenItems);

    const maxDuration = Math.max(...spinDurations);
    const timeout = setTimeout(() => {
      // re-shuffle the reels after the spin
      setIsSpinning(false);
      setWho(shuffleWho());
      setWhat(shuffleWhat());
      setHow(shuffleHow());
    }, maxDuration + 1500); // extra 1.5 seconds to let the reels settle
    return () => clearTimeout(timeout);
  }, [
    whoChoices,
    whatChoices,
    howChoices,
    spinDurations,
    isSpinning,
    shuffleWho,
    shuffleWhat,
    shuffleHow,
    setChosenWho,
    setChosenWhat,
    setChosenHow,
    onSpin,
    setWho,
    setWhat,
    setHow,
  ]);

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
      <div className="flex p-8 gap-4 min-w-[30rem] min-h-[20rem] lg:min-w-[40rem] lg:min-h-[30rem]">
        {/* TODO: implement illusion of infinite spin */}
        <SlotReel
          choices={whoChoices}
          isLoading={isLoading}
          isSpinning={isSpinning}
          chosenItem={chosenWho}
          slots={who}
          spinDuration={spinDurations[0]}
        />
        <SlotReel
          choices={whatChoices}
          isLoading={isLoading}
          isSpinning={isSpinning}
          chosenItem={chosenWhat}
          slots={what}
          spinDuration={spinDurations[1]}
        />
        <SlotReel
          choices={howChoices}
          isLoading={isLoading}
          isSpinning={isSpinning}
          chosenItem={chosenHow}
          slots={how}
          spinDuration={spinDurations[2]}
        />
      </div>
      <Button
        onClick={handleSpinClick}
        disabled={isSpinning}
        size="lg"
        className="w-32"
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </Button>
    </div>
  );
}

function getRandomItem(choices: ItemProp[]) {
  return choices[Math.floor(Math.random() * choices.length)];
}
