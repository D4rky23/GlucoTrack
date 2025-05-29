import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 'An error occurred'
      console.error('Error message:', message)
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server')
    } else {
      // Something else happened
      console.error('Request setup error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api;
