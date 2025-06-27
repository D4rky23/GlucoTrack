import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useModel } from '../hooks/useModel';
import api from '../api/axios'; // Changed to default import
import Navbar from '../components/Navbar';
import BackgroundIcons from '../components/BackgroundIcons';
import '../components/background-icons.css';
import SkeletonLoader from '../components/SkeletonLoader';
import Toast from '../components/Toast';
import InfoTooltip from '../components/InfoTooltip';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import RevealOnScroll from '../components/RevealOnScroll';

const ModelInfo = () => {
  // FIX: Use correct destructuring for useModel
  const { modelInfo, loading: modelLoading, error: modelError, fetchModelInfo } = useModel();
  const [featureNames, setFeatureNames] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [featuresError, setFeaturesError] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    fetchModelInfo();
    fetchFeatureNames();
    fetchMetrics();
  }, [fetchModelInfo]);

  useEffect(() => {
    if (modelInfo && !modelLoading && !modelError) setToastOpen(true);
  }, [modelInfo, modelLoading, modelError]);

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
      await api.post('/api/v1/model/reload');
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

  // DEBUG: Log modelInfo to help diagnose empty card
  console.log('ModelInfo page: modelInfo =', modelInfo);

  return (
    <div className="relative">
      <BackgroundIcons />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        {/* Header */}
        <RevealOnScroll y={-30} delay={0}>
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
        </RevealOnScroll>

        <RevealOnScroll y={30} delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Info */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl">
            <Card.Header>
              <Card.Title>Model Details</Card.Title>
            </Card.Header>
            <Card.Content>
              {modelLoading ? (
                <div className="space-y-3">
                  <SkeletonLoader height={24} width="60%" />
                  <SkeletonLoader height={24} width="40%" />
                  <SkeletonLoader height={24} width="80%" />
                  <SkeletonLoader height={24} width="50%" />
                </div>
              ) : modelError ? (
                <div className="text-red-600 dark:text-red-400">
                  <p>Failed to load model information</p>
                  <p className="text-sm mt-1">{modelError}</p>
                </div>
              ) : modelInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Algorithm
                      <InfoTooltip content="The machine learning algorithm used for prediction." />
                    </span>
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
                    <span className="text-gray-600 dark:text-gray-300">ROC AUC
                      <InfoTooltip content="Receiver Operating Characteristic Area Under Curve. Measures model performance (1 = perfect, 0.5 = random)." />
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {modelInfo.roc_auc}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Features
                      <InfoTooltip content="Number of input variables used by the model." />
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {modelInfo.features}
                    </span>
                  </div>
                  {/* --- Extra Model Metadata --- */}
                  {modelInfo.model_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Model Name</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{modelInfo.model_name}</span>
                    </div>
                  )}
                  {modelInfo.description && (
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-300">Description:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{modelInfo.description}</span>
                    </div>
                  )}
                  {modelInfo.author && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Author</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{modelInfo.author}</span>
                    </div>
                  )}
                  {modelInfo.training_data && (
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-300">Training Data:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{modelInfo.training_data}</span>
                    </div>
                  )}
                  {modelInfo.extra_info && (
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-300">Extra Info:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{modelInfo.extra_info}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No model information available.<br />
                  <span className="text-xs">(Check API response and browser console for errors.)</span>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Model Metrics */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl">
            <Card.Header>
              <Card.Title>Performance Metrics</Card.Title>
            </Card.Header>
            <Card.Content>
              {metricsLoading ? (
                <div className="space-y-3">
                  <SkeletonLoader height={32} width="100%" />
                  <SkeletonLoader height={32} width="80%" />
                  <SkeletonLoader height={32} width="60%" />
                </div>
              ) : metricsError ? (
                <div className="text-red-600 dark:text-red-400">
                  <p>Failed to load model metrics</p>
                  <p className="text-sm mt-1">{metricsError}</p>
                </div>
              ) : metrics ? (
                <div className="space-y-6">
                  {/* Animated Bar Chart for Metrics */}
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{
                        name: 'Accuracy', value: metrics.accuracy * 100
                      }, {
                        name: 'Precision', value: metrics.precision * 100
                      }, {
                        name: 'Recall', value: metrics.recall * 100
                      }, {
                        name: 'F1 Score', value: metrics.f1_score * 100
                      }]}
                      >
                        <XAxis dataKey="name" stroke="#888" fontSize={14} tickLine={false} axisLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip formatter={(v) => v.toFixed(1) + '%'} />
                        <Bar dataKey="value" radius={[8,8,0,0]}>
                          {['#10B981','#3B82F6','#F59E42','#A78BFA'].map((color, idx) => (
                            <Cell key={color} fill={color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                  {/* Animated Progress Bar for AUC */}
                  {metrics.roc_auc && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">ROC AUC</h4>
                      <AnimatedProgressBar value={metrics.roc_auc} max={1} />
                      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{(metrics.roc_auc * 100).toFixed(1)}%</div>
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
        </RevealOnScroll>

        {/* Feature Names */}
        <RevealOnScroll y={30} delay={0.2}>
        <div className="mt-6">
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl">
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
              ) : featureNames?.features ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    The model uses the following {featureNames.features.length} features for prediction:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {featureNames.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {feature.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {/* English description for each feature */}
                          {feature.type === 'numeric' && 'Numeric value'}
                          {feature.type === 'categorical' && feature.allowed_values ? `Categorical: ${feature.allowed_values.join(', ')}` : ''}
                          {feature.type === 'binary' && '0 = No, 1 = Yes'}
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
        </RevealOnScroll>

        {/* Technical Details */}
        <RevealOnScroll y={30} delay={0.3}>
        <div className="mt-6">
          <Card className="transition-all duration-300 bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:from-gray-900/80 dark:via-emerald-900/30 dark:to-gray-900/80 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-900/40 dark:hover:to-gray-900/90 shadow-md hover:shadow-xl">
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
        </RevealOnScroll>

        <Toast open={toastOpen} message="Model info loaded!" onClose={() => setToastOpen(false)} />
      </div>
    </div>
  );
};

export default ModelInfo;
