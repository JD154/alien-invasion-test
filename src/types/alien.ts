export interface CommandCenter {
  letter: string
  centerX: number
  centerY: number
  area: number
}

export interface Ship {
  height: number
  width: number
  scale: number
  matrix: string[][]
}

export interface AlienSolution {
  ships: CommandCenter[][]
  processingTime: number
  totalShips: number
}

export interface ComparisonResult {
  shipIndex: number
  matches: CommandCenterMatch[]
  mismatches: CommandCenterMismatch[]
  missing: CommandCenter[]
  extra: CommandCenter[]
  accuracy: number
}

export interface CommandCenterMatch {
  expected: CommandCenter
  actual: CommandCenter
  coordinateError: number
  isExactMatch: boolean
}

export interface CommandCenterMismatch {
  expected: CommandCenter
  actual: CommandCenter
  coordinateError: number
  reason: 'coordinate_diff' | 'letter_diff' | 'area_diff'
}

export interface OverallAccuracy {
  totalCenters: number
  exactMatches: number
  closeMatches: number
  mismatches: number
  missing: number
  extra: number
  accuracyPercentage: number
  averageCoordinateError: number
}

export interface FileUploadState {
  inputFile: File | null
  outputFile: File | null
  inputContent: string
  expectedOutput: string
  isLoading: boolean
  error: string | null
}
