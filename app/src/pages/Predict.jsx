import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Loader from '../components/Loader';
import ResultBadge from '../components/ResultBadge';
import { usePredict } from '../hooks/usePredict';
import BackgroundIcons from '../components/BackgroundIcons';
import '../components/background-icons.css';
import SkeletonLoader from '../components/SkeletonLoader';
import Toast from '../components/Toast';
import InfoTooltip from '../components/InfoTooltip';
import RevealOnScroll from '../components/RevealOnScroll';

const getRiskLevel = (prob, pred) => {
  if (typeof prob !== 'number' || isNaN(prob)) return 'unknown';
  if (prob < 0.33) return 'low';
  if (prob < 0.66) return 'medium';
  return 'high';
};

const getRecommendations = (prob, conf) => {
  if (typeof prob !== 'number' || isNaN(prob)) return [
    'Unable to provide recommendations. Please try again or check your input.'
  ];
  if (prob >= 0.8) {
    return [
      'Consult with a healthcare professional',
      'Monitor blood glucose levels regularly',
      'Consider lifestyle modifications',
      'Schedule follow-up appointments',
    ];
  }
  if (prob >= 0.5) {
    return [
      'Increase monitoring of health metrics',
      'Discuss risk factors with your doctor',
      'Adopt healthy lifestyle changes',
      'Schedule a checkup soon',
    ];
  }
  return [
    'Maintain current healthy lifestyle',
    'Continue regular health checkups',
    'Monitor for any changes in health',
    'Consider preventive measures',
  ];
};

const Predict = () => {
  const { register, handleSubmit, formState: { errors }, reset: resetForm, setError, clearErrors } = useForm();
  const { result: prediction, loading, error, predict: makePrediction, reset: resetPredict } = usePredict();
  const [lastPredictionData, setLastPredictionData] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const onSubmit = async (data) => {
    // Validate numeric fields
    let hasError = false;
    if (data.age < 1 || data.age > 120) {
      setError('age', { type: 'manual', message: 'Age must be between 1 and 120' });
      hasError = true;
    }
    if (data.bmi < 10 || data.bmi > 80) {
      setError('bmi', { type: 'manual', message: 'BMI must be between 10 and 80' });
      hasError = true;
    }
    if (data.HbA1c_level < 3.5 || data.HbA1c_level > 15) {
      setError('HbA1c_level', { type: 'manual', message: 'HbA1c must be between 3.5 and 15' });
      hasError = true;
    }
    if (data.blood_glucose_level < 50 || data.blood_glucose_level > 400) {
      setError('blood_glucose_level', { type: 'manual', message: 'Blood Glucose must be between 50 and 400' });
      hasError = true;
    }
    if (hasError) return;
    // Conversie robustă pentru toate câmpurile numerice
    const numericData = { ...data };
    ['age','bmi','HbA1c_level','blood_glucose_level','hypertension','heart_disease'].forEach(key => {
      if (numericData[key] !== undefined && numericData[key] !== "") {
        numericData[key] = Number(numericData[key]);
      }
    });
    // Elimină câmpurile cu valoare ""
    Object.keys(numericData).forEach(key => {
      if (numericData[key] === "") delete numericData[key];
    });
    setLastPredictionData(numericData);
    setShowResults(false);
    try {
      await makePrediction(numericData);
      setShowResults(true);
      setToastOpen(true);
    } catch {
      setShowResults(false);
      setToastOpen(true);
    }
  };

  const handleReset = () => {
    resetForm();
    resetPredict();
    setLastPredictionData(null);
    setShowResults(false);
    clearErrors();
  };

  const inputFields = [
    { name: 'gender', label: 'Gender', type: 'select', options: [
      { value: '', label: 'Select gender' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ] },
    { name: 'age', label: 'Age', placeholder: 'e.g., 35', min: 1, max: 120 },
    { name: 'hypertension', label: 'Hypertension', type: 'select', options: [
      { value: '', label: 'Select' },
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ] },
    { name: 'heart_disease', label: 'Heart Disease', type: 'select', options: [
      { value: '', label: 'Select' },
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ] },
    { name: 'smoking_history', label: 'Smoking History', type: 'select', options: [
      { value: '', label: 'Select' },
      { value: 'never', label: 'Never' },
      { value: 'No Info', label: 'No Info' },
      { value: 'current', label: 'Current' },
      { value: 'former', label: 'Former' },
      { value: 'ever', label: 'Ever' },
      { value: 'not current', label: 'Not Current' }
    ] },
    { name: 'bmi', label: 'BMI', placeholder: 'e.g., 25.5', min: 10, max: 80, step: 0.1 },
    { name: 'HbA1c_level', label: 'HbA1c Level', placeholder: 'e.g., 5.5', min: 3.5, max: 15, step: 0.1 },
    { name: 'blood_glucose_level', label: 'Blood Glucose Level', placeholder: 'e.g., 120', min: 50, max: 400 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <BackgroundIcons />
      <RevealOnScroll y={-30} delay={0}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Diabetes Risk Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Enter patient health data to predict diabetes risk
        </p>
      </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Form */}
        <RevealOnScroll y={30} delay={0.1}>
        <div>
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl">
            <Card.Header>
              <Card.Title>Patient Health Data</Card.Title>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inputFields.map((field) => (
                    field.type === 'select' ? (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{field.label}</label>
                        <select
                          {...register(field.name, { required: true })}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                          defaultValue=""
                        >
                          {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {errors[field.name] && (
                          <span className="text-xs text-red-500">This field is required</span>
                        )}
                      </div>
                    ) : (
                      <InputField
                        key={field.name}
                        label={field.label}
                        error={errors[field.name]?.message}
                        register={register}
                        name={field.name}
                        type="number"
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        className="rounded-xl px-4 py-3 bg-white dark:bg-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      />
                    )
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg"
                  >
                    {loading ? (
                      <SkeletonLoader height={24} width={24} className="mr-2 inline-block align-middle" />
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {loading ? 'Predicting...' : 'Predict Risk'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-red-800 dark:text-red-300 font-medium">Prediction Error</h4>
                      <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                        {Array.isArray(error)
                          ? (
                            <ul className="list-disc list-inside">
                              {error.map((err, idx) => (
                                <li key={idx}>
                                  {err.loc ? `${err.loc.join('.')} - ` : ''}{err.msg}
                                </li>
                              ))}
                            </ul>
                          )
                          : (typeof error === 'string' ? error : JSON.stringify(error))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
        </RevealOnScroll>

        {/* Results */}
        <RevealOnScroll y={30} delay={0.2}>
        <div>
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl min-h-[420px] flex flex-col justify-center">
            <Card.Header>
              <Card.Title>Prediction Results</Card.Title>
            </Card.Header>
            <Card.Content>
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 opacity-80">
                  <Loader />
                  <span className="mt-4 text-slate-500">Predicting...</span>
                </div>
              )}
              {!loading && !showResults && !error && (
                <div className="text-center py-8 opacity-80">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter patient data and click "Predict Risk" to see results
                  </p>
                </div>
              )}
              {!loading && showResults && prediction && (
                <div className="space-y-6 opacity-100 transition-opacity duration-500">
                  {/* Risk Classification */}
                  <div className="text-center">
                    <ResultBadge 
                      risk={getRiskLevel(prediction.probability, prediction.prediction)}
                      probability={typeof prediction.probability === 'number' && !isNaN(prediction.probability) ? prediction.probability : 0}
                      className="transition-opacity duration-500"
                    />
                  </div>
                  {/* Probability Bar */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Risk Probability
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
                        <span className="text-gray-600 dark:text-gray-400">High Risk</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, (typeof prediction.probability === 'number' && !isNaN(prediction.probability) ? prediction.probability * 100 : 0)))}%`,
                            background: `linear-gradient(90deg, #34d399 0%, #f59e42 50%, #ef4444 100%)`,
                          }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {typeof prediction.probability === 'number' && !isNaN(prediction.probability) ? `${(prediction.probability * 100).toFixed(1)}%` : '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {typeof prediction.confidence === 'number' && !isNaN(prediction.confidence) ? `${(prediction.confidence * 100).toFixed(1)}%` : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Timestamp</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {prediction.timestamp ? new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(prediction.timestamp)) : new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date())}
                      </span>
                    </div>
                  </div>
                  {/* Recommendations */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Recommendations
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <ul className="space-y-1">
                        {getRecommendations(prediction.probability, prediction.confidence).map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {!loading && error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-red-800 dark:text-red-300 font-medium">Prediction Error</h4>
                      <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                        {Array.isArray(error)
                          ? (
                            <ul className="list-disc list-inside">
                              {error.map((err, idx) => (
                                <li key={idx}>
                                  {err.loc ? `${err.loc.join('.')} - ` : ''}{err.msg}
                                </li>
                              ))}
                            </ul>
                          )
                          : (typeof error === 'string' ? error : JSON.stringify(error))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
        </RevealOnScroll>
      </div>

      <Toast open={toastOpen} message="Prediction complete!" onClose={() => setToastOpen(false)} />
    </div>
  );
};

export default Predict;

// Example InfoTooltip usage for a field:
// <InfoTooltip content="Body Mass Index. Raport între greutate și înălțime."><span className="ml-1">ℹ️</span></InfoTooltip>
