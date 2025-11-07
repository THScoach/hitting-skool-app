'use client';

import { useState } from 'react';

type InputMode = 'time' | 'frames';

interface TimeInputs {
  loadStart: string;
  fireStart: string;
  contact: string;
}

interface FrameInputs {
  fps: string;
  loadStartFrame: string;
  fireStartFrame: string;
  contactFrame: string;
}

interface Results {
  tempoRatio: number;
  status: 'green' | 'yellow' | 'red';
  message: string;
  coachingCue: string;
}

export default function TempoAnalyzer() {
  const [inputMode, setInputMode] = useState<InputMode>('time');
  const [timeInputs, setTimeInputs] = useState<TimeInputs>({
    loadStart: '',
    fireStart: '',
    contact: '',
  });
  const [frameInputs, setFrameInputs] = useState<FrameInputs>({
    fps: '',
    loadStartFrame: '',
    fireStartFrame: '',
    contactFrame: '',
  });
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string>('');

  const handleTimeInputChange = (field: keyof TimeInputs, value: string) => {
    setTimeInputs((prev) => ({ ...prev, [field]: value }));
    setError('');
    setResults(null);
  };

  const handleFrameInputChange = (field: keyof FrameInputs, value: string) => {
    setFrameInputs((prev) => ({ ...prev, [field]: value }));
    setError('');
    setResults(null);
  };

  const validateAndCalculate = () => {
    setError('');
    setResults(null);

    let loadStart: number;
    let fireStart: number;
    let contact: number;

    if (inputMode === 'time') {
      // Validate all fields are filled
      if (!timeInputs.loadStart || !timeInputs.fireStart || !timeInputs.contact) {
        setError('Please fill in all fields.');
        return;
      }

      loadStart = parseFloat(timeInputs.loadStart);
      fireStart = parseFloat(timeInputs.fireStart);
      contact = parseFloat(timeInputs.contact);

      // Validate numbers
      if (isNaN(loadStart) || isNaN(fireStart) || isNaN(contact)) {
        setError('Please enter valid numbers.');
        return;
      }
    } else {
      // Validate all fields are filled
      if (!frameInputs.fps || !frameInputs.loadStartFrame || !frameInputs.fireStartFrame || !frameInputs.contactFrame) {
        setError('Please fill in all fields.');
        return;
      }

      const fps = parseFloat(frameInputs.fps);
      const loadStartFrame = parseFloat(frameInputs.loadStartFrame);
      const fireStartFrame = parseFloat(frameInputs.fireStartFrame);
      const contactFrame = parseFloat(frameInputs.contactFrame);

      // Validate numbers
      if (isNaN(fps) || isNaN(loadStartFrame) || isNaN(fireStartFrame) || isNaN(contactFrame)) {
        setError('Please enter valid numbers.');
        return;
      }

      if (fps <= 0) {
        setError('FPS must be greater than 0.');
        return;
      }

      // Convert frames to seconds
      loadStart = loadStartFrame / fps;
      fireStart = fireStartFrame / fps;
      contact = contactFrame / fps;
    }

    // Validate order: LoadStart < FireStart < Contact
    if (loadStart >= fireStart) {
      setError('Load Start must be less than Fire Start.');
      return;
    }

    if (fireStart >= contact) {
      setError('Fire Start must be less than Contact.');
      return;
    }

    // Calculate tempo
    const loadPhase = fireStart - loadStart;
    const firePhase = contact - fireStart;
    const tempoRatio = loadPhase / firePhase;
    const roundedRatio = Math.round(tempoRatio * 100) / 100;

    // Determine status and coaching cue
    let status: 'green' | 'yellow' | 'red';
    let message: string;
    let coachingCue: string;

    if (roundedRatio < 1.8) {
      status = 'red';
      message = 'Rushed. You\'re firing before you\'re anchored.';
      coachingCue = 'Slow down your gather. Let the load breathe before you fire.';
    } else if (roundedRatio >= 1.8 && roundedRatio <= 2.6) {
      status = 'green';
      message = 'Efficient, game-ready tempo.';
      coachingCue = 'Stay here. This is a strong attack window. Keep your move simple.';
    } else if (roundedRatio >= 2.7 && roundedRatio <= 3.2) {
      status = 'yellow';
      message = 'Slightly slow. Good for some patterns, but monitor drift.';
      coachingCue = 'Tighten up your move. Start your load earlier so you don\'t float.';
    } else {
      status = 'red';
      message = 'Drifty. You\'re giving the pitcher too big a window.';
      coachingCue = 'Control your forward move. Anchor before launch instead of drifting.';
    }

    setResults({
      tempoRatio: roundedRatio,
      status,
      message,
      coachingCue,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            HITS Tempo Analyzer (MVP)
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            A simple free tool from The Hitting Skool to measure your swing tempo.
          </p>
        </div>

        {/* Input Mode Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Input Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inputMode"
                value="time"
                checked={inputMode === 'time'}
                onChange={(e) => {
                  setInputMode(e.target.value as InputMode);
                  setError('');
                  setResults(null);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-gray-300">Use Time (seconds)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inputMode"
                value="frames"
                checked={inputMode === 'frames'}
                onChange={(e) => {
                  setInputMode(e.target.value as InputMode);
                  setError('');
                  setResults(null);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-gray-300">Use Frames (with FPS)</span>
            </label>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          {inputMode === 'time' ? (
            <>
              <div>
                <label className="block text-gray-300 mb-2">Load Start (seconds)</label>
                <input
                  type="number"
                  step="0.01"
                  value={timeInputs.loadStart}
                  onChange={(e) => handleTimeInputChange('loadStart', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Fire Start (seconds)</label>
                <input
                  type="number"
                  step="0.01"
                  value={timeInputs.fireStart}
                  onChange={(e) => handleTimeInputChange('fireStart', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Contact (seconds)</label>
                <input
                  type="number"
                  step="0.01"
                  value={timeInputs.contact}
                  onChange={(e) => handleTimeInputChange('contact', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-300 mb-2">Frames Per Second (FPS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={frameInputs.fps}
                  onChange={(e) => handleFrameInputChange('fps', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30.00"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Load Start Frame</label>
                <input
                  type="number"
                  value={frameInputs.loadStartFrame}
                  onChange={(e) => handleFrameInputChange('loadStartFrame', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Fire Start Frame</label>
                <input
                  type="number"
                  value={frameInputs.fireStartFrame}
                  onChange={(e) => handleFrameInputChange('fireStartFrame', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Contact Frame</label>
                <input
                  type="number"
                  value={frameInputs.contactFrame}
                  onChange={(e) => handleFrameInputChange('contactFrame', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={validateAndCalculate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Calculate Tempo
        </button>

        {/* Results Card */}
        {results && (
          <div className="mt-6 p-6 bg-gray-700/50 border border-gray-600 rounded-lg">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2">
                Tempo Ratio: {results.tempoRatio.toFixed(2)} : 1
              </h2>
            </div>
            <div className="mb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                results.status === 'green' ? 'bg-green-900/50 text-green-200 border border-green-700' :
                results.status === 'yellow' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700' :
                'bg-red-900/50 text-red-200 border border-red-700'
              }`}>
                {results.status === 'green' ? 'Green' : results.status === 'yellow' ? 'Yellow' : 'Red'} – {results.message}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-600">
              <p className="text-gray-300 italic">
                {results.coachingCue}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
