"use client";

import { useState } from "react";

interface GradientPickerProps {
  fromColor: string;
  toColor: string;
  direction: string;
  onChange: (gradient: { from: string; to: string; direction: string }) => void;
}

const predefinedGradients = [
  { from: "#4f46e5", to: "#7c3aed", name: "Indigo Purple" },
  { from: "#0ea5e9", to: "#6366f1", name: "Sky Indigo" },
  { from: "#ec4899", to: "#8b5cf6", name: "Pink Purple" },
  { from: "#10b981", to: "#3b82f6", name: "Emerald Blue" },
  { from: "#f59e0b", to: "#ef4444", name: "Amber Red" },
  { from: "#06b6d4", to: "#10b981", name: "Cyan Emerald" },
  { from: "#1e293b", to: "#475569", name: "Slate Dark" },
  { from: "#111827", to: "#1f2937", name: "Gray Dark" },
];

const directions = [
  { value: "to right", label: "→ Right" },
  { value: "to left", label: "← Left" },
  { value: "to bottom", label: "↓ Down" },
  { value: "to top", label: "↑ Up" },
  { value: "to bottom right", label: "↘ Diagonal" },
  { value: "to top right", label: "↗ Diagonal Up" },
];

export default function GradientPicker({
  fromColor,
  toColor,
  direction,
  onChange,
}: GradientPickerProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  const currentGradient = `linear-gradient(${direction}, ${fromColor}, ${toColor})`;

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="w-full h-24 rounded-xl shadow-inner"
        style={{ background: currentGradient }}
      />

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("presets")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "presets"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "custom"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Custom
        </button>
      </div>

      {activeTab === "presets" ? (
        <div className="grid grid-cols-4 gap-2">
          {predefinedGradients.map((gradient) => (
            <button
              key={gradient.name}
              onClick={() =>
                onChange({ from: gradient.from, to: gradient.to, direction })
              }
              className={`h-12 rounded-lg transition-all hover:scale-105 ${
                fromColor === gradient.from && toColor === gradient.to
                  ? "ring-2 ring-blue-600 ring-offset-2"
                  : ""
              }`}
              style={{
                background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
              }}
              title={gradient.name}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fromColor}
                  onChange={(e) =>
                    onChange({ from: e.target.value, to: toColor, direction })
                  }
                  className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={fromColor}
                  onChange={(e) =>
                    onChange({ from: e.target.value, to: toColor, direction })
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={toColor}
                  onChange={(e) =>
                    onChange({ from: fromColor, to: e.target.value, direction })
                  }
                  className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={toColor}
                  onChange={(e) =>
                    onChange({ from: fromColor, to: e.target.value, direction })
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Direction
        </label>
        <div className="grid grid-cols-3 gap-2">
          {directions.map((dir) => (
            <button
              key={dir.value}
              onClick={() => onChange({ from: fromColor, to: toColor, direction: dir.value })}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                direction === dir.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {dir.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
