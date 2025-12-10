// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: string // Changed to string for SQLite compatibility
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description: string // Now supports HTML content from rich editor
  category: string
  image: string
  images: string[]
  client?: string
  technologies: string[]
  url?: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
  published: boolean
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  avatar: string
  rating: number
  published: boolean
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  image: string
  published: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface ProjectForm {
  title: string
  description: string
  category: string
  client?: string
  technologies: string[]
  url?: string
  featured: boolean
  published: boolean
}

// UI Types
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

// Animation Types
export interface AnimationProps {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

// Filter Types
export interface ProjectFilters {
  category?: string
  featured?: boolean
  published?: boolean
}

export interface BlogFilters {
  category?: string
  tag?: string
  published?: boolean
}
