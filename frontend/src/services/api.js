import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aarogya_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token expires or is invalid, bounce the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aarogya_token')
      localStorage.removeItem('aarogya_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
}

export const symptomAPI = {
  check: (data) => api.post('/api/symptom-checker', data),
}

export const dietAPI = {
  generate: (data) => api.post('/api/diet-planner', data),
}

export const reminderAPI = {
  list: () => api.get('/api/reminders'),
  create: (data) => api.post('/api/reminders', data),
  update: (id, data) => api.patch(`/api/reminders/${id}`, data),
  remove: (id) => api.delete(`/api/reminders/${id}`),
}

export const chatbotAPI = {
  send: (data) => api.post('/api/chatbot', data),
}

export const careAPI = {
  nearby: (data) => api.post('/api/nearby-care', data),
}

export const translateAPI = {
  translate: (data) => api.post('/api/translate', data),
}

export default api
