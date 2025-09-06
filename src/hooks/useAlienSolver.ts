import { useState, useCallback } from 'react'
import type { AlienSolution } from '../types/alien'
import {
  solveAlienInvasion,
  formatAlienOutput,
} from '../utils/alienInvasionSolver'

interface UseAlienSolverReturn {
  solution: AlienSolution | null
  isProcessing: boolean
  error: string | null
  solve: (inputContent: string) => Promise<void>
  clearSolution: () => void
  formatOutput: () => string[]
}

export const useAlienSolver = (): UseAlienSolverReturn => {
  const [solution, setSolution] = useState<AlienSolution | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const solve = useCallback(async (inputContent: string) => {
    if (!inputContent.trim()) {
      setError('Input content is empty')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await new Promise<AlienSolution>(resolve => {
        // Just to simulate processing delay for UX purposes
        setTimeout(() => {
          const solutionResult = solveAlienInvasion(inputContent)
          resolve(solutionResult)
        }, 1000)
      })

      setSolution(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to solve alien invasion'
      )
      setSolution(null)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const clearSolution = useCallback(() => {
    setSolution(null)
    setError(null)
  }, [])

  const formatOutput = useCallback((): string[] => {
    if (!solution) return []
    return formatAlienOutput(solution.ships)
  }, [solution])

  return {
    solution,
    isProcessing,
    error,
    solve,
    clearSolution,
    formatOutput,
  }
}
