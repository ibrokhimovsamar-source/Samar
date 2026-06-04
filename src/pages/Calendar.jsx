import { useState } from 'react'
import { Plus, Filter, ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { contentStatuses, platforms } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import PlatformBadge from '../components/PlatformBadge'

const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
const KANBAN_COLS = [
  { key: 'idea',     label: "G'oya",   color: 'border-gray-300',   bg: 'bg-gray-50',    dot: 'bg-gray-400'   },
  { key: 'script',   label: 'Script',  color: 'border-blue-300',   bg: 'bg-blue-50',    dot: 'bg-blue-400'   },
  { key: 'shooting', label: 'Yozuv',   color: 'border-yellow-300', bg: 'bg-yellow-50',  dot: 'bg-yellow-400' },
  { key: 'editing',  label: 'Montaj',  color: 'border-orange-300', bg: 'bg-orange-50',  dot: 'bg-orange-400' },
  { key: 'ready',    label: 'Tayyor',  color: 'border-green-300',  bg: 'bg-green-50',   dot: 'bg-green-400'  },
  { key: 'published',label: 'Chiqdi',  color: 'border-brand-300',  bg: 'bg-brand-50',   dot: 'bg-brand-500'  },
]

// Modal: Video qo'shish
function AddVideoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">Yangi Video Qo'shish</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mijoz</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
              {clients.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Video sarlavhasi</label>
            <input type="text" placeholder="Video mavzusini kiriting..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hook (birinchi jumlа)</label>
            <input type="text" placeholder="Tomoshabinni ushlab qoluvchi gap..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Platforma</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
                <option>instagram</option>
                <option>youtube</option>
                <option>telegram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tur</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
                <option>reel</option>
                <option>long-form</option>
                <option>short</option>
                <option>post</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
                {Object.entries(contentStatuses).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
              <input type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA</label>
            <input type="text" placeholder="Konsultatsiyaga yoziling..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Izoh</label>
            <textarea rows={2} placeholder="Qo'shimcha ma'lumotlar..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Bekor qilish</button>
          <button onClick={onClose} className="btn-primary flex-1 text-sm">Saqlash</button>
        </div>
      </div>
    </div>
  )
}

// Kanban karta
function KanbanCard({ item }) {
  const client = clients.find(c => c.id === item.clientId)
  const daysLeft = item.deadline
    ? Math.ceil((new Date(item.deadline) - new Date()) / 86400000)
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition cursor-pointer group">
      {/* Client chip */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`w-5 h-5 ${client?.avatarColor} rounded-md flex items-center justify-center text-white text-xs font-bold`}>
          {client?.avatar?.charAt(0)}
        </div>
        <span className="text-xs text-gray-500 font-medium">{client?.name.split(' ')[0]}</span>
        <div className="ml-auto">
          <PlatformBadge platform={item.platform} />
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-2">
        {item.title}
      </p>

      {/* Hook */}
      {item.hook && (
        <p className="text-xs text-gray-400 italic mb-2 truncate">"{item.hook}"</p>
      )}

      {/* Type badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="badge bg-gray-100 text-gray-600 text-xs">
          {item.type === 'reel' ? '🎬 Reel' : item.type === 'long-form' ? '📹 Long' : item.type === 'short' ? '⚡ Short' : '📝 Post'}
        </span>
      </div>

      {/* Deadline */}
      {daysLeft !== null && item.status !== 'published' && (
        <div className={`flex items-center gap-1 text-xs font-medium mt-2 pt-2 border-t border-gray-100
          ${daysLeft <= 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
          <CalIcon size={11} />
          {daysLeft <= 0 ? 'Bugun!' : daysLeft === 1 ? 'Ertaga' : `${daysLeft} kun qoldi`}
          <span className="ml-auto text-gray-300">{item.deadline}</span>
        </div>
      )}

      {/* Published stats */}
      {item.status === 'published' && item.views > 0 && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>👁 {item.views >= 1000 ? `${(item.views/1000).toFixed(1)}k` : item.views}</span>
          <span>❤️ {item.likes}</span>
          <span>🔖 {item.saves}</span>
        </div>
      )}
    </div>
  )
}

// Oylik view — grid
function MonthView({ month, year, filterClient }) {
  const filtered = contentItems.filter(item => {
    const matchMonth = item.month === month && item.year === year
    const matchClient = filterClient === 'all' || item.clientId === Number(filterClient)
    return matchMonth && matchClient
  })

  const weeks = [1, 2, 3, 4]

  return (
    <div className="space-y-4">
      {weeks.map(week => {
        const weekItems = filtered.filter(i => i.week === week)
        return (
          <div key={week} className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center text-xs font-bold">
                {week}
              </span>
              <h4 className="font-semibold text-gray-700 text-sm">{week}-hafta</h4>
              <span className="text-xs text-gray-400">({weekItems.length} ta video)</span>
            </div>
            {weekItems.length === 0 ? (
              <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-gray-400">Bu hafta uchun kontent yo'q</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {weekItems.map(item => <KanbanCard key={item.id} item={item} />)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Calendar() {
  const { clients, contentItems, addContentItem } = useApp()
  const [view, setView] = useState('kanban') // 'kanban' | 'month'
  const [currentMonth, setCurrentMonth] = useState(6)
  const [currentYear, setCurrentYear] = useState(2024)
  const [filterClient, setFilterClient] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const filtered = contentItems.filter(item =>
    filterClient === 'all' || item.clientId === Number(filterClient)
  )

  const prevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  return (
    <div className="space-y-5">
      {showModal && <AddVideoModal onClose={() => setShowModal(false)} />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {[
            { key: 'kanban', label: 'Kanban' },
            { key: 'month',  label: 'Oylik'  },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                view === v.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Month nav (only month view) */}
        {view === 'month' && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
            <button onClick={prevMonth} className="p-0.5 hover:text-brand-500 transition">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-800 w-28 text-center">
              {MONTHS[currentMonth - 1]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-0.5 hover:text-brand-500 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Client filter */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-gray-400" />
          <select value={filterClient} onChange={e => setFilterClient(e.target.value)}
            className="text-sm text-gray-700 bg-transparent focus:outline-none font-medium">
            <option value="all">Barcha mijozlar</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name.split(' ')[0]}</option>)}
          </select>
        </div>

        <div className="ml-auto">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Video qo'shish
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {KANBAN_COLS.map(col => {
          const count = filtered.filter(i => i.status === col.key).length
          return (
            <div key={col.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${col.color} ${col.bg} text-sm`}>
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className="font-medium text-gray-700">{col.label}</span>
              <span className="font-bold text-gray-900">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Views */}
      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLS.map(col => {
            const colItems = filtered.filter(i => i.status === col.key)
            return (
              <div key={col.key} className="flex-shrink-0 w-64">
                {/* Col header */}
                <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-xl border ${col.color} ${col.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span className="text-sm font-semibold text-gray-800">{col.label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-white/70 w-6 h-6 rounded-lg flex items-center justify-center">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-32">
                  {colItems.map(item => <KanbanCard key={item.id} item={item} />)}

                  {/* Empty state */}
                  {colItems.length === 0 && (
                    <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-400 text-center px-2">Bo'sh</p>
                    </div>
                  )}

                  {/* Add button per col */}
                  <button onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-200 transition">
                    <Plus size={13} /> Qo'shish
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <MonthView month={currentMonth} year={currentYear} filterClient={filterClient} />
      )}
    </div>
  )
}
