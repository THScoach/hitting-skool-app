export interface TempoInput {
  load: number
  fire: number
  contact: number
}

export interface TempoResult {
  loadPhase: number
  firePhase: number
  tempoRatio: number
  coachingCue: string
  status: 'optimal' | 'too-fast' | 'too-slow'
}

/**
 * Calculate tempo metrics from three timestamps
 * @param input - Object containing load, fire, and contact timestamps (in seconds)
 * @returns TempoResult with phases, ratio, coaching cue, and status
 */
export function calculateTempo(input: TempoInput): TempoResult {
  const { load, fire, contact } = input

  // Validate inputs
  if (load >= fire || fire >= contact) {
    throw new Error('Timestamps must be in order: Load < Fire < Contact')
  }

  // Calculate phases (in seconds)
  const loadPhase = fire - load
  const firePhase = contact - fire

  // Calculate tempo ratio (Load Phase / Fire Phase)
  const tempoRatio = loadPhase / firePhase

  // Determine status and coaching cue
  let status: 'optimal' | 'too-fast' | 'too-slow'
  let coachingCue: string

  if (tempoRatio >= 2.5 && tempoRatio <= 3.5) {
    status = 'optimal'
    coachingCue = 'Excellent tempo! Maintain this rhythm.'
  } else if (tempoRatio < 2.5) {
    status = 'too-fast'
    coachingCue = 'Load phase too quick. Slow down your load for better power.'
  } else {
    status = 'too-slow'
    coachingCue = 'Load phase too slow. Quicker load will improve timing.'
  }

  return {
    loadPhase,
    firePhase,
    tempoRatio,
    coachingCue,
    status,
  }
}

/**
 * Format time in seconds to readable format (e.g., "0.250s")
 */
export function formatTime(seconds: number): string {
  return `${seconds.toFixed(3)}s`
}

/**
 * Format ratio to 2 decimal places
 */
export function formatRatio(ratio: number): string {
  return ratio.toFixed(2)
}
