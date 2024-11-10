import { SLOT_MACHINE_EXTRA_BATCHES } from "@/components/machine/SlotMachine";
import { ItemProp } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export function SlotReel({
  // choices = ["🍎", "🍋", "🍒", "🍉", "🍇", "🍌"]
  choices,
  // whether the reel is spinning
  isSpinning,
  // the chosen slot to land on
  chosenItem,
  // the slots to display
  slots,
  // how long the reel will spin for
  spinDuration,
}: {
  choices: ItemProp[];
  isSpinning: boolean;
  chosenItem: ItemProp | null;
  slots: ItemProp[];
  spinDuration: number;
}) {
  // calculate the position to land on, by filtering out the extra batches
  const targetPosition = useMemo(() => {
    if (!chosenItem) return 0;
    const slotCount =
      slots.length - SLOT_MACHINE_EXTRA_BATCHES * choices?.length;
    const lastIndex = slots.slice(0, slotCount).lastIndexOf(chosenItem);
    const position = lastIndex > -1 ? lastIndex : 0;

    // TODO: find neighbors to implement illusion of continuous spin
    // const neighbors = slots.slice(position - 1, position + 2);
    // onFindNeighbors(neighbors);
    return position;
  }, [slots, chosenItem, choices]);

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{
        height: "calc(3 * 8rem)",
        userSelect: "none",
        scrollbarWidth: "none",
        pointerEvents: "none",
      }}
    >
      <div
        className="flex flex-col"
        style={{
          transform: isSpinning
            ? `translateY(-${(targetPosition - 1) * 8}rem)`
            : undefined,
          transition: isSpinning
            ? `transform ${spinDuration}ms cubic-bezier(0.2, 0.1, 0.8, 1)`
            : undefined,
        }}
      >
        {slots.map((item, index) => (
          <SlotWrapper key={index}>{item.emoji}</SlotWrapper>
        ))}
      </div>
    </div>
  );
}

function SlotWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-2 text-center flex items-center justify-center font-bold text-4xl"
      style={{ height: "8rem", width: "8rem" }}
    >
      {children}
    </div>
  );
}
