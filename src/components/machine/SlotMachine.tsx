"use client";

import { SlotReel } from "@/components/machine/SlotReel";
import { Button } from "@/shadcn-ui/button";
import { useCallback, useMemo, useState } from "react";

export const SLOT_MACHINE_N_REELS = 3;
export const SLOT_MACHINE_SPIN_DURATION = 2000;
export const SLOT_MACHINE_DURATION_OFFSET = 500;
export const SLOT_MACHINE_EXTRA_BATCHES = 3; // extra batches appened to the end to ensure users will never see the end of the reel

export function SlotMachine() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [chosenItems, setChosenItems] = useState<string[]>([]);

  const CHOICES = useMemo(() => ["🍎", "🍋", "🍒", "🍉", "🍇", "🍌"], []);
  const emptyArray = useMemo(() => Array(SLOT_MACHINE_N_REELS), []);
  const reels = useMemo(() => emptyArray.fill(CHOICES), [CHOICES, emptyArray]);
  const spinDurations = useMemo(
    () =>
      emptyArray
        .fill(SLOT_MACHINE_SPIN_DURATION)
        .map(
          (duration, index) => duration + index * SLOT_MACHINE_DURATION_OFFSET
        ),
    [emptyArray]
  );

  // create n batches and shuffle choices within each batch before joining them
  const shuffledSlots = useCallback(() => {
    return emptyArray.fill(CHOICES).map((_, index) => {
      const batches =
        calculateSlotCount(spinDurations[index]) / CHOICES.length +
        SLOT_MACHINE_EXTRA_BATCHES;
      const slots = [];
      // shuffle a batch of choices and append to slots
      for (let i = 0; i < batches; i++) {
        slots.push(...CHOICES.sort(() => Math.random() - 0.5));
      }
      return slots;
    });
  }, [emptyArray, spinDurations, CHOICES]);

  // slots to display for each reel
  const [slotsDisplay, setSlotsDisplay] = useState<string[][]>(() =>
    shuffledSlots()
  );

  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    setChosenItems(
      reels.map((reel) => CHOICES[Math.floor(Math.random() * reel.length)])
    );

    const maxDuration = Math.max(...spinDurations);
    const timeout = setTimeout(() => {
      setIsSpinning(false);
      setSlotsDisplay(shuffledSlots());
    }, maxDuration + 1000);
    return () => clearTimeout(timeout);
  }, [reels, spinDurations, isSpinning, CHOICES, shuffledSlots]);

  return (
    <>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
        <div className="flex p-8 gap-4">
          {reels.map((reel, index) => (
            // TODO: implement illusion of infinite spin
            <SlotReel
              key={index}
              choices={reel}
              isSpinning={isSpinning}
              chosenItem={chosenItems[index]}
              slots={slotsDisplay[index]}
              spinDuration={spinDurations[index]}
            />
          ))}
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

      {/* render the solution emoji below */}
    </>
  );
}

// calculate the number of items to display depending on duration
function calculateSlotCount(duration: number): number {
  // i want slot to pass by 10 items per second
  const SLOTS_PER_SECOND = 10;
  return Math.floor((duration / 1000) * SLOTS_PER_SECOND);
}
