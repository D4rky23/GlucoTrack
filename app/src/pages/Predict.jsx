import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Loader from '../components/Loader';
import ResultBadge from '../components/ResultBadge';
import { usePredict } from '../hooks/usePredict';

const Predict = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { prediction, loading, error, makePrediction } = usePredict();
  const [lastPredictionData, setLastPredictionData] = useState(null);

  const onSubmit = async (data) => {
    // Convert string inputs to numbers
    const numericData = Object.keys(data).reduce((acc, key) => {
      acc[key] = parseFloat(data[key]);
      return acc;
    }, {});

    setLastPredictionData(numericData);
    await makePrediction(numericData);
  };

  const handleReset = () => {
    reset();
    setLastPredictionData(null);
  };

  const inputFields = [
    { name: 'glucose', label: 'Glucose Level', placeholder: 'e.g., 120', min: 0, max: 300 },
    { name: 'bloodpressure', label: 'Blood Pressure', placeholder: 'e.g., 80', min: 0, max: 200 },
    { name: 'skinthickness', label: 'Skin Thickness (mm)', placeholder: 'e.g., 20', min: 0, max: 100 },
    { name: 'insulin', label: 'Insulin Level', placeholder: 'e.g., 80', min: 0, max: 1000 },
    { name: 'bmi', label: 'BMI', placeholder: 'e.g., 25.5', min: 10, max: 70, step: 0.1 },
    { name: 'diabetespedigreefunction', label: 'Diabetes Pedigree Function', placeholder: 'e.g., 0.5', min: 0, max: 3, step: 0.001 },
    { name: 'age', label: 'Age', placeholder: 'e.g., 35', min: 1, max: 120 },
    { name: 'pregnancies', label: 'Pregnancies', placeholder: 'e.g., 2', min: 0, max: 20 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Diabetes Risk Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Enter patient health data to predict diabetes risk
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Patient Health Data</Card.Title>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inputFields.map((field) => (
                    <InputField
                      key={field.name}
                      label={field.label}
                      error={errors[field.name]?.message}
                      {...register(field.name, { 
                        required: `${field.label} is required`,
                        min: { value: field.min, message: `Must be at least ${field.min}` },
                        max: { value: field.max, message: `Must be at most ${field.max}` }
                      })}
                      type="number"
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                    />
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader size="sm" className="mr-2" />
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
                      <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Results */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title>Prediction Results</Card.Title>
            </Card.Header>
            <Card.Content>
              {!prediction && !error && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter patient data and click "Predict Risk" to see results
                  </p>
                </div>
              )}

              {prediction && (
                <div className="space-y-6">
                  {/* Risk Classification */}
                  <div className="text-center">
                    <ResultBadge 
                      prediction={prediction.prediction}
                      size="lg"
                    />
                  </div>

                  {/* Probability */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Risk Probability
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
                        <span className="text-gray-600 dark:text-gray-400">High Risk</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${prediction.probability * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(prediction.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    
                    {prediction.prediction_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Prediction ID</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {prediction.prediction_id}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Timestamp</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Recommendations
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {prediction.prediction === 1 ? (
                        <ul className="space-y-1">
                          <li>• Consult with a healthcare professional</li>
                          <li>• Monitor blood glucose levels regularly</li>
                          <li>• Consider lifestyle modifications</li>
                          <li>• Schedule follow-up appointments</li>
                        </ul>
                      ) : (
                        <ul className="space-y-1">
                          <li>• Maintain current healthy lifestyle</li>
                          <li>• Continue regular health checkups</li>
                          <li>• Monitor for any changes in health</li>
                          <li>• Consider preventive measures</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Predict;
