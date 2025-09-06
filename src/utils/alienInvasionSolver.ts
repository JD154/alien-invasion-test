import type { CommandCenter, Ship, AlienSolution } from '../types/alien'
import { MOVEMENT_DIRECTIONS } from './directions'

export const solveAlienInvasion = (input: string): AlienSolution => {
  const startTime = performance.now()

  const lines = input.trim().split('\n')
  const n = parseInt(lines[0])
  const ships: CommandCenter[][] = []

  let lineIndex = 1

  for (let i = 0; i < n; i++) {
    const [x, y, z] = lines[lineIndex].split(' ').map(Number)
    const ship: Ship = {
      height: x,
      width: y,
      scale: z,
      matrix: [],
    }

    lineIndex++

    // Read the ship's matrix
    for (let row = 0; row < x; row++) {
      const rowData = lines[lineIndex + row].split(' ')
      ship.matrix.push(rowData)
    }

    lineIndex += x

    // Process the ship
    const commandCenters = findCommandCenters(ship)
    ships.push(commandCenters)
  }

  const endTime = performance.now()

  return {
    ships,
    processingTime: endTime - startTime,
    totalShips: n,
  }
}

const findCommandCenters = (ship: Ship): CommandCenter[] => {
  const visited = Array(ship.height)
    .fill(null)
    .map(() => Array(ship.width).fill(false))

  // First, collect all regions
  const allRegions: { letter: string; region: Array<[number, number]> }[] = []

  for (let i = 0; i < ship.height; i++) {
    for (let j = 0; j < ship.width; j++) {
      const cell = ship.matrix[i][j]

      // Check if it is a valid letter and not visited
      if (isValidLetter(cell) && !visited[i][j]) {
        const region = floodFill(ship, i, j, cell, visited)
        allRegions.push({ letter: cell, region })
      }
    }
  }

  // Now group all regions by letter
  const letterRegions = new Map<string, Array<[number, number]>>()

  for (const { letter, region } of allRegions) {
    if (!letterRegions.has(letter)) {
      letterRegions.set(letter, [])
    }
    letterRegions.get(letter)!.push(...region)
  }

  // Create a command center for each letter using all its regions
  const commandCenters: CommandCenter[] = []

  for (const [letter, allPositions] of letterRegions) {
    const commandCenter = calculateCenter(allPositions, letter, ship.scale)
    commandCenters.push(commandCenter)
  }

  // Sort by ascending area, then alphabetically
  commandCenters.sort((a, b) => {
    if (a.area !== b.area) {
      return a.area - b.area
    }
    return a.letter.localeCompare(b.letter)
  })

  return commandCenters
}

const isValidLetter = (char: string): boolean => {
  return /^[a-zA-Z]$/.test(char)
}

const floodFill = (
  ship: Ship,
  startX: number,
  startY: number,
  letter: string,
  visited: boolean[][]
): Array<[number, number]> => {
  const region: Array<[number, number]> = []
  const stack: Array<[number, number]> = [[startX, startY]]

  while (stack.length > 0) {
    const [x, y] = stack.pop()!

    if (
      x < 0 ||
      x >= ship.height ||
      y < 0 ||
      y >= ship.width ||
      visited[x][y] ||
      ship.matrix[x][y] !== letter
    ) {
      continue
    }

    visited[x][y] = true
    region.push([x, y])

    // Explore the 4 directions
    for (const [dx, dy] of MOVEMENT_DIRECTIONS) {
      stack.push([x + dx, y + dy])
    }
  }

  return region
}

const calculateCenter = (
  region: Array<[number, number]>,
  letter: string,
  scale: number
): CommandCenter => {
  const rows = region.map(([x]) => x)
  const cols = region.map(([, y]) => y)

  const minX = Math.min(...rows)
  const maxX = Math.max(...rows)
  const minY = Math.min(...cols)
  const maxY = Math.max(...cols)

  // Center of the bounding box
  const centerX = (minX + maxX) / 2 + 0.5
  const centerY = (minY + maxY) / 2 + 0.5

  // Apply scale and round to 3 decimals
  const scaledX = Math.round(centerX * scale * 1000) / 1000
  const scaledY = Math.round(centerY * scale * 1000) / 1000

  return {
    letter,
    centerX: scaledX,
    centerY: scaledY,
    area: region.length,
  }
}

export const formatAlienOutput = (
  commandCenters: CommandCenter[][]
): string[] => {
  return commandCenters.map(centers => {
    // Sort by ascending area, then by letter
    const sorted = [...centers].sort((a, b) => {
      if (a.area !== b.area) return a.area - b.area
      return a.letter.localeCompare(b.letter)
    })

    // Group multiple instances of the same letter
    const letterMap = new Map<string, CommandCenter[]>()

    for (const center of sorted) {
      if (!letterMap.has(center.letter)) {
        letterMap.set(center.letter, [])
      }
      letterMap.get(center.letter)!.push(center)
    }

    // Create output maintaining the order of first appearance
    const result: string[] = []
    const processedLetters = new Set<string>()

    for (const center of sorted) {
      if (!processedLetters.has(center.letter)) {
        const allForLetter = letterMap.get(center.letter)!

        if (allForLetter.length === 1) {
          result.push(
            `${center.letter}:${center.centerX.toFixed(
              3
            )},${center.centerY.toFixed(3)}`
          )
        } else {
          // Multiple instances - group with ';'
          const coords = allForLetter
            .map(c => `${c.centerX.toFixed(3)},${c.centerY.toFixed(3)}`)
            .join(';')
          result.push(`${center.letter}:${coords}`)
        }

        processedLetters.add(center.letter)
      }
    }

    const finalOutput = result.join(' ')

    return finalOutput
  })
}
