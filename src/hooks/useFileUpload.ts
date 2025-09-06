import { useState, useCallback } from 'react'
import type { FileUploadState } from '../types/alien'
import {
  readFileAsText,
  validateInputFile,
  validateOutputFile,
} from '../utils/fileUtils'

interface UseFileUploadReturn extends FileUploadState {
  uploadInputFile: (file: File) => Promise<void>
  uploadOutputFile: (file: File) => Promise<void>
  setInputContent: (content: string) => void
  clearFiles: () => void
  clearError: () => void
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [state, setState] = useState<FileUploadState>({
    inputFile: null,
    outputFile: null,
    inputContent: '',
    expectedOutput: '',
    isLoading: false,
    error: null,
  })

  const uploadInputFile = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const content = await readFileAsText(file)
      const validation = validateInputFile(content)

      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid input file')
      }

      setState(prev => ({
        ...prev,
        inputFile: file,
        inputContent: content,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload input file',
        isLoading: false,
      }))
    }
  }, [])

  const uploadOutputFile = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const content = await readFileAsText(file)
      const validation = validateOutputFile(content)

      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid output file')
      }

      setState(prev => ({
        ...prev,
        outputFile: file,
        expectedOutput: content,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload output file',
        isLoading: false,
      }))
    }
  }, [])

  const setInputContent = useCallback((content: string) => {
    const validation = validateInputFile(content)

    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid input content',
        inputContent: content,
      }))
    } else {
      setState(prev => ({
        ...prev,
        inputContent: content,
        error: null,
      }))
    }
  }, [])

  const clearFiles = useCallback(() => {
    setState({
      inputFile: null,
      outputFile: null,
      inputContent: '',
      expectedOutput: '',
      isLoading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    uploadInputFile,
    uploadOutputFile,
    setInputContent,
    clearFiles,
    clearError,
  }
}
