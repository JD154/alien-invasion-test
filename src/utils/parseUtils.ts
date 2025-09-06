import type { Ship } from '../types/alien'

export const parseShipsFromInput = (input: string): Ship[] => {
  const lines = input.trim().split('\n')
  const n = parseInt(lines[0])
  const ships: Ship[] = []

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

    for (let row = 0; row < x; row++) {
      const rowData = lines[lineIndex + row].split(' ')
      ship.matrix.push(rowData)
    }

    lineIndex += x
    ships.push(ship)
  }

  return ships
}
