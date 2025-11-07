export type TempoInput = {
  load: number;
  fire: number;
  contact: number;
};

export type TempoAnalysis =
  | {
      ok: true;
      loadPhase: number;
      firePhase: number;
      tempoRatio: number;
      tempoLabel: string;
      coachingCue: string;
      tone: "success" | "warning" | "danger";
    }
  | {
      ok: false;
      message: string;
    };

const PRECISION = 100;

const toTenth = (value: number) =>
  Math.round((value + Number.EPSILON) * PRECISION) / PRECISION;

export function calculateTempo(input: TempoInput): TempoAnalysis {
  const { load, fire, contact } = input;

  if ([load, fire, contact].some((value) => Number.isNaN(value))) {
    return { ok: false, message: "All timestamps must be valid numbers." };
  }

  if (load < 0 || fire < 0 || contact < 0) {
    return { ok: false, message: "Timestamps cannot be negative." };
  }

  if (!(load < fire && fire < contact)) {
    return {
      ok: false,
      message: "Use increasing timestamps in the order: Load < Fire < Contact.",
    };
  }

  const rawLoadPhase = fire - load;
  const rawFirePhase = contact - fire;

  if (rawLoadPhase <= 0 || rawFirePhase <= 0) {
    return {
      ok: false,
      message: "Phase durations must be greater than zero.",
    };
  }

  const loadPhase = toTenth(rawLoadPhase);
  const firePhase = toTenth(rawFirePhase);
  const tempoRatio = toTenth(loadPhase / firePhase);

  const { tempoLabel, coachingCue, tone } = classifyTempo(tempoRatio);

  return {
    ok: true,
    loadPhase,
    firePhase,
    tempoRatio,
    tempoLabel,
    coachingCue,
    tone,
  };
}

function classifyTempo(ratio: number): Pick<
  Extract<TempoAnalysis, { ok: true }>,
  "tempoLabel" | "coachingCue" | "tone"
> {
  if (ratio >= 2.8 && ratio <= 3.2) {
    return {
      tempoLabel: "Dialed 3:1 Tempo",
      coachingCue: "Stay smooth through launch—keep counting 1-2-3 to contact.",
      tone: "success",
    };
  }

  if (ratio < 2.0) {
    return {
      tempoLabel: "Quick Trigger",
      coachingCue: "Breathe and lengthen the load—let the barrel feel heavy first.",
      tone: "danger",
    };
  }

  if (ratio < 2.8) {
    return {
      tempoLabel: "Rushing Contact",
      coachingCue: "Stretch the load phase—think 'gather, gather, go.'",
      tone: "warning",
    };
  }

  if (ratio > 3.8) {
    return {
      tempoLabel: "Late Acceleration",
      coachingCue: "Drive sooner—fire the hips right off the backside stack.",
      tone: "danger",
    };
  }

  return {
    tempoLabel: "Draggy Finish",
    coachingCue: "Keep intent through contact—finish aggressive, not lazy.",
    tone: "warning",
  };
}
