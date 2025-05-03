// src/plugins/axios.ts
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://localhost:3000/api/', // thay URL API của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Thêm interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token') // hoặc từ Pinia/Store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Optional: Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Lỗi API:', error)
    return Promise.reject(error)
  },
)

export default axiosInstance
