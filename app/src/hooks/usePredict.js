import { useState } from 'react'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const usePredict = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const predict = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post(ENDPOINTS.PREDICT, payload)
      setResult(data)
      return data
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { loading, result, error, predict, reset }
}
