import { useCallback, useEffect } from 'react'
import './App.css'
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react'

import { DualFileUpload } from './components/DualFileUpload'
import { ResultsDisplay } from './components/ResultsDisplay'
import { ComparisonView } from './components/ComparisonView'

import { useFileUpload } from './hooks/useFileUpload'
import { useAlienSolver } from './hooks/useAlienSolver'
import { useComparison } from './hooks/useComparison'

import { downloadAsFile, copyToClipboard } from './utils/fileUtils'

function App() {
  const fileUpload = useFileUpload()
  const solver = useAlienSolver()
  const comparison = useComparison()

  useEffect(() => {
    if (fileUpload.inputContent && !fileUpload.error && !solver.isProcessing) {
      solver.solve(fileUpload.inputContent)
    }
  }, [fileUpload.inputContent, fileUpload.error])

  useEffect(() => {
    if (
      solver.solution &&
      fileUpload.expectedOutput &&
      !comparison.isComparing
    ) {
      comparison.compareResults(
        solver.solution.ships,
        fileUpload.expectedOutput
      )
    }
  }, [solver.solution, fileUpload.expectedOutput])

  const handleCopyResults = useCallback(async () => {
    const output = solver.formatOutput()
    try {
      await copyToClipboard(output.join('\n'))
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [solver])

  const handleDownloadResults = useCallback(() => {
    const output = solver.formatOutput()
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadAsFile(output.join('\n'), `alien-solution-${timestamp}.out`)
  }, [solver])

  const hasResults = !!solver.solution
  const hasComparison = !!comparison.overall
  const isProcessing =
    fileUpload.isLoading || solver.isProcessing || comparison.isComparing

  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="navbar-start">
          <h1 className="text-xl font-bold">
            🛸 Alien Invasion Solver & Validator
          </h1>
        </div>
        <div className="navbar-end">
          {isProcessing && (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6 max-w-7xl">
        <DualFileUpload
          onInputFileChange={fileUpload.uploadInputFile}
          onOutputFileChange={fileUpload.uploadOutputFile}
          onInputTextChange={fileUpload.setInputContent}
          inputContent={fileUpload.inputContent}
          isLoading={fileUpload.isLoading}
          error={fileUpload.error}
          onClearError={fileUpload.clearError}
        />

        {(solver.isProcessing || comparison.isComparing) && (
          <div className="alert alert-info">
            <Zap className="w-5 h-5" />
            <span>
              {solver.isProcessing && 'Processing alien invasion data...'}
              {comparison.isComparing && 'Comparing results...'}
            </span>
          </div>
        )}

        {solver.error && (
          <div className="alert alert-error">
            <AlertTriangle className="w-5 h-5" />
            <span>{solver.error}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={solver.clearSolution}
            >
              ✕
            </button>
          </div>
        )}

        {comparison.error && (
          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5" />
            <span>Comparison error: {comparison.error}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={comparison.clearComparison}
            >
              ✕
            </button>
          </div>
        )}

        {hasResults && !solver.error && (
          <div className="alert alert-success">
            <CheckCircle className="w-5 h-5" />
            <span>
              Solution generated successfully! Found{' '}
              {solver.solution!.ships.reduce(
                (total, ship) => total + ship.length,
                0
              )}{' '}
              command centers across {solver.solution!.totalShips} ships.
            </span>
          </div>
        )}

        {hasResults && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ResultsDisplay
                solution={solver.solution}
                formattedOutput={solver.formatOutput()}
                onCopy={handleCopyResults}
                onDownload={handleDownloadResults}
              />

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-secondary">
                    🎯 Expected Output
                  </h3>
                  {fileUpload.expectedOutput ? (
                    <div className="space-y-2">
                      <div className="bg-base-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {fileUpload.expectedOutput}
                        </pre>
                      </div>
                      {hasComparison && (
                        <div className="text-sm text-base-content/70">
                          Comparison completed with{' '}
                          {comparison.overall!.accuracyPercentage.toFixed(1)}%
                          accuracy
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-base-content/50">
                      <span>
                        Upload expected output file to enable comparison
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {hasComparison && (
          <ComparisonView
            overall={comparison.overall}
            expectedOutput={fileUpload.expectedOutput}
          />
        )}
      </div>
    </div>
  )
}

export default App
