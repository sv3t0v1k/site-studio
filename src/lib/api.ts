// API utilities for making authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: 'Network error',
      }
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create and export API client instance
export const apiClient = new ApiClient()

// Specific API methods for different resources
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  setup: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/setup', data),

  me: () => apiClient.get('/auth/me'),

  checkSetup: () => apiClient.get('/auth/check-setup'),
}

export const projectsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; featured?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString())

    return apiClient.get(`/projects?${searchParams.toString()}`)
  },

  getById: (id: string) => apiClient.get(`/projects/${id}`),

  create: (data: any) => apiClient.post('/projects', data),

  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),
}

export const contactApi = {
  sendMessage: (data: { name: string; email: string; subject: string; message: string }) =>
    apiClient.post('/contact', data),

  getMessages: (params?: { page?: number; limit?: number; read?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.read !== undefined) searchParams.set('read', params.read.toString())

    return apiClient.get(`/contact?${searchParams.toString()}`)
  },
}
