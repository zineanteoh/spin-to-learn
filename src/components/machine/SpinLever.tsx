import { useState, useEffect } from "react";

interface SpinLeverProps {
  onClick: () => void;
  isSpinning?: boolean;
}

export function SpinLever({ onClick, isSpinning = false }: SpinLeverProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-12 bg-gray-50 rounded-lg">
      {/* Lever Container */}
      <div className="relative w-32 h-64">
        {/* Pivot Point */}
        <div className="absolute top-8 left-1/2 w-4 h-4 bg-gray-900 rounded-full -translate-x-1/2" />

        {/* Lever Arm */}
        <div
          onClick={() => !isSpinning && onClick()}
          style={{
            position: "absolute",
            top: "2rem",
            left: "50%",
            transformOrigin: "top center",
            transform: `translateX(-50%) rotate(${
              isSpinning ? "340deg" : "200deg"
            })`,
            transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: isSpinning ? "not-allowed" : "pointer",
          }}
          className="group"
        >
          {/* Lever Stick */}
          <div className="w-2 h-40 bg-gray-900 rounded-full group-hover:bg-gray-700 transition-colors" />

          {/* Handle */}
          <div className="absolute -left-3 bottom-0 w-8 h-8 bg-red-500 rounded-full group-hover:bg-red-400 transition-colors" />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        disabled={isSpinning}
        className={`
          px-6 py-3 font-medium rounded-lg
          transition-colors duration-200
          ${
            isSpinning
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }
        `}
      >
        {isSpinning ? "Spinning..." : "Pull Lever"}
      </button>
    </div>
  );
}
