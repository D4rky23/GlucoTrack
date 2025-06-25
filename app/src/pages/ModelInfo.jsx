import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useModel } from '../hooks/useModel';
import api from '../api/axios'; // Changed to default import
import Navbar from '../components/Navbar';

const ModelInfo = () => {
  const { data: modelInfo, loading: modelLoading, error: modelError, fetchModelInfo } = useModel();
  const [featureNames, setFeatureNames] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [featuresError, setFeaturesError] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [reloadLoading, setReloadLoading] = useState(false);

  useEffect(() => {
    fetchModelInfo();
    fetchFeatureNames();
    fetchMetrics();
  }, [fetchModelInfo]);

  const fetchFeatureNames = async () => {
    setFeaturesLoading(true);
    setFeaturesError(null);
    try {
      const response = await api.get('/api/v1/model/feature-names');
      setFeatureNames(response.data);
    } catch (error) {
      setFeaturesError(error.response?.data?.detail || 'Failed to load feature names');
    } finally {
      setFeaturesLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const response = await api.get('/api/v1/model/metrics');
      setMetrics(response.data);
    } catch (error) {
      setMetricsError(error.response?.data?.detail || 'Failed to load model metrics');
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleReloadModel = async () => {
    setReloadLoading(true);
    try {
      await api.post('/model/reload');
      // Refresh all data after reload
      await fetchModelInfo();
      await fetchFeatureNames();
      await fetchMetrics();
    } catch (error) {
      console.error('Failed to reload model:', error);
    } finally {
      setReloadLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Model Information
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Details about the diabetes prediction model
            </p>
          </div>
          
          <button
            onClick={handleReloadModel}
            disabled={reloadLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            {reloadLoading ? (
              <Loader size="sm" className="mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {reloadLoading ? 'Reloading...' : 'Reload Model'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Info */}
          <Card>
            <Card.Header>
              <Card.Title>Model Details</Card.Title>
            </Card.Header>
            <Card.Content>
              {modelLoading ? (
                <Loader />
              ) : modelError ? (
                <div className="text-red-600 dark:text-red-400">
                  <p>Failed to load model information</p>
                  <p className="text-sm mt-1">{modelError}</p>
                </div>
              ) : modelInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Model Type</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {modelInfo.model_type}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Version</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {modelInfo.version}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(modelInfo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Features</label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {modelInfo.features_count}
                      </p>
                    </div>
                  </div>

                  {modelInfo.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {modelInfo.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Ready
                    </span>
                  </div>
                </div>
              ) : null}
            </Card.Content>
          </Card>

          {/* Model Metrics */}
          <Card>
            <Card.Header>
              <Card.Title>Performance Metrics</Card.Title>
            </Card.Header>
            <Card.Content>
              {metricsLoading ? (
                <Loader />
              ) : metricsError ? (
                <div className="text-red-600 dark:text-red-400">
                  <p>Failed to load model metrics</p>
                  <p className="text-sm mt-1">{metricsError}</p>
                </div>
              ) : metrics ? (
                <div className="space-y-6">
                  {/* Overall Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(metrics.accuracy * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(metrics.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Precision</div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(metrics.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Recall</div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(metrics.f1_score * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">F1 Score</div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  {metrics.auc && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Additional Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">AUC Score</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(metrics.auc * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        {metrics.specificity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Specificity</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(metrics.specificity * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">No metrics available</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Feature Names */}
        <div className="mt-6">
          <Card>
            <Card.Header>
              <Card.Title>Model Features</Card.Title>
            </Card.Header>
            <Card.Content>
              {featuresLoading ? (
                <Loader />
              ) : featuresError ? (
                <div className="text-red-600 dark:text-red-400">
                  <p>Failed to load feature names</p>
                  <p className="text-sm mt-1">{featuresError}</p>
                </div>
              ) : featureNames?.feature_names ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    The model uses the following {featureNames.feature_names.length} features for prediction:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {featureNames.feature_names.map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">No feature information available</p>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Technical Details */}
        <div className="mt-6">
          <Card>
            <Card.Header>
              <Card.Title>Technical Details</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Model Architecture</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Algorithm</span>
                      <span className="text-gray-900 dark:text-white">LightGBM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="text-gray-900 dark:text-white">Binary Classification</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Framework</span>
                      <span className="text-gray-900 dark:text-white">scikit-learn</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Input/Output</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Input Features</span>
                      <span className="text-gray-900 dark:text-white">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Output Classes</span>
                      <span className="text-gray-900 dark:text-white">2 (Low/High Risk)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Data Type</span>
                      <span className="text-gray-900 dark:text-white">Numerical</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Model Information</h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  This diabetes prediction model is trained to assess the risk of diabetes based on key health indicators. 
                  It provides both a binary classification (high/low risk) and a probability score to help healthcare 
                  professionals make informed decisions about patient care and monitoring.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ModelInfo;
