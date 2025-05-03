// src/plugins/axios.ts
import axios from 'axios'

const axios_auth = axios.create({
  baseURL: 'http://localhost:3000/api/', // thay URL API của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axios_auth
