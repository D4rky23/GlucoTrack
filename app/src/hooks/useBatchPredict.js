import { useState } from 'react'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const useBatchPredict = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const batchPredict = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { data }
      const response = await api.post(ENDPOINTS.BATCH, payload)
      setResults(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || 'Batch prediction failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResults(null)
    setError(null)
  }

  return { loading, results, error, batchPredict, reset }
}
