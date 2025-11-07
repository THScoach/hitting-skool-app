'use client'

import { useState } from 'react'
import { calculateTempo, formatTime, formatRatio, type TempoResult } from '@/src/lib/tempo'

export default function Home() {
  const [load, setLoad] = useState('')
  const [fire, setFire] = useState('')
  const [contact, setContact] = useState('')
  const [result, setResult] = useState<TempoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)
    setResult(null)

    try {
      const loadTime = parseFloat(load)
      const fireTime = parseFloat(fire)
      const contactTime = parseFloat(contact)

      if (isNaN(loadTime) || isNaN(fireTime) || isNaN(contactTime)) {
        throw new Error('Please enter valid numbers for all timestamps')
      }

      const tempoResult = calculateTempo({
        load: loadTime,
        fire: fireTime,
        contact: contactTime,
      })

      setResult(tempoResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const getStatusColor = (status: TempoResult['status']) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-600/20 border-green-500 text-green-300'
      case 'too-fast':
        return 'bg-yellow-600/20 border-yellow-500 text-yellow-300'
      case 'too-slow':
        return 'bg-orange-600/20 border-orange-500 text-orange-300'
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Hits Tempo Analyzer</h1>
        <p className="text-gray-400 text-center mb-8">Analyze your hitting tempo</p>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Load Timestamp (seconds)
              </label>
              <input
                type="number"
                step="0.001"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Fire Timestamp (seconds)
              </label>
              <input
                type="number"
                step="0.001"
                value={fire}
                onChange={(e) => setFire(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Contact Timestamp (seconds)
              </label>
              <input
                type="number"
                step="0.001"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.000"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
              Calculate Tempo
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-md text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className={`mt-6 p-6 rounded-lg border-2 ${getStatusColor(result.status)}`}>
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Load Phase:</span>
                <span className="font-semibold">{formatTime(result.loadPhase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fire Phase:</span>
                <span className="font-semibold">{formatTime(result.firePhase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Tempo Ratio:</span>
                <span className="font-semibold">{formatRatio(result.tempoRatio)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-current/20">
              <p className="font-medium text-lg">{result.coachingCue}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
