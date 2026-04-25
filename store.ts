// lib/store.ts — Global state management with Zustand

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  timezone: string
}

export interface Event {
  id: string
  userId: string
  title: string
  description?: string
  startTime: string
  endTime: string
  category: string
  color?: string
  location?: string
  priority: string
  status: string
  tags: string[]
  aiAnalyzed: boolean
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description?: string
  type: string
  category: string
  targetDate?: string
  hoursPerWeek?: number
  progress: number
  status: string
}

export interface Habit {
  id: string
  name: string
  frequency: string
  timeOfDay?: string
  duration: number
  streak: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  // UI State
  darkMode: boolean
  toggleDarkMode: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentView: 'month' | 'week' | 'day'
  setCurrentView: (view: 'month' | 'week' | 'day') => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void

  // Event Modal
  eventModalOpen: boolean
  editingEvent: Event | null
  openEventModal: (event?: Event) => void
  closeEventModal: () => void

  // AI
  aiLoading: boolean
  setAiLoading: (loading: boolean) => void
  lastInsight: any | null
  setLastInsight: (insight: any) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  markNotificationRead: (id: string) => void
  unreadCount: number
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // UI State
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      currentView: 'week',
      setCurrentView: (view) => set({ currentView: view }),
      selectedDate: new Date(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Event Modal
      eventModalOpen: false,
      editingEvent: null,
      openEventModal: (event) => set({ eventModalOpen: true, editingEvent: event || null }),
      closeEventModal: () => set({ eventModalOpen: false, editingEvent: null }),

      // AI
      aiLoading: false,
      setAiLoading: (loading) => set({ aiLoading: loading }),
      lastInsight: null,
      setLastInsight: (insight) => set({ lastInsight: insight }),

      // Notifications
      notifications: [],
      setNotifications: (notifications) =>
        set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
        }),
      unreadCount: 0,
    }),
    {
      name: 'ai-calendar-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentView: state.currentView,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
