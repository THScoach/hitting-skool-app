type TempoInputsTime = {
  mode: "time";
  loadStart: number;
  fireStart: number;
  contact: number;
};

type TempoInputsFrames = {
  mode: "frames";
  fps: number;
  loadFrame: number;
  fireFrame: number;
  contactFrame: number;
};

type TempoInputs = TempoInputsTime | TempoInputsFrames;

type TempoResult = {
  loadPhase: number;
  firePhase: number;
  tempoRatio: number;
  bucket: "rushed" | "green" | "yellow" | "drifty";
  label: string;
  cue: string;
};

export function calculateTempo(inputs: TempoInputs): TempoResult {
  let loadStart: number;
  let fireStart: number;
  let contact: number;

  // Convert frames to seconds if in frames mode
  if (inputs.mode === "frames") {
    loadStart = inputs.loadFrame / inputs.fps;
    fireStart = inputs.fireFrame / inputs.fps;
    contact = inputs.contactFrame / inputs.fps;
  } else {
    loadStart = inputs.loadStart;
    fireStart = inputs.fireStart;
    contact = inputs.contact;
  }

  // Validate order: load < fire < contact
  if (loadStart >= fireStart || fireStart >= contact) {
    throw new Error("Invalid order: load must be before fire, and fire must be before contact");
  }

  // Calculate phases
  const loadPhase = fireStart - loadStart;
  const firePhase = contact - fireStart;
  
  // Calculate tempo ratio (2 decimal rounding)
  const tempoRatio = Math.round((loadPhase / firePhase) * 100) / 100;

  // Determine bucket
  let bucket: "rushed" | "green" | "yellow" | "drifty";
  if (tempoRatio < 1.8) {
    bucket = "rushed";
  } else if (tempoRatio >= 1.8 && tempoRatio <= 2.6) {
    bucket = "green";
  } else if (tempoRatio >= 2.7 && tempoRatio <= 3.2) {
    bucket = "yellow";
  } else {
    bucket = "drifty";
  }

  // Map bucket to label and cue
  const bucketMap: Record<"rushed" | "green" | "yellow" | "drifty", { label: string; cue: string }> = {
    rushed: {
      label: "Rushed",
      cue: "Slow down your load phase. Focus on a smoother, more controlled backswing.",
    },
    green: {
      label: "Green",
      cue: "Great tempo! Maintain this rhythm for consistent performance.",
    },
    yellow: {
      label: "Yellow",
      cue: "Slightly slow down your load phase. Aim for a more balanced tempo.",
    },
    drifty: {
      label: "Drifty",
      cue: "Your load phase is too slow. Speed up your backswing while maintaining control.",
    },
  };

  const { label, cue } = bucketMap[bucket];

  return {
    loadPhase: Math.round(loadPhase * 100) / 100,
    firePhase: Math.round(firePhase * 100) / 100,
    tempoRatio,
    bucket,
    label,
    cue,
  };
}

export type { TempoInputs, TempoInputsTime, TempoInputsFrames, TempoResult };
