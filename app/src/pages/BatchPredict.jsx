import React, { useState } from 'react';
import Papa from 'papaparse';
import Card from '../components/Card';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import ResultBadge from '../components/ResultBadge';
import { useBatchPredict } from '../hooks/useBatchPredict';

const BatchPredict = () => {
  const [csvData, setCsvData] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [parseError, setParseError] = useState(null);
  const { results: predictions, loading, error, batchPredict, reset } = useBatchPredict();

  const handleFileUpload = (file) => {
    setCsvFile(file);
    setParseError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError('CSV parsing error: ' + results.errors[0].message);
          return;
        }

        // Convert string values to numbers
        const processedData = results.data.map((row, index) => {
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              setParseError(`Invalid number in row ${index + 1}, column "${key}": ${value}`);
              return null;
            }
            processedRow[key] = numValue;
          }
          return processedRow;
        }).filter(row => row !== null);

        if (processedData.length === 0) {
          setParseError('No valid data rows found in CSV');
          return;
        }

        setCsvData(processedData);
      },
      error: (error) => {
        setParseError('Failed to parse CSV: ' + error.message);
      }
    });
  };

  // Mappings for backend enums
  const genderMap = { 0: 'Female', 1: 'Male', 2: 'Other' };
  const smokingMap = {
    0: 'never', 1: 'former', 2: 'current', 3: 'ever', 4: 'not current', 5: 'No Info'
  };

  const handlePredict = async () => {
    if (!csvData) return;
    // Convert numeric codes to expected strings
    const payloadData = csvData.map(row => ({
      gender: genderMap[row.gender] ?? row.gender,
      age: row.age,
      hypertension: row.hypertension,
      heart_disease: row.heart_disease,
      smoking_history: smokingMap[row.smoking_history] ?? row.smoking_history,
      bmi: row.bmi,
      HbA1c_level: row.HbA1c_level,
      blood_glucose_level: row.blood_glucose_level
    }));
    await batchPredict(payloadData);
  };

  const handleReset = () => {
    setCsvData(null);
    setCsvFile(null);
    setParseError(null);
    reset();
  };

  const downloadResults = () => {
    if (!predictions || !predictions.predictions) return;

    const csvContent = Papa.unparse(predictions.predictions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'diabetes_predictions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getResultsSummary = () => {
    if (!predictions?.predictions) return null;
    const total = predictions.predictions.length;
    const highRisk = predictions.predictions.filter(p => p.risk === 1).length;
    const lowRisk = total - highRisk;

    return { total, highRisk, lowRisk };
  };

  // Helper to check if predictions is an error array (FastAPI validation error)
  const isValidationError = (data) => {
    if (!data) return false;
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].loc && data[0].msg) return true;
    if (data && Array.isArray(data.detail) && data.detail.length > 0 && data.detail[0].loc && data.detail[0].msg) return true;
    return false;
  };

  // Helper to render validation errors as plain text (no React elements)
  const renderValidationError = (data) => {
    if (Array.isArray(data)) {
      return data.map((err, i) =>
        `${err.loc ? err.loc.join('.') : ''}: ${err.msg}`
      ).join('\n');
    }
    if (data && Array.isArray(data.detail)) {
      return data.detail.map((err, i) =>
        `${err.loc ? err.loc.join('.') : ''}: ${err.msg}`
      ).join('\n');
    }
    return 'Unknown error';
  };

  // Helper to format any error data as plain text
  const formatError = (data) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.map(err => `${err.loc?.join('.')}: ${err.msg}`).join('\n');
    if (data && Array.isArray(data.detail)) return data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join('\n');
    return JSON.stringify(data);
  };

  const resultsSummary = getResultsSummary();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Batch Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Upload a CSV file to predict diabetes risk for multiple patients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>Upload Patient Data</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  disabled={loading}
                />

                {/* CSV Requirements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    CSV Format Requirements
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <p>Your CSV must include these columns:</p>
                    <ul className="list-disc list-inside ml-2 space-y-0.5">
                      <li><code>gender</code> - Gender (0 = Female, 1 = Male, 2 = Other)</li>
                      <li><code>age</code> - Age in years</li>
                      <li><code>hypertension</code> - Hypertension (0 = No, 1 = Yes)</li>
                      <li><code>heart_disease</code> - Heart disease (0 = No, 1 = Yes)</li>
                      <li><code>smoking_history</code> - Smoking history (0 = Never, 1 = Former, 2 = Current, 3 = Ever, 4 = Not current, 5 = Unknown)</li>
                      <li><code>bmi</code> - Body Mass Index</li>
                      <li><code>HbA1c_level</code> - HbA1c level (%)</li>
                      <li><code>blood_glucose_level</code> - Blood glucose level (mg/dL)</li>
                    </ul>
                  </div>
                </div>

                {parseError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-red-800 dark:text-red-300 font-medium">CSV Error</h4>
                        <p className="text-red-700 dark:text-red-400 text-sm mt-1">{parseError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {csvData && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <h4 className="text-green-800 dark:text-green-300 font-medium">CSV Loaded Successfully</h4>
                        <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                          {csvData.length} patients ready for prediction
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show API error or validation error */}
                {(error || (predictions && isValidationError(predictions))) && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-red-800 dark:text-red-300 font-medium">Prediction Error</h4>
                        <pre className="text-red-700 dark:text-red-400 text-sm mt-1 whitespace-pre-wrap">
                          {formatError(error || predictions)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handlePredict}
                    disabled={!csvData || loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader size="sm" className="mr-2" />
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {loading ? 'Processing...' : 'Predict All'}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Results Summary */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title>Results Summary</Card.Title>
            </Card.Header>
            <Card.Content>
              {/* Only show summary if not a validation error */}
              {!error && predictions && !isValidationError(predictions) && resultsSummary && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {resultsSummary.total}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Patients
                      </div>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {resultsSummary.highRisk}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        High Risk
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {resultsSummary.lowRisk}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Low Risk
                      </div>
                    </div>
                  </div>

                  {/* Processing Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {predictions?.processing_time_seconds 
                          ? `${predictions.processing_time_seconds.toFixed(2)}s`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    
                    {predictions?.batch_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Batch ID</span>
                        <span className="font-mono text-xs text-gray-900 dark:text-white">
                          {predictions.batch_id}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {resultsSummary.total > 0 
                          ? `${((resultsSummary.total / resultsSummary.total) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={downloadResults}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Download Results
                  </button>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Results Table */}
      {/* Only show table if not a validation error */}
      {predictions?.predictions && !isValidationError(predictions) && predictions.predictions.length > 0 && (
        <div className="mt-8">
          <Card>
            <Card.Header>
              <Card.Title>Detailed Results</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Row
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Probability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Model Version
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {predictions.predictions.slice(0, 10).map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ResultBadge risk={result.risk} probability={result.probability} className="py-1 px-2 text-xs" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {(result.probability * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {result.model_version}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {predictions.predictions.length > 10 && (
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
                    Showing first 10 of {predictions.predictions.length} results. Download CSV for complete data.
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BatchPredict;
