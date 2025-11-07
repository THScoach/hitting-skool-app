'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

type Mode = 'time' | 'frames';

type TimeInputs = {
  loadStart: string;
  fireStart: string;
  contact: string;
};

type FrameInputs = {
  fps: string;
  loadStart: string;
  fireStart: string;
  contact: string;
};

type ResultState = {
  ratio: number;
  statusLabel: string;
  statusMessage: string;
  coachingCue: string;
  statusColor: string;
};

const initialTimeInputs: TimeInputs = {
  loadStart: '',
  fireStart: '',
  contact: '',
};

const initialFrameInputs: FrameInputs = {
  fps: '',
  loadStart: '',
  fireStart: '',
  contact: '',
};

export default function TempoAnalyzerPage() {
  const [mode, setMode] = useState<Mode>('time');
  const [timeInputs, setTimeInputs] = useState<TimeInputs>(initialTimeInputs);
  const [frameInputs, setFrameInputs] = useState<FrameInputs>(initialFrameInputs);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<ResultState | null>(null);

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
    setResult(null);
  };

  const handleTimeChange =
    (field: keyof TimeInputs) => (event: ChangeEvent<HTMLInputElement>) => {
      setTimeInputs((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError('');
      setResult(null);
    };

  const handleFrameChange =
    (field: keyof FrameInputs) => (event: ChangeEvent<HTMLInputElement>) => {
      setFrameInputs((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setError('');
      setResult(null);
    };

  const determineResult = (tempoRatio: number): ResultState => {
    if (tempoRatio < 1.8) {
      return {
        ratio: tempoRatio,
        statusLabel: "Red - Rushed. You're firing before you're anchored.",
        statusMessage: 'Tempo Ratio is on the rushed side.',
        coachingCue: 'Slow down your gather. Let the load breathe before you fire.',
        statusColor: 'text-red-400',
      };
    }

    if (tempoRatio <= 2.6) {
      return {
        ratio: tempoRatio,
        statusLabel: 'Green - Efficient, game-ready tempo.',
        statusMessage: 'Tempo Ratio is in the efficient window.',
        coachingCue: 'Stay here. This is a strong attack window. Keep your move simple.',
        statusColor: 'text-green-400',
      };
    }

    if (tempoRatio <= 3.2) {
      return {
        ratio: tempoRatio,
        statusLabel: 'Yellow - Slightly slow. Good for some patterns, but monitor drift.',
        statusMessage: 'Tempo Ratio is edging slow.',
        coachingCue: "Tighten up your move. Start your load earlier so you don't float.",
        statusColor: 'text-yellow-300',
      };
    }

    return {
      ratio: tempoRatio,
      statusLabel: "Red - Drifty. You're giving the pitcher too big a window.",
      statusMessage: 'Tempo Ratio is drifting long.',
      coachingCue: 'Control your forward move. Anchor before launch instead of drifting.',
      statusColor: 'text-red-400',
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (mode === 'time') {
      const { loadStart, fireStart, contact } = timeInputs;

      if (!loadStart || !fireStart || !contact) {
        setError('Please fill in all time fields.');
        return;
      }

      const loadStartSeconds = Number.parseFloat(loadStart);
      const fireStartSeconds = Number.parseFloat(fireStart);
      const contactSeconds = Number.parseFloat(contact);

      if (
        Number.isNaN(loadStartSeconds) ||
        Number.isNaN(fireStartSeconds) ||
        Number.isNaN(contactSeconds)
      ) {
        setError('Time inputs must be valid numbers.');
        return;
      }

      if (!(loadStartSeconds < fireStartSeconds && fireStartSeconds < contactSeconds)) {
        setError('Ensure Load Start < Fire Start < Contact.');
        return;
      }

      const loadPhase = fireStartSeconds - loadStartSeconds;
      const firePhase = contactSeconds - fireStartSeconds;
      const tempoRatio = Number(loadPhase / firePhase);

      setResult(determineResult(Number.parseFloat(tempoRatio.toFixed(2))));
      return;
    }

    const { fps, loadStart, fireStart, contact } = frameInputs;

    if (!fps || !loadStart || !fireStart || !contact) {
      setError('Please fill in all frame fields.');
      return;
    }

    const fpsValue = Number.parseFloat(fps);
    const loadStartFrame = Number.parseFloat(loadStart);
    const fireStartFrame = Number.parseFloat(fireStart);
    const contactFrame = Number.parseFloat(contact);

    if (
      Number.isNaN(fpsValue) ||
      Number.isNaN(loadStartFrame) ||
      Number.isNaN(fireStartFrame) ||
      Number.isNaN(contactFrame)
    ) {
      setError('Frame inputs must be valid numbers.');
      return;
    }

    if (fpsValue <= 0) {
      setError('Frames Per Second must be greater than 0.');
      return;
    }

    if (!(loadStartFrame < fireStartFrame && fireStartFrame < contactFrame)) {
      setError('Ensure Load Start < Fire Start < Contact.');
      return;
    }

    const loadStartSeconds = loadStartFrame / fpsValue;
    const fireStartSeconds = fireStartFrame / fpsValue;
    const contactSeconds = contactFrame / fpsValue;

    const loadPhase = fireStartSeconds - loadStartSeconds;
    const firePhase = contactSeconds - fireStartSeconds;
    const tempoRatio = Number(loadPhase / firePhase);

    setResult(determineResult(Number.parseFloat(tempoRatio.toFixed(2))));
  };

  const renderTimeInputs = () => (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="loadStartTime">
          Load Start (seconds)
        </label>
        <input
          id="loadStartTime"
          type="number"
          step="any"
          value={timeInputs.loadStart}
          onChange={handleTimeChange('loadStart')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 0.35"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="fireStartTime">
          Fire Start (seconds)
        </label>
        <input
          id="fireStartTime"
          type="number"
          step="any"
          value={timeInputs.fireStart}
          onChange={handleTimeChange('fireStart')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 0.82"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="contactTime">
          Contact (seconds)
        </label>
        <input
          id="contactTime"
          type="number"
          step="any"
          value={timeInputs.contact}
          onChange={handleTimeChange('contact')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 1.05"
        />
      </div>
    </div>
  );

  const renderFrameInputs = () => (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="fps">
          Frames Per Second (FPS)
        </label>
        <input
          id="fps"
          type="number"
          step="any"
          value={frameInputs.fps}
          onChange={handleFrameChange('fps')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 240"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="loadStartFrame">
          Load Start Frame
        </label>
        <input
          id="loadStartFrame"
          type="number"
          step="any"
          value={frameInputs.loadStart}
          onChange={handleFrameChange('loadStart')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 24"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="fireStartFrame">
          Fire Start Frame
        </label>
        <input
          id="fireStartFrame"
          type="number"
          step="any"
          value={frameInputs.fireStart}
          onChange={handleFrameChange('fireStart')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 56"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-white/80 mb-2" htmlFor="contactFrame">
          Contact Frame
        </label>
        <input
          id="contactFrame"
          type="number"
          step="any"
          value={frameInputs.contact}
          onChange={handleFrameChange('contact')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 78"
        />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-300/70">
              The Hitting Skool
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">HITS Tempo Analyzer (MVP)</h1>
            <p className="text-base text-white/70">
              A simple free tool from The Hitting Skool to measure your swing tempo.
            </p>
          </header>

          <section className="mt-8 space-y-6">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Input Mode
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleModeChange('time')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${
                    mode === 'time'
                      ? 'border-blue-400 bg-blue-500/20 text-white focus:ring-blue-400'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 focus:ring-white/20'
                  }`}
                >
                  Use Time (seconds)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('frames')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${
                    mode === 'frames'
                      ? 'border-blue-400 bg-blue-500/20 text-white focus:ring-blue-400'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 focus:ring-white/20'
                  }`}
                >
                  Use Frames (with FPS)
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {mode === 'time' ? renderTimeInputs() : renderFrameInputs()}

              {error ? (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
              >
                Calculate Tempo
              </button>
            </form>
          </section>

          {result ? (
            <section className="mt-8 rounded-2xl border border-white/10 bg-black/50 p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Results</p>
                  <p className="mt-2 text-2xl font-semibold">
                    Tempo Ratio:{' '}
                    <span className={`${result.statusColor}`}>{result.ratio.toFixed(2)} : 1</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className={`text-base font-semibold ${result.statusColor}`}>
                    {result.statusLabel}
                  </p>
                  <p className="text-sm text-white/70">{result.statusMessage}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                    Coaching Cue
                  </p>
                  <p className="mt-2 text-sm text-white/80">{result.coachingCue}</p>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
