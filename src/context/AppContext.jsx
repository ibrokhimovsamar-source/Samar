import { createContext, useContext, useState } from 'react'
import {
  clients as initialClients,
  contentItems as initialContentItems,
} from '../data/mockData'

const AppContext = createContext(null)

// Avatar ranglari ro'yxati
export const AVATAR_COLORS = [
  'bg-brand-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-400',
  'bg-pink-500',
  'bg-teal-500',
  'bg-red-500',
  'bg-indigo-500',
]

// Initials olish
function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AppProvider({ children }) {
  const [clients, setClients] = useState(initialClients)
  const [contentItems, setContentItems] = useState(initialContentItems)

  // ── Mijoz qo'shish ──────────────────────────────────────────
  function addClient(formData) {
    const newClient = {
      id: Date.now(),
      name: formData.name,
      type: 'client',
      niche: formData.niche,
      avatar: getInitials(formData.name),
      avatarColor: formData.avatarColor || 'bg-purple-500',
      platforms: formData.platforms,
      targetAudience: formData.targetAudience,
      positioning: formData.positioning,
      goal: formData.goal,
      monthlyVideos: Number(formData.monthlyVideos) || 4,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      phone: formData.phone || '',
      email: formData.email || '',
      notes: formData.notes || '',
      stats: {
        instagram: { followers: Number(formData.igFollowers) || 0, growth: '+0%', engagement: '0%' },
        youtube:   { subscribers: Number(formData.ytSubscribers) || 0, growth: '+0%', avgViews: 0 },
        telegram:  { members: Number(formData.tgMembers) || 0, growth: '+0%', reach: '0%' },
      },
    }
    setClients((prev) => [...prev, newClient])
    return newClient
  }

  // ── Mijozni yangilash ───────────────────────────────────────
  function updateClient(id, updates) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  // ── Mijozni o'chirish ───────────────────────────────────────
  function deleteClient(id) {
    setClients((prev) => prev.filter((c) => c.id !== id))
    setContentItems((prev) => prev.filter((v) => v.clientId !== id))
  }

  // ── Kontent qo'shish ────────────────────────────────────────
  function addContentItem(item) {
    const newItem = { id: Date.now(), ...item }
    setContentItems((prev) => [...prev, newItem])
    return newItem
  }

  // ── Kontentni yangilash ─────────────────────────────────────
  function updateContentItem(id, updates) {
    setContentItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    )
  }

  return (
    <AppContext.Provider
      value={{
        clients,
        contentItems,
        addClient,
        updateClient,
        deleteClient,
        addContentItem,
        updateContentItem,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
