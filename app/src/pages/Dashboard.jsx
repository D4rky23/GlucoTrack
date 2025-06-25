import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useModel } from '../hooks/useModel';

const Dashboard = () => {
  const { modelInfo, loading, error, fetchModelInfo } = useModel();

  useEffect(() => {
    fetchModelInfo();
  }, []);

  console.log('Dashboard render, modelInfo:', modelInfo, 'loading:', loading, 'error:', error);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          GlucoTrack Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Diabetes risk prediction and health monitoring system
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/predict" 
          className="group block p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Single Prediction</h3>
              <p className="text-emerald-100">Predict diabetes risk for one patient</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/batch-predict" 
          className="group block p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Batch Prediction</h3>
              <p className="text-blue-100">Upload CSV for multiple predictions</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/model" 
          className="group block p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Model Information</h3>
              <p className="text-purple-100">View model details and metrics</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Model Status</Card.Title>
          </Card.Header>
          <Card.Content>
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="text-red-600 dark:text-red-400">
                <p>Failed to load model information</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : modelInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Model Type</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {modelInfo.algorithm}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Version</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {modelInfo.version}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Trained At</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {modelInfo.trained_at ? new Date(modelInfo.trained_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ROC AUC</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {modelInfo.roc_auc}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                No model information available.<br />
                <span className="text-xs">(Check API response and browser console for errors.)</span>
              </div>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Quick Stats</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Features</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {modelInfo?.features ?? 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Prediction Type</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Diabetes Risk
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Response Format</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Probability & Classification
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity or Help Section */}
      <div className="mt-8">
        <Card>
          <Card.Header>
            <Card.Title>Getting Started</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Enter Patient Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Input health metrics like glucose, BMI, age, and other factors
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Get Prediction
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive diabetes risk probability and classification
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Review Results
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analyze predictions and make informed decisions
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
