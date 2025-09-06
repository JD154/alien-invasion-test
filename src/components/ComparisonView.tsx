import React from 'react'
import type { OverallAccuracy } from '../types/alien'
import { BarChart3, CheckCircle, AlertTriangle } from 'lucide-react'

interface ComparisonViewProps {
  overall: OverallAccuracy | null
  expectedOutput: string
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  overall,
  expectedOutput,
}) => {
  if (!overall) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-info">
            <BarChart3 className="w-5 h-5" />
            Comparison
          </h3>
          <div className="flex items-center justify-center h-32 text-base-content/50">
            {expectedOutput ? (
              <span>Waiting for solution to compare...</span>
            ) : (
              <span>Upload expected output file to compare</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-success'
    if (accuracy >= 80) return 'text-warning'
    return 'text-error'
  }

  const stats = [
    {
      title: 'Overall Accuracy',
      value: `${overall.accuracyPercentage.toFixed(1)}%`,
      valueClass: `text-2xl ${getAccuracyColor(overall.accuracyPercentage)}`,
      desc: `${overall.exactMatches + overall.closeMatches}/${
        overall.totalCenters
      } centers`,
    },
    {
      title: 'Exact Matches',
      value: overall.exactMatches,
      valueClass: 'text-success',
      desc: 'Perfect coordinate match',
      figure: <CheckCircle className="w-6 h-6" />,
      figureClass: 'text-success',
    },
    {
      title: 'Close Matches',
      value: overall.closeMatches,
      valueClass: 'text-warning',
      desc: 'Within tolerance',
      figure: <AlertTriangle className="w-6 h-6" />,
      figureClass: 'text-warning',
    },
    {
      title: 'Avg Error',
      value: overall.averageCoordinateError.toFixed(3),
      valueClass: 'text-sm',
      desc: 'Coordinate distance',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-info">
            <BarChart3 className="w-5 h-5" />
            Overall Comparison
          </h3>
          <div className="stats stats-vertical lg:stats-horizontal shadow-sm">
            {stats.map((stat, idx) => (
              <div className="stat" key={stat.title + idx}>
                {stat.figure && (
                  <div className={`stat-figure ${stat.figureClass || ''}`}>
                    {stat.figure}
                  </div>
                )}
                <div className="stat-title">{stat.title}</div>
                <div className={`stat-value ${stat.valueClass}`}>
                  {stat.value}
                </div>
                <div className="stat-desc">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
