import React, { useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

interface DualFileUploadProps {
  onInputFileChange: (file: File) => void
  onOutputFileChange: (file: File) => void
  onInputTextChange: (content: string) => void
  inputContent: string
  isLoading: boolean
  error: string | null
  onClearError: () => void
}

export const DualFileUpload: React.FC<DualFileUploadProps> = ({
  onInputFileChange,
  onOutputFileChange,
  onInputTextChange,
  inputContent,
  isLoading,
  error,
  onClearError,
}) => {
  const handleInputFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onInputFileChange(file)
      }
    },
    [onInputFileChange]
  )

  const handleOutputFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        onOutputFileChange(file)
      }
    },
    [onOutputFileChange]
  )

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onInputTextChange(event.target.value)
    },
    [onInputTextChange]
  )

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-primary">
          <Upload className="w-5 h-5" />
          Upload Files
        </h2>

        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={onClearError}>
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Input File (.in)</span>
              <span className="badge badge-primary">Required</span>
            </label>
            <input
              type="file"
              accept=".in,.txt"
              onChange={handleInputFileChange}
              className="file-input file-input-bordered file-input-primary w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">
                Expected Output (.out)
              </span>
              <span className="badge badge-secondary">Optional</span>
            </label>
            <input
              type="file"
              accept=".out,.txt"
              onChange={handleOutputFileChange}
              className="file-input file-input-bordered file-input-secondary w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="label">
            <span className="label-text font-semibold">
              <FileText className="w-4 h-4 inline mr-1" />
              Or paste input content directly
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-primary w-full h-32 font-mono text-sm"
            placeholder="Paste your alien invasion data here..."
            value={inputContent}
            onChange={handleTextChange}
            disabled={isLoading}
          />
        </div>

        <div className="card-actions justify-between mt-4">
          {isLoading && (
            <span className="loading loading-spinner loading-md text-primary"></span>
          )}
        </div>
      </div>
    </div>
  )
}
