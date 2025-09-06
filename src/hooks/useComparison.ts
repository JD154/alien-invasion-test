import { useState, useCallback } from 'react'
import type {
  CommandCenter,
  ComparisonResult,
  OverallAccuracy,
} from '../types/alien'
import { compareResults, parseExpectedOutput } from '../utils/comparisonUtils'

interface UseComparisonReturn {
  shipComparisons: ComparisonResult[]
  overall: OverallAccuracy | null
  isComparing: boolean
  error: string | null
  compareResults: (actual: CommandCenter[][], expectedContent: string) => void
  clearComparison: () => void
}

export const useComparison = (): UseComparisonReturn => {
  const [shipComparisons, setShipComparisons] = useState<ComparisonResult[]>([])
  const [overall, setOverall] = useState<OverallAccuracy | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compareResultsFn = useCallback(
    (actual: CommandCenter[][], expectedContent: string) => {
      setIsComparing(true)
      setError(null)

      try {
        const expectedResults = parseExpectedOutput(expectedContent)
        const comparison = compareResults(actual, expectedResults)
        setShipComparisons(comparison.shipComparisons)
        setOverall(comparison.overall)
      } catch (err) {
        console.error('Comparison error:', err)
        setError(
          err instanceof Error ? err.message : 'Unknown comparison error'
        )
      } finally {
        setIsComparing(false)
      }
    },
    []
  )

  const clearComparison = useCallback(() => {
    setShipComparisons([])
    setOverall(null)
    setError(null)
  }, [])

  return {
    shipComparisons,
    overall,
    isComparing,
    error,
    compareResults: compareResultsFn,
    clearComparison,
  }
}
