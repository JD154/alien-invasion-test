import React from 'react'
import type { AlienSolution } from '../types/alien'
import { Clock, Target, Ship } from 'lucide-react'

interface ResultsDisplayProps {
  solution: AlienSolution | null
  formattedOutput: string[]
  onCopy: () => void
  onDownload: () => void
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  solution,
  formattedOutput,
  onCopy,
  onDownload,
}) => {
  if (!solution) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-accent">
            <Target className="w-5 h-5" />
            Our Solution
          </h3>
          <div className="flex items-center justify-center h-32 text-base-content/50">
            <span>No solution generated yet</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-accent">
          <Target className="w-5 h-5" />
          Our Solution
        </h3>

        <div className="stats stats-vertical lg:stats-horizontal shadow-sm mb-4">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Ship className="w-6 h-6" />
            </div>
            <div className="stat-title">Ships</div>
            <div className="stat-value text-2xl">{solution.totalShips}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <Clock className="w-6 h-6" />
            </div>
            <div className="stat-title">Processing Time</div>
            <div className="stat-value text-lg">
              {solution.processingTime.toFixed(2)}ms
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Command Centers</div>
            <div className="stat-value text-xl">
              {solution.ships.reduce((total, ship) => total + ship.length, 0)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="label">
            <span className="label-text font-semibold">Formatted Output:</span>
          </label>
          <div className="bg-base-300 rounded-lg p-4 max-h-48 overflow-y-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {formattedOutput.join('\n')}
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <label className="label">
            <span className="label-text font-semibold">Detailed Results:</span>
          </label>

          {solution.ships.map((ship, shipIndex) => (
            <div
              key={shipIndex}
              className="collapse collapse-arrow bg-base-300"
            >
              <input type="checkbox" defaultChecked={shipIndex === 0} />
              <div className="collapse-title text-sm font-medium">
                Ship {shipIndex + 1} ({ship.length} command centers)
              </div>
              <div className="collapse-content">
                <div className="grid grid-cols-1 gap-2">
                  {ship.map((center, centerIndex) => (
                    <div
                      key={centerIndex}
                      className="bg-base-100 p-3 rounded-lg border border-base-content/10 flex justify-between items-center"
                    >
                      <div className="font-mono text-sm">
                        <span className="font-bold text-primary">
                          {center.letter}:
                        </span>{' '}
                        <span className="text-accent">
                          ({center.centerX.toFixed(3)},{' '}
                          {center.centerY.toFixed(3)})
                        </span>
                      </div>
                      <div className="badge badge-outline badge-sm">
                        Area: {center.area}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-outline btn-secondary" onClick={onCopy}>
            Copy
          </button>
          <button className="btn btn-primary" onClick={onDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
