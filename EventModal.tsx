'use client'
// components/calendar/EventModal.tsx — Create/Edit event modal

import { useState, useEffect } from 'react'
import { X, Trash2, MapPin, Tag, Clock, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { CATEGORIES, cn } from '@/lib/utils'

interface EventModalProps {
  event?: any
  defaultDate?: Date
  onSave: (data: any) => void
  onClose: () => void
  onDelete?: () => void
}

const DEFAULT_DURATION = 60 // minutes

export default function EventModal({ event, defaultDate, onSave, onClose, onDelete }: EventModalProps) {
  const isEditing = !!event
  const now = defaultDate || new Date()

  // Round to nearest 30 min
  const roundedStart = new Date(Math.ceil(now.getTime() / (30 * 60000)) * (30 * 60000))
  const roundedEnd = new Date(roundedStart.getTime() + DEFAULT_DURATION * 60000)

  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event?.startTime ? formatForInput(event.startTime) : formatForInput(roundedStart),
    endTime: event?.endTime ? formatForInput(event.endTime) : formatForInput(roundedEnd),
    category: event?.category || 'personal',
    location: event?.location || '',
    priority: event?.priority || 'medium',
    tags: event?.tags?.join(', ') || '',
  })

  function formatForInput(dt: string | Date) {
    const d = typeof dt === 'string' ? new Date(dt) : dt
    return format(d, "yyyy-MM-dd'T'HH:mm")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    })
  }

  // Auto-update end time when start changes
  function handleStartChange(val: string) {
    const start = new Date(val)
    const end = new Date(start.getTime() + DEFAULT_DURATION * 60000)
    setForm({ ...form, startTime: val, endTime: formatForInput(end) })
  }

  const catConfig = CATEGORIES[form.category as keyof typeof CATEGORIES]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <h2 className="font-semibold text-white">{isEditing ? 'Edit Event' : 'New Event'}</h2>
          <div className="flex items-center gap-1">
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <input
            required
            autoFocus
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Event title"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 text-base font-medium focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
          />

          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 font-medium block mb-1.5">Start</label>
              <input
                type="datetime-local"
                required
                value={form.startTime}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 font-medium block mb-1.5">End</label>
              <input
                type="datetime-local"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-white/40 font-medium block mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, category: key })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    form.category === key
                      ? `${cat.bg} ${cat.text} ${cat.border}`
                      : 'bg-white/5 text-white/40 border-transparent hover:bg-white/8'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs text-white/40 font-medium block mb-1.5">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-medium capitalize border transition-all',
                    form.priority === p
                      ? p === 'high' ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : p === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-white/5 text-white/35 border-transparent hover:bg-white/8'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Optional fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-white/25 flex-shrink-0" />
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location (optional)"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/6 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-white/25 flex-shrink-0" />
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags: work, urgent, focus (comma-separated)"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/6 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/6 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/8 text-white/60 text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20"
            >
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
