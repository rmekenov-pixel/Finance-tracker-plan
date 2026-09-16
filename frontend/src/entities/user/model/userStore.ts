import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
  currency: string
  avatarUrl?: string
}

interface UserState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))
