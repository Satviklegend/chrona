// lib/utils.ts — Shared utility functions

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Category configuration with colors and icons
export const CATEGORIES = {
  work: { label: 'Work', color: '#6366f1', bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/40' },
  school: { label: 'School', color: '#8b5cf6', bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/40' },
  fitness: { label: 'Fitness', color: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  personal: { label: 'Personal', color: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
  health: { label: 'Health', color: '#ef4444', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
  social: { label: 'Social', color: '#ec4899', bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/40' },
  finance: { label: 'Finance', color: '#14b8a6', bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/40' },
  learning: { label: 'Learning', color: '#3b82f6', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
  other: { label: 'Other', color: '#6b7280', bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/40' },
} as const

export type CategoryKey = keyof typeof CATEGORIES

export function getCategoryConfig(category: string) {
  return CATEGORIES[category as CategoryKey] || CATEGORIES.other
}

/** Get days of the week for the current week view */
export function getWeekDays(date: Date, weekStart: 0 | 1 = 1): Date[] {
  const start = startOfWeek(date, { weekStartsOn: weekStart })
  return eachDayOfInterval({ start, end: addDays(start, 6) })
}

/** Format duration in minutes to human-readable string */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Calculate event duration in minutes */
export function getEventDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

/** Get position and height for calendar time grid */
export function getEventPosition(startTime: string, endTime: string, dayStart = 6) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const startHour = start.getHours() + start.getMinutes() / 60
  const endHour = end.getHours() + end.getMinutes() / 60
  const top = ((startHour - dayStart) / 18) * 100 // 18 hours displayed (6am-midnight)
  const height = ((endHour - startHour) / 18) * 100
  return { top: `${top}%`, height: `${Math.max(height, 2)}%` }
}

/** Generate productivity score color */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

/** Format date for display */
export function formatDate(date: Date | string, formatStr = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

/** Check if event is today */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isSameDay(d, new Date())
}

/** API request helper with auth */
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error || 'Request failed' }
    return { data: json }
  } catch (err) {
    return { error: 'Network error' }
  }
}
