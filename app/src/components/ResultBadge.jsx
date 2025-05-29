export default function ResultBadge({ risk, probability, className = '' }) {
  const isHighRisk = risk === 1
  const percentageProb = Math.round(probability * 100)
  
  const badgeClasses = isHighRisk 
    ? 'bg-red-600 text-white border-red-200' 
    : 'bg-emerald-600 text-white border-emerald-200'
  
  const iconClasses = isHighRisk ? 'text-red-100' : 'text-emerald-100'

  return (
    <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-xl border-2 ${badgeClasses} ${className}`}>
      <div className={`flex-shrink-0 ${iconClasses}`}>
        {isHighRisk ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="font-bold text-lg">
          {isHighRisk ? 'High Risk' : 'Low Risk'}
        </span>
        <span className="text-sm opacity-90">
          {percentageProb}% probability
        </span>
      </div>
    </div>
  )
}

export function ProbabilityBar({ probability, className = '' }) {
  const percentage = Math.round(probability * 100)
  const isHighRisk = probability > 0.5
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Diabetes Risk
        </span>
        <span className={`text-sm font-bold ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            isHighRisk ? 'bg-red-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
