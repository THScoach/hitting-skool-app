"use client";

import { calculateTempo, type TempoInputs } from "@/src/lib/tempo";
import { useState } from "react";

export default function TempoCalculator() {
  const [mode, setMode] = useState<"time" | "frames">("time");
  const [inputs, setInputs] = useState<TempoInputs>({
    mode: "time",
    loadStart: 0,
    fireStart: 0,
    contact: 0,
  });
  const [result, setResult] = useState<ReturnType<typeof calculateTempo> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const calculated = calculateTempo(inputs);
      setResult(calculated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setResult(null);
    }
  };

  const handleModeChange = (newMode: "time" | "frames") => {
    setMode(newMode);
    if (newMode === "time") {
      setInputs({
        mode: "time",
        loadStart: 0,
        fireStart: 0,
        contact: 0,
      });
    } else {
      setInputs({
        mode: "frames",
        fps: 30,
        loadFrame: 0,
        fireFrame: 0,
        contactFrame: 0,
      });
    }
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tempo Calculator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Mode:</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="time"
              checked={mode === "time"}
              onChange={() => handleModeChange("time")}
            />
            Time (seconds)
          </label>
          <label>
            <input
              type="radio"
              value="frames"
              checked={mode === "frames"}
              onChange={() => handleModeChange("frames")}
            />
            Frames
          </label>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {mode === "time" ? (
          <>
            <div>
              <label className="block">Load Start (seconds):</label>
              <input
                type="number"
                step="0.01"
                value={inputs.mode === "time" ? inputs.loadStart : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "time",
                    loadStart: parseFloat(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Fire Start (seconds):</label>
              <input
                type="number"
                step="0.01"
                value={inputs.mode === "time" ? inputs.fireStart : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "time",
                    fireStart: parseFloat(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Contact (seconds):</label>
              <input
                type="number"
                step="0.01"
                value={inputs.mode === "time" ? inputs.contact : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "time",
                    contact: parseFloat(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block">FPS:</label>
              <input
                type="number"
                value={inputs.mode === "frames" ? inputs.fps : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "frames",
                    fps: parseInt(e.target.value) || 30,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Load Frame:</label>
              <input
                type="number"
                value={inputs.mode === "frames" ? inputs.loadFrame : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "frames",
                    loadFrame: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Fire Frame:</label>
              <input
                type="number"
                value={inputs.mode === "frames" ? inputs.fireFrame : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "frames",
                    fireFrame: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Contact Frame:</label>
              <input
                type="number"
                value={inputs.mode === "frames" ? inputs.contactFrame : ""}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    mode: "frames",
                    contactFrame: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full"
              />
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Calculate Tempo
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <p>Load Phase: {result.loadPhase}s</p>
          <p>Fire Phase: {result.firePhase}s</p>
          <p>Tempo Ratio: {result.tempoRatio}</p>
          <p>
            Bucket: <span className="font-bold">{result.label}</span>
          </p>
          <p className="mt-2">{result.cue}</p>
        </div>
      )}
    </div>
  );
}
