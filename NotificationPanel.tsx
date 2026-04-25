'use client'
// components/dashboard/NotificationPanel.tsx

import { useStore } from '@/lib/store'
import { X, Bell, AlertTriangle, Lightbulb, Clock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface Props { onClose: () => void }

const TYPE_ICONS: Record<string, any> = {
  reminder: Clock,
  alert: AlertTriangle,
  insight: Lightbulb,
}

const TYPE_COLORS: Record<string, string> = {
  reminder: 'text-blue-400 bg-blue-500/10',
  alert: 'text-amber-400 bg-amber-500/10',
  insight: 'text-violet-400 bg-violet-500/10',
}

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, markNotificationRead, unreadCount } = useStore()

  async function handleRead(id: string) {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    markNotificationRead(id)
  }

  return (
    <div className="fixed right-4 top-14 z-50 w-80 animate-slide-down">
      <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white/50" />
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-white/15 mx-auto mb-2" />
              <p className="text-sm text-white/30">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] || Bell
                const colorClass = TYPE_COLORS[n.type] || 'text-white/40 bg-white/5'
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.read && handleRead(n.id)}
                    className={`flex gap-3 p-4 transition-colors cursor-pointer hover:bg-white/3 ${n.read ? 'opacity-50' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white leading-snug">{n.title}</p>
                      <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-white/25 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
