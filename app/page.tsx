'use client'

import { useState } from 'react'

type TempoInterpretation = {
  color: 'green' | 'yellow' | 'red'
  label: string
  explanation: string
  cue: string
}

function getTempoInterpretation(ratio: number): TempoInterpretation {
  if (ratio >= 1.8 && ratio <= 2.6) {
    return {
      color: 'green',
      label: 'Green',
      explanation: 'Efficient game-ready tempo.',
      cue: 'Maintain this rhythm. Your load and fire phases are well-balanced.',
    }
  } else if (ratio >= 2.7 && ratio <= 3.2) {
    return {
      color: 'yellow',
      label: 'Yellow',
      explanation: 'Late / slow commit window. Might be okay for some hitters.',
      cue: 'Consider quickening your fire phase slightly. You may be stretching the commit window.',
    }
  } else if (ratio < 1.8) {
    return {
      color: 'red',
      label: 'Red',
      explanation: 'Rushed. You\'re firing before you\'re loaded.',
      cue: 'Focus on completing your load phase before initiating the fire phase. Slow down the transition.',
    }
  } else {
    return {
      color: 'red',
      label: 'Red',
      explanation: 'Drifty / slow. You\'re stretching the commit window too long.',
      cue: 'Accelerate your fire phase. The load-to-fire transition should be more explosive.',
    }
  }
}

export default function Home() {
  const [loadStart, setLoadStart] = useState<string>('')
  const [fireStart, setFireStart] = useState<string>('')
  const [contact, setContact] = useState<string>('')
  const [results, setResults] = useState<{
    loadPhase: number
    firePhase: number
    tempoRatio: number
    interpretation: TempoInterpretation
  } | null>(null)

  const calculateTempo = () => {
    const loadStartNum = parseFloat(loadStart)
    const fireStartNum = parseFloat(fireStart)
    const contactNum = parseFloat(contact)

    if (
      isNaN(loadStartNum) ||
      isNaN(fireStartNum) ||
      isNaN(contactNum) ||
      fireStartNum <= loadStartNum ||
      contactNum <= fireStartNum
    ) {
      alert('Please enter valid timestamps where Fire Start > Load Start and Contact > Fire Start')
      return
    }

    const loadPhase = fireStartNum - loadStartNum
    const firePhase = contactNum - fireStartNum

    if (firePhase === 0) {
      alert('Fire Phase cannot be zero. Please check your inputs.')
      return
    }

    const tempoRatio = Math.round((loadPhase / firePhase) * 100) / 100
    const interpretation = getTempoInterpretation(tempoRatio)

    setResults({
      loadPhase,
      firePhase,
      tempoRatio,
      interpretation,
    })
  }

  const resetForm = () => {
    setLoadStart('')
    setFireStart('')
    setContact('')
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            HITS Tempo Calculator
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Analyze your baseball swing tempo
          </p>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="loadStart" className="block text-sm font-medium text-gray-300 mb-2">
                  Load Start (seconds or frames)
                </label>
                <input
                  id="loadStart"
                  type="number"
                  step="0.01"
                  value={loadStart}
                  onChange={(e) => setLoadStart(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="fireStart" className="block text-sm font-medium text-gray-300 mb-2">
                  Fire Start / Launch (seconds or frames)
                </label>
                <input
                  id="fireStart"
                  type="number"
                  step="0.01"
                  value={fireStart}
                  onChange={(e) => setFireStart(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-2">
                  Contact (seconds or frames)
                </label>
                <input
                  id="contact"
                  type="number"
                  step="0.01"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={calculateTempo}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Calculate Tempo
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Reset
              </button>
            </div>

            {results && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="bg-gray-900 rounded-lg p-6 space-y-4">
                  <div className="text-center">
                    <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-4 ${
                      results.interpretation.color === 'green'
                        ? 'bg-green-900 text-green-300'
                        : results.interpretation.color === 'yellow'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {results.interpretation.label}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Tempo Ratio: {results.tempoRatio.toFixed(2)}
                    </h2>
                    <p className="text-gray-300 mb-6">
                      {results.interpretation.explanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Load Phase</div>
                      <div className="text-xl font-semibold text-white">
                        {results.loadPhase.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Fire Phase</div>
                      <div className="text-xl font-semibold text-white">
                        {results.firePhase.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="text-sm font-semibold text-gray-300 mb-2">
                      Key Coaching Cue
                    </div>
                    <div className="text-white">
                      {results.interpretation.cue}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
