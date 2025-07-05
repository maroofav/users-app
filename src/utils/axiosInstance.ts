import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 60 * 3, // 3 minutes
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    switch (error?.response?.status) {
      case 401: {
        return Promise.reject(error)
      }

      case 403: {
        return Promise.reject(error)
      }

      case 400: {
        return Promise.reject(error)
      }

      case 404: {
        return Promise.reject(error)
      }

      case 500: {
        return Promise.reject(error)
      }

      case 502: {
        return Promise.reject(error)
      }

      default: {
        return Promise.reject(error)
      }
    }
  },
)
