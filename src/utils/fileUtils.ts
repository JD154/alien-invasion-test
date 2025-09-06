export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('File reading error'))
    }

    reader.readAsText(file)
  })
}

export const validateInputFile = (
  content: string
): {
  isValid: boolean
  error?: string
} => {
  const lines = content.trim().split('\n')

  if (lines.length === 0) {
    return { isValid: false, error: 'File is empty' }
  }

  const firstLine = lines[0].trim()
  const shipCount = parseInt(firstLine)

  if (isNaN(shipCount) || shipCount < 1 || shipCount > 30) {
    return { isValid: false, error: 'Invalid ship count (must be 1-30)' }
  }

  // Basic format validation
  let lineIndex = 1

  for (let i = 0; i < shipCount; i++) {
    if (lineIndex >= lines.length) {
      return { isValid: false, error: `Missing ship ${i + 1} dimensions` }
    }

    const dimensionLine = lines[lineIndex].trim().split(' ')

    if (dimensionLine.length !== 3) {
      return {
        isValid: false,
        error: `Invalid ship ${i + 1} dimensions format`,
      }
    }

    const [x, y, z] = dimensionLine.map(Number)

    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(z) ||
      x < 4 ||
      x > 100 ||
      y < 4 ||
      y > 100
    ) {
      return { isValid: false, error: `Invalid ship ${i + 1} dimensions` }
    }

    lineIndex++

    // Check that there are enough lines for the matrix
    if (lineIndex + x > lines.length) {
      return { isValid: false, error: `Missing matrix rows for ship ${i + 1}` }
    }

    // Validate each row of the matrix
    for (let row = 0; row < x; row++) {
      const matrixRow = lines[lineIndex + row].trim().split(' ')

      if (matrixRow.length !== y) {
        return {
          isValid: false,
          error: `Invalid matrix row ${row + 1} for ship ${i + 1}`,
        }
      }
    }

    lineIndex += x
  }

  return { isValid: true }
}

export const validateOutputFile = (
  content: string
): {
  isValid: boolean
  error?: string
} => {
  const lines = content.trim().split('\n')

  if (lines.length === 0) {
    return { isValid: false, error: 'Output file is empty' }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line === '') continue

    // First split by spaces, then by semicolon to handle both formats
    const mainEntries = line.split(' ')

    for (const mainEntry of mainEntries) {
      // Split by semicolon in case there are multiple grouped centers
      const subEntries = mainEntry.split(';')

      for (const entry of subEntries) {
        if (!entry.trim()) continue // Skip empty entries

        if (!entry.includes(':')) {
          return {
            isValid: false,
            error: `Invalid format in line ${i + 1}: missing ':' in "${entry}"`,
          }
        }

        const [letter, coords] = entry.split(':')

        if (!/^[a-zA-Z]$/.test(letter)) {
          return {
            isValid: false,
            error: `Invalid letter "${letter}" in line ${i + 1}`,
          }
        }

        const coordsParts = coords.split(',')
        if (coordsParts.length !== 2) {
          return {
            isValid: false,
            error: `Invalid coordinates format "${coords}" in line ${i + 1}`,
          }
        }

        const [x, y] = coordsParts.map(Number)

        if (isNaN(x) || isNaN(y)) {
          return {
            isValid: false,
            error: `Invalid coordinates "${coords}" in line ${i + 1}`,
          }
        }
      }
    }
  }

  return { isValid: true }
}

export const downloadAsFile = (
  content: string,
  filename: string,
  contentType: string = 'text/plain'
) => {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text)
}
