import { SLOT_MACHINE_EXTRA_BATCHES } from "@/components/machine/SlotMachine";
import { useMemo } from "react";

export function SlotReel({
  // items = ["🍎", "🍋", "🍒", "🍉", "🍇", "🍌"]
  choices: uniqueItems,
  // whether the reel is spinning
  isSpinning,
  // the chosen slot to land on
  chosenItem,
  // the slots to display
  slots,
  // how long the reel will spin for
  spinDuration,
}: {
  choices: string[];
  isSpinning: boolean;
  chosenItem: string;
  slots: string[];
  spinDuration: number;
}) {
  // calculate the position to land on, by filtering out the extra batches
  const targetPosition = useMemo(() => {
    const slotCount =
      slots.length - SLOT_MACHINE_EXTRA_BATCHES * uniqueItems.length;
    const lastIndex = slots.slice(0, slotCount).lastIndexOf(chosenItem);
    const position = lastIndex > -1 ? lastIndex : 0;

    // TODO: find neighbors to implement illusion of continuous spin
    // const neighbors = slots.slice(position - 1, position + 2);
    // onFindNeighbors(neighbors);
    return position;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, chosenItem, uniqueItems.length]);

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{
        height: "calc(3 * 4rem)",
        userSelect: "none",
        scrollbarWidth: "none",
        pointerEvents: "none",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          transform: isSpinning
            ? `translateY(-${(targetPosition - 1) * 4}rem)`
            : undefined,
          transition: isSpinning
            ? `transform ${spinDuration}ms cubic-bezier(0.2, 0.1, 0.8, 1)`
            : undefined,
        }}
      >
        {slots.map((item, index) => (
          <div
            key={index}
            className="border-2 border-pink-500 text-center flex items-center justify-center font-bold text-4xl"
            style={{ height: "4rem", width: "4rem" }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
