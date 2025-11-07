"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { calculateTempo } from "@/lib/tempo";

type TimestampKey = "load" | "fire" | "contact";

const inputLabels: Record<TimestampKey, string> = {
  load: "Load",
  fire: "Fire",
  contact: "Contact",
};

const toneStyles: Record<
  "success" | "warning" | "danger",
  { ring: string; gradient: string; accent: string }
> = {
  success: {
    ring: "ring-success/60",
    gradient: "from-primary-500/40 via-success/30 to-primary-500/10",
    accent: "text-success",
  },
  warning: {
    ring: "ring-warning/60",
    gradient: "from-accent-500/40 via-warning/30 to-primary-500/10",
    accent: "text-warning",
  },
  danger: {
    ring: "ring-danger/60",
    gradient: "from-danger/50 via-accent-500/30 to-primary-700/10",
    accent: "text-danger",
  },
};

const unitHint = "Enter timestamps in seconds (decimals allowed).";

export default function TempoPage() {
  const [timestamps, setTimestamps] = useState<Record<TimestampKey, string>>({
    load: "",
    fire: "",
    contact: "",
  });

  const isComplete = useMemo(
    () => Object.values(timestamps).every((value) => value.trim().length > 0),
    [timestamps]
  );

  const analysis = useMemo(() => {
    if (!isComplete) return null;

    const load = Number.parseFloat(timestamps.load);
    const fire = Number.parseFloat(timestamps.fire);
    const contact = Number.parseFloat(timestamps.contact);

    if ([load, fire, contact].some((value) => Number.isNaN(value))) {
      return {
        ok: false,
        message: "Please provide numeric timestamps for every phase.",
      } as const;
    }

    return calculateTempo({ load, fire, contact });
  }, [isComplete, timestamps]);

  const handleChange =
    (key: TimestampKey) => (event: ChangeEvent<HTMLInputElement>) => {
      setTimestamps((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const renderResult = () => {
    if (!analysis) {
      return (
        <div className="rounded-3xl border border-white/5 bg-black/30 p-8 text-sm text-white/60 shadow-inner">
          Enter all three timestamps to see tempo feedback.
        </div>
      );
    }

    if (!analysis.ok) {
      return (
        <div className="rounded-3xl border border-danger/40 bg-danger/10 p-6 text-danger shadow-md">
          {analysis.message}
        </div>
      );
    }

    const tone = toneStyles[analysis.tone];

    return (
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tone.gradient} p-[1px] shadow-xl`}
      >
        <div
          className={`rounded-[calc(1.5rem-2px)] bg-black/80 p-8 ring-1 ${tone.ring}`}
        >
          <div className="flex items-baseline justify-between">
            <p className="text-sm uppercase tracking-[0.35em] text-white/50">
              Tempo Ratio
            </p>
            <span className="text-xs uppercase text-white/40">
              Optimal ≈ 3.0
            </span>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-semibold text-white">
              {analysis.tempoRatio.toFixed(2)}
            </p>
            <span className={`text-sm font-medium ${tone.accent}`}>
              {analysis.tempoLabel}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-white/40">
                Load Phase
              </dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {analysis.loadPhase.toFixed(2)}s
              </dd>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-white/40">
                Fire Phase
              </dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {analysis.firePhase.toFixed(2)}s
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5 text-base leading-relaxed text-white/80">
            {analysis.coachingCue}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.5em] text-primary-500/80">
            Hits Lab
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Tempo Analyzer
          </h1>
          <p className="max-w-2xl text-base text-white/60">
            Feed in your swing timestamps. We calculate load and fire phases,
            surface your tempo ratio, and serve a coaching cue to keep your moves
            explosive.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-white/5 bg-black/40 p-8 shadow-xl backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Timestamps</h2>
            <p className="mt-1 text-sm text-white/50">{unitHint}</p>

            <div className="mt-8 grid gap-6">
              {(Object.keys(inputLabels) as TimestampKey[]).map((key) => (
                <label
                  key={key}
                  className="group space-y-2 rounded-2xl border border-white/5 bg-black/50 p-4 ring-primary-500/10 transition focus-within:ring-4"
                >
                  <span className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                    {inputLabels[key]}
                    <span className="text-[10px] text-white/30">seconds</span>
                  </span>
                  <input
                    inputMode="decimal"
                    value={timestamps[key]}
                    onChange={handleChange(key)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-3xl font-semibold text-white outline-none placeholder:text-white/20"
                  />
                </label>
              ))}
            </div>
          </div>

          {renderResult()}
        </section>

        <footer className="rounded-3xl border border-white/5 bg-black/30 p-6 text-xs text-white/40">
          Tip: Track timestamps in video review or blast sensor data. A balanced
          3:1 ratio keeps your load patient and your launch violent.
        </footer>
      </div>
    </main>
  );
}
