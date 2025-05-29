import { useState, useEffect, useCallback } from 'react' // Added useCallback
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const useModel = () => {
  const [loading, setLoading] = useState(false)
  const [modelInfo, setModelInfo] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [features, setFeatures] = useState(null)
  const [error, setError] = useState(null)

  const fetchModelInfo = useCallback(async () => { // Wrapped in useCallback
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(ENDPOINTS.MODEL_INFO)
      setModelInfo(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch model info')
      throw err
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array as setters are stable

  const fetchMetrics = useCallback(async () => { // Wrapped in useCallback
    try {
      const { data } = await api.get(ENDPOINTS.MODEL_METRICS)
      setMetrics(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch metrics')
      throw err
    }
  }, []) // Empty dependency array

  const fetchFeatures = useCallback(async () => { // Wrapped in useCallback
    try {
      const { data } = await api.get(ENDPOINTS.MODEL_FEATURES)
      setFeatures(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch features')
      throw err
    }
  }, []) // Empty dependency array

  const reloadModel = useCallback(async () => { // Wrapped in useCallback
    try {
      const { data } = await api.post(ENDPOINTS.MODEL_RELOAD)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reload model')
      throw err
    }
  }, []) // Empty dependency array

  return {
    loading,
    modelInfo,
    metrics,
    features,
    error,
    fetchModelInfo,
    fetchMetrics,
    fetchFeatures,
    reloadModel
  }
}

export const useHealth = () => {
  const [loading, setLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState(null)
  const [readyStatus, setReadyStatus] = useState(null)
  const [error, setError] = useState(null)

  const checkHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(ENDPOINTS.HEALTH)
      setHealthStatus(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Health check failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const checkReady = async () => {
    try {
      const { data } = await api.get(ENDPOINTS.READY)
      setReadyStatus(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Ready check failed')
      throw err
    }
  }

  useEffect(() => {
    checkHealth()
    checkReady()
  }, [])

  return {
    loading,
    healthStatus,
    readyStatus,
    error,
    checkHealth,
    checkReady
  }
}
