import { Spin } from "@/lib/utils";
import { Button } from "./shadcn-ui/button";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export interface SpinResultProps extends Spin {
  onClose?: () => void;
}

export function SlotWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-center flex items-center justify-center font-bold text-7xl"
      style={{ height: "10rem", width: "10rem" }}
    >
      {children}
    </div>
  );
}

export default function SpinResult({
  id,
  who,
  what,
  how,
  onClose,
}: SpinResultProps) {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 divide-y divide-gray-200">
        <div className="px-8 py-6">
          <div className="relative">
            <button
              onClick={() => onClose?.()}
              className="absolute -right-4 -top-4 text-gray-400 hover:text-gray-600 text-xl p-2"
            >
              ✕
            </button>
          </div>
          <h3 className="text-center text-2xl font-bold">
            Lucky Spin! You got:
          </h3>
        </div>
        <div className="px-8 py-6">
          <div className="flex justify-center gap-4 mb-6">
            <SlotWrapper>{who.emoji}</SlotWrapper>
            <SlotWrapper>{what.emoji}</SlotWrapper>
            <SlotWrapper>{how.emoji}</SlotWrapper>
          </div>

          <p className="text-center text-xl font-medium">
            {"Chat with " +
              who.description +
              " about " +
              what.description +
              " " +
              how.description}
          </p>
        </div>
        <div className="px-8 py-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onClose?.()}
          >
            Spin Again
          </Button>
          <Button className="w-full" onClick={() => onClose?.()}>
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
}

function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 100,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Fire multiple bursts of confetti
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
