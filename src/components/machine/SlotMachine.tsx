"use client";

import { SlotReel } from "@/components/machine/SlotReel";
import { useSidebar } from "@/context/SidebarContext";
import { useAudioHook } from "@/hooks/useAudioHook";
import { useSlotMachineHook } from "@/hooks/useSlotMachineHook";
import { ItemProp } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import SpinResult from "../SpinResult";
import { SpinLever } from "./SpinLever";

export const SLOT_MACHINE_N_REELS = 3;
export const SLOT_MACHINE_SPIN_DURATION = 2000;
export const SLOT_MACHINE_DURATION_OFFSET = 500;
export const SLOT_MACHINE_EXTRA_BATCHES = 3; // extra batches appened to the end to ensure users will never see the end of the reel

export function SlotMachine({
  whoChoices,
  whatChoices,
  howChoices,
  onSpin,
}: {
  whoChoices: ItemProp[];
  whatChoices: ItemProp[];
  howChoices: ItemProp[];
  onSpin?: (selectedItems: ItemProp[]) => void;
}) {
  const router = useRouter();
  const { refreshSpins, setActiveTab } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { playSound, stopSound, stopAllSounds } = useAudioHook();

  // choose random items from each reel, and call onSpin callback
  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    // play spin sound
    playSound("spin");

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

    // play megaWin sound for each reel stop
    spinDurations.forEach((duration) => {
      setTimeout(() => {
        playSound("jukebox", "bigWin");
      }, duration);
    });

    const timeout = setTimeout(() => {
      // re-shuffle the reels after the spin
      setIsSpinning(false);
      setWho(shuffleWho());
      setWhat(shuffleWhat());
      setHow(shuffleHow());
      setIsModalOpen(true);
      stopSound("spin");
      playSound("jukebox", "megaWin");
      setActiveTab("spins");

      (async () => {
        await refreshSpins();
      })();
    }, maxDuration + 1000); // extra 1 second to let the reels settle
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
    setIsModalOpen,
    playSound,
    stopSound,
    refreshSpins,
  ]);

  return (
    <div className="min-h-[100vh] flex flex-1 items-center justify-center min-h-min bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg">
      <div className="bg-white p-12 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold text-center mb-6 text-purple-600">
          Spin to learn!
        </h1>
        {isModalOpen && chosenWho && chosenWhat && chosenHow && (
          <SpinResult
            id={""}
            who={chosenWho}
            what={chosenWhat}
            how={chosenHow}
            onClose={() => {
              setIsModalOpen(false);
            }}
            onStartChat={() => {
              setIsModalOpen(false);
              const spinId = localStorage.getItem("spinId");
              if (spinId) {
                const decodedSpinId = decodeURIComponent(spinId).replaceAll(
                  '"',
                  ""
                );
                router.push(`/spin/${decodedSpinId}/conversation/new`);
              }
            }}
          />
        )}
        <div className="flex items-center gap-8">
          <div className="flex p-8 gap-4 rounded-lg">
            <SlotReel
              choices={whoChoices}
              isSpinning={isSpinning}
              chosenItem={chosenWho}
              slots={who}
              spinDuration={spinDurations[0]}
            />
            <SlotReel
              choices={whatChoices}
              isSpinning={isSpinning}
              chosenItem={chosenWhat}
              slots={what}
              spinDuration={spinDurations[1]}
            />
            <SlotReel
              choices={howChoices}
              isSpinning={isSpinning}
              chosenItem={chosenHow}
              slots={how}
              spinDuration={spinDurations[2]}
            />
          </div>
          <SpinLever onClick={handleSpinClick} isSpinning={isSpinning} />
        </div>
      </div>
    </div>
  );
}

function getRandomItem(choices: ItemProp[]) {
  return choices[Math.floor(Math.random() * choices.length)];
}
