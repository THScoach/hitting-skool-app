"use client";

import { ChangeEvent, useState } from "react";

const timestampFields = [
  {
    id: "loadStart",
    label: "Load Start",
    helper: "When the hitter begins gathering energy.",
  },
  {
    id: "fireStart",
    label: "Fire Start (Launch)",
    helper: "First move toward the ball.",
  },
  {
    id: "contact",
    label: "Contact",
    helper: "Moment the barrel meets the ball.",
  },
] as const;

type TimestampKey = (typeof timestampFields)[number]["id"];

type TempoInsight = {
  tone: "green" | "yellow" | "red";
  headline: string;
  lead: string;
  cue: string;
};

const getTempoInsight = (ratio: number): TempoInsight => {
  if (ratio < 1.8) {
    return {
      tone: "red",
      headline: "Red – Rushed. You're firing before you're loaded.",
      lead: "Delay the launch until you complete the gather to keep power stacked.",
      cue: "Feel the barrel pause at load, then fire once the front side is firm.",
    };
  }

  if (ratio <= 2.6) {
    return {
      tone: "green",
      headline: "Green – Efficient game-ready tempo.",
      lead: "Clean rhythm between storing energy and attacking the ball.",
      cue: "Stay smooth—load with intent and launch on the same beat every time.",
    };
  }

  if (ratio <= 3.2) {
    return {
      tone: "yellow",
      headline: "Yellow – Late / slow commit window. Might be okay for some hitters.",
      lead: "Launch is lagging slightly behind the load, stretching the decision window.",
      cue: "Start the launch a fraction sooner to tighten the commit window.",
    };
  }

  return {
    tone: "red",
    headline: "Red – Drifty / slow. You're stretching the commit window too long.",
    lead: "Energy is leaking as the swing waits to fire after the load.",
    cue: "Lock in the lower half and let the barrel go once you feel stacked.",
  };
};

const toneStyles: Record<TempoInsight["tone"], string> = {
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  yellow: "border-amber-400/50 bg-amber-400/10 text-amber-200",
  red: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

const defaultBadgeStyle = "border-white/20 bg-white/10 text-slate-200";

export default function Home() {
  const [timestamps, setTimestamps] = useState<Record<TimestampKey, string>>({
    loadStart: "",
    fireStart: "",
    contact: "",
  });

  const handleChange =
    (key: TimestampKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setTimestamps((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    };

  const hasAllValues = timestampFields.every(
    (field) => timestamps[field.id].trim() !== "",
  );

  let errorMessage: string | null = null;
  let loadPhase: number | null = null;
  let firePhase: number | null = null;
  let tempoRatio: number | null = null;
  let tempoInsight: TempoInsight | null = null;

  if (hasAllValues) {
    const loadStartValue = Number.parseFloat(timestamps.loadStart);
    const fireStartValue = Number.parseFloat(timestamps.fireStart);
    const contactValue = Number.parseFloat(timestamps.contact);

    if (
      Number.isNaN(loadStartValue) ||
      Number.isNaN(fireStartValue) ||
      Number.isNaN(contactValue)
    ) {
      errorMessage =
        "Please enter numeric values (seconds or frames) in each field.";
    } else if (fireStartValue <= loadStartValue) {
      errorMessage = "Fire Start must be greater than Load Start.";
    } else if (contactValue <= fireStartValue) {
      errorMessage = "Contact must be greater than Fire Start.";
    } else {
      loadPhase = fireStartValue - loadStartValue;
      firePhase = contactValue - fireStartValue;

      if (loadPhase <= 0) {
        errorMessage = "Load Phase must be a positive value.";
      } else if (firePhase <= 0) {
        errorMessage = "Fire Phase must be a positive value.";
      } else {
        tempoRatio = loadPhase / firePhase;
        tempoInsight = getTempoInsight(tempoRatio);
      }
    }
  }

  const tempoRatioDisplay =
    tempoRatio !== null && Number.isFinite(tempoRatio)
      ? tempoRatio.toFixed(2)
      : "--";
  const loadPhaseDisplay =
    loadPhase !== null && Number.isFinite(loadPhase)
      ? loadPhase.toFixed(2)
      : "--";
  const firePhaseDisplay =
    firePhase !== null && Number.isFinite(firePhase)
      ? firePhase.toFixed(2)
      : "--";

  const statusBadgeClass = tempoInsight
    ? toneStyles[tempoInsight.tone]
    : defaultBadgeStyle;

  const statusBadgeLabel = tempoInsight
    ? tempoInsight.headline.split("–")[0]?.trim()
    : "Awaiting Data";

  const headlineText =
    errorMessage ??
    (tempoInsight
      ? tempoInsight.headline
      : "Enter all three timestamps to generate a tempo report.");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.18),_transparent_50%)]" />
      </div>

      <main className="w-full max-w-5xl space-y-10 rounded-3xl border border-white/15 bg-slate-950/80 p-8 shadow-2xl backdrop-blur md:p-12">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300">
            HITS Tempo App
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Measure Load-to-Fire Rhythm
          </h1>
          <p className="text-sm text-slate-300 sm:text-base">
            Input three swing timestamps in seconds or frames to instantly see
            the tempo ratio, a quick interpretation, and one coaching cue in a
            familiar HITS-style report.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <form className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner sm:p-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Timestamp Inputs
              </h2>
              <p className="text-sm text-slate-400">
                Use the same unit for each entry—seconds or frames both work.
              </p>
            </div>
            <div className="grid gap-5">
              {timestampFields.map((field) => (
                <label key={field.id} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-200">
                    {field.label}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    className="w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    placeholder="0.00"
                    value={timestamps[field.id]}
                    onChange={handleChange(field.id)}
                  />
                  <span className="text-xs text-slate-400">
                    {field.helper}
                  </span>
                </label>
              ))}
            </div>
          </form>

          <aside className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner sm:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Tempo Ratio
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass}`}
                >
                  {statusBadgeLabel}
                </span>
              </div>

              <p className="text-5xl font-semibold text-white sm:text-6xl">
                {tempoRatioDisplay}
              </p>

              <p className="text-sm text-slate-300">{headlineText}</p>
              {tempoInsight && (
                <p className="text-sm text-slate-400">{tempoInsight.lead}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Load Phase
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {loadPhaseDisplay}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Fire Start − Load Start
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Fire Phase
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {firePhaseDisplay}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Contact − Fire Start
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-100">
                  Key Coaching Cue
                </p>
                <p className="mt-2 text-sm text-sky-50">
                  {tempoInsight
                    ? tempoInsight.cue
                    : "Dial in the three timestamps to surface a coaching cue for your swing tempo."}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
