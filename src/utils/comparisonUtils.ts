import type {
  CommandCenter,
  ComparisonResult,
  OverallAccuracy,
  CommandCenterMatch,
  CommandCenterMismatch,
} from '../types/alien'

const BASE_COORDINATE_TOLERANCE = 0.001

export const compareResults = (
  actualResults: CommandCenter[][],
  expectedResults: CommandCenter[][]
): { shipComparisons: ComparisonResult[]; overall: OverallAccuracy } => {
  if (actualResults.length !== expectedResults.length) {
    throw new Error(
      `Ship count mismatch: expected ${expectedResults.length}, got ${actualResults.length}`
    )
  }

  const shipComparisons: ComparisonResult[] = []
  let totalMatches = 0
  let totalCloseMatches = 0
  let totalMismatches = 0
  let totalMissing = 0
  let totalExtra = 0
  let totalCenters = 0
  let totalCoordinateError = 0
  let errorCount = 0

  for (let i = 0; i < actualResults.length; i++) {
    const shipComparison = compareShip(actualResults[i], expectedResults[i], i)
    shipComparisons.push(shipComparison)

    totalMatches += shipComparison.matches.filter(m => m.isExactMatch).length
    totalCloseMatches += shipComparison.matches.filter(
      m => !m.isExactMatch
    ).length
    totalMismatches += shipComparison.mismatches.length
    totalMissing += shipComparison.missing.length
    totalExtra += shipComparison.extra.length
    totalCenters += expectedResults[i].length

    // Calculate average coordinate error
    shipComparison.matches.forEach(match => {
      totalCoordinateError += match.coordinateError
      errorCount++
    })
    shipComparison.mismatches.forEach(mismatch => {
      totalCoordinateError += mismatch.coordinateError
      errorCount++
    })
  }

  const overall: OverallAccuracy = {
    totalCenters,
    exactMatches: totalMatches,
    closeMatches: totalCloseMatches,
    mismatches: totalMismatches,
    missing: totalMissing,
    extra: totalExtra,
    accuracyPercentage:
      ((totalMatches + totalCloseMatches) / totalCenters) * 100,
    averageCoordinateError:
      errorCount > 0 ? totalCoordinateError / errorCount : 0,
  }

  return { shipComparisons, overall }
}

const compareShip = (
  actual: CommandCenter[],
  expected: CommandCenter[],
  shipIndex: number
): ComparisonResult => {
  const matches: CommandCenterMatch[] = []
  const mismatches: CommandCenterMismatch[] = []
  const missing: CommandCenter[] = []
  const extra: CommandCenter[] = [...actual]

  for (const expectedCenter of expected) {
    const actualCenter = findBestMatch(expectedCenter, actual)

    if (actualCenter) {
      // Remove from extra
      const index = extra.findIndex(c => c === actualCenter)
      if (index > -1) extra.splice(index, 1)

      const coordinateError = calculateCoordinateError(
        expectedCenter,
        actualCenter
      )
      const isExactMatch = coordinateError < BASE_COORDINATE_TOLERANCE

      if (
        expectedCenter.letter === actualCenter.letter &&
        coordinateError < 1.0
      ) {
        // It's a match (exact or close)
        matches.push({
          expected: expectedCenter,
          actual: actualCenter,
          coordinateError,
          isExactMatch,
        })
      } else {
        // It's a mismatch
        mismatches.push({
          expected: expectedCenter,
          actual: actualCenter,
          coordinateError,
          reason:
            expectedCenter.letter !== actualCenter.letter
              ? 'letter_diff'
              : 'coordinate_diff',
        })
      }
    } else {
      // Not found, it's missing
      missing.push(expectedCenter)
    }
  }

  const accuracy = (matches.length / expected.length) * 100

  return {
    shipIndex,
    matches,
    mismatches,
    missing,
    extra,
    accuracy,
  }
}

const findBestMatch = (
  target: CommandCenter,
  candidates: CommandCenter[]
): CommandCenter | null => {
  let bestMatch: CommandCenter | null = null
  let bestScore = Infinity

  for (const candidate of candidates) {
    const coordinateError = calculateCoordinateError(target, candidate)
    const letterMatch = target.letter === candidate.letter ? 0 : 1000
    const score = coordinateError + letterMatch

    if (score < bestScore) {
      bestScore = score
      bestMatch = candidate
    }
  }

  return bestMatch
}

const calculateCoordinateError = (
  a: CommandCenter,
  b: CommandCenter
): number => {
  const dx = a.centerX - b.centerX
  const dy = a.centerY - b.centerY
  return Math.sqrt(dx * dx + dy * dy)
}

export const parseExpectedOutput = (content: string): CommandCenter[][] => {
  const lines = content.trim().split('\n')
  const results: CommandCenter[][] = []

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const centers: CommandCenter[] = []

    // First split by spaces, then by semicolon
    const mainEntries = line.split(' ')

    for (const mainEntry of mainEntries) {
      // Split by semicolon in case there are multiple grouped centers
      const subEntries = mainEntry.split(';')

      for (const entry of subEntries) {
        if (!entry.trim() || !entry.includes(':')) {
          continue
        }

        const [letter, coords] = entry.split(':')
        const coordsParts = coords.split(',')

        if (coordsParts.length === 2) {
          const [x, y] = coordsParts.map(Number)

          if (!isNaN(x) && !isNaN(y)) {
            const center = {
              letter,
              centerX: x,
              centerY: y,
              area: 0, // TODO: We don't have area in .out?
            }
            centers.push(center)
          } else {
          }
        } else {
        }
      }
    }

    results.push(centers)
  }

  return results
}
