import { useState, useMemo } from 'react'
import {
  Search, Eye, Heart, Bookmark,
  TrendingUp, Flame, Star, LayoutGrid, List, Download,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportVideosCSV } from '../utils/exportUtils'
import StatusBadge from '../components/StatusBadge'
import PlatformBadge from '../components/PlatformBadge'

const TYPE_LABELS = {
  reel: '🎬 Reel',
  'long-form': '📹 Long-form',
  short: '⚡ Short',
  post: '📝 Post',
}

const SORT_OPTIONS = [
  { value: 'views-desc',    label: 'Ko\'rishlar (ko\'p)'   },
  { value: 'views-asc',     label: 'Ko\'rishlar (kam)'    },
  { value: 'likes-desc',    label: 'Likes (ko\'p)'        },
  { value: 'saves-desc',    label: 'Saves (ko\'p)'        },
  { value: 'deadline-asc',  label: 'Deadline (yaqin)'    },
  { value: 'deadline-desc', label: 'Deadline (uzoq)'     },
]

// Engagement rate hisoblash
function engRate(item) {
  if (!item.views || item.views === 0) return 0
  return (((item.likes + item.comments + item.saves) / item.views) * 100).toFixed(1)
}

// Grid karta
function VideoCard({ item, client }) {
  const eng = engRate(item)
  const isPublished = item.status === 'published'

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 ${client?.avatarColor} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {client?.avatar?.charAt(0)}
          </div>
          <span className="text-xs text-gray-500 font-medium">{client?.name.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PlatformBadge platform={item.platform} />
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-600 transition-colors">
        {item.title}
      </h4>

      {/* Hook */}
      {item.hook && (
        <p className="text-xs text-gray-400 italic mb-3 line-clamp-1">"{item.hook}"</p>
      )}

      {/* Type + Status */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className="badge bg-gray-100 text-gray-600">{TYPE_LABELS[item.type] || item.type}</span>
        <StatusBadge status={item.status} />
      </div>

      {/* Stats (published only) */}
      {isPublished && item.views > 0 ? (
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">
              {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
            </p>
            <p className="text-xs text-gray-400">Ko'rish</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-pink-500">{item.likes >= 1000 ? `${(item.likes/1000).toFixed(1)}k` : item.likes}</p>
            <p className="text-xs text-gray-400">Like</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-yellow-500">{item.saves >= 1000 ? `${(item.saves/1000).toFixed(1)}k` : item.saves}</p>
            <p className="text-xs text-gray-400">Save</p>
          </div>
          <div className="text-center">
            <p className={`text-sm font-bold ${Number(eng) >= 5 ? 'text-green-600' : 'text-gray-700'}`}>{eng}%</p>
            <p className="text-xs text-gray-400">Eng.</p>
          </div>
        </div>
      ) : !isPublished ? (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Deadline:</span>
          <span className="text-xs font-semibold text-gray-600">{item.deadline}</span>
        </div>
      ) : null}

      {/* Notes */}
      {item.notes && (
        <div className="mt-2 px-2.5 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-700 line-clamp-1">💡 {item.notes}</p>
        </div>
      )}
    </div>
  )
}

// List row
function VideoRow({ item, client }) {
  const eng = engRate(item)
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/20 transition cursor-pointer">
      {/* Avatar */}
      <div className={`w-8 h-8 ${client?.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {client?.avatar?.charAt(0)}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <PlatformBadge platform={item.platform} />
          <StatusBadge status={item.status} />
          <span className="badge bg-gray-100 text-gray-600">{TYPE_LABELS[item.type]}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
        <div className="text-center w-16">
          <p className="text-sm font-bold text-gray-800">
            {item.views > 0 ? (item.views >= 1000 ? `${(item.views/1000).toFixed(1)}k` : item.views) : '—'}
          </p>
          <p className="text-xs text-gray-400">Ko'rish</p>
        </div>
        <div className="text-center w-12">
          <p className="text-sm font-bold text-pink-500">{item.likes > 0 ? item.likes : '—'}</p>
          <p className="text-xs text-gray-400">Like</p>
        </div>
        <div className="text-center w-12">
          <p className="text-sm font-bold text-yellow-500">{item.saves > 0 ? item.saves : '—'}</p>
          <p className="text-xs text-gray-400">Save</p>
        </div>
        <div className="text-center w-14">
          <p className={`text-sm font-bold ${Number(eng) >= 5 ? 'text-green-600' : item.views > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
            {item.views > 0 ? `${eng}%` : '—'}
          </p>
          <p className="text-xs text-gray-400">Eng.</p>
        </div>
        <div className="text-center w-24">
          <p className="text-xs font-medium text-gray-600">{item.publishDate || item.deadline}</p>
          <p className="text-xs text-gray-400">{item.publishDate ? 'Chiqarildi' : 'Deadline'}</p>
        </div>
      </div>
    </div>
  )
}

export default function Library() {
  const { clients, contentItems } = useApp()
  const [search, setSearch]           = useState('')
  const [filterClient, setFilterClient] = useState('all')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [sortBy, setSortBy]           = useState('views-desc')
  const [viewMode, setViewMode]       = useState('grid') // 'grid' | 'list'

  // Filtered + sorted
  const items = useMemo(() => {
    let arr = [...contentItems]

    // search
    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.hook.toLowerCase().includes(q) ||
        (i.notes && i.notes.toLowerCase().includes(q))
      )
    }
    // filters
    if (filterClient !== 'all') arr = arr.filter(i => i.clientId === Number(filterClient))
    if (filterPlatform !== 'all') arr = arr.filter(i => i.platform === filterPlatform)
    if (filterStatus !== 'all') arr = arr.filter(i => i.status === filterStatus)

    // sort
    const [field, dir] = sortBy.split('-')
    arr.sort((a, b) => {
      let av = a[field] ?? 0, bv = b[field] ?? 0
      if (field === 'deadline') { av = new Date(a.deadline || '9999'); bv = new Date(b.deadline || '9999') }
      return dir === 'desc' ? bv - av : av - bv
    })
    return arr
  }, [search, filterClient, filterPlatform, filterStatus, sortBy])

  // Top performers
  const topByViews  = [...contentItems].filter(v => v.views > 0).sort((a,b) => b.views - a.views)[0]
  const topBySaves  = [...contentItems].filter(v => v.saves > 0).sort((a,b) => b.saves - a.saves)[0]
  const topByEngagement = [...contentItems]
    .filter(v => v.views > 0)
    .sort((a,b) => Number(engRate(b)) - Number(engRate(a)))[0]

  const publishedCount = contentItems.filter(v => v.status === 'published').length
  const totalViews = contentItems.reduce((s, v) => s + v.views, 0)

  return (
    <div className="space-y-5">

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Eye,      iconBg: 'bg-brand-500',  label: 'Jami Ko\'rishlar', value: totalViews.toLocaleString() },
          { icon: Flame,    iconBg: 'bg-orange-400', label: 'Chiqarilgan',      value: publishedCount },
          { icon: Star,     iconBg: 'bg-yellow-400', label: 'Eng Ko\'p Save',   value: topBySaves?.saves?.toLocaleString() || '—' },
          { icon: TrendingUp, iconBg: 'bg-green-500', label: 'Top Engagement', value: topByEngagement ? `${engRate(topByEngagement)}%` : '—' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center`}>
              <s.icon size={16} className="text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900 mt-2">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top 3 highlight */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '👁 Eng Ko\'p Ko\'rilgan', video: topByViews,      metric: `${topByViews?.views?.toLocaleString()} ko'rish`, color: 'bg-brand-50 border-brand-200' },
          { label: '🔖 Eng Ko\'p Save',       video: topBySaves,      metric: `${topBySaves?.saves?.toLocaleString()} save`,    color: 'bg-yellow-50 border-yellow-200' },
          { label: '🔥 Eng Yuqori Engagement',video: topByEngagement, metric: `${engRate(topByEngagement)}% engagement`,        color: 'bg-green-50 border-green-200' },
        ].map((item, i) => (
          <div key={i} className={`card border ${item.color} flex flex-col gap-1`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
              {item.video?.title || '—'}
            </p>
            <p className="text-xs font-bold text-brand-600 mt-auto">{item.metric}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Video qidirish..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition"
          />
        </div>

        {/* Client filter */}
        <select value={filterClient} onChange={e => setFilterClient(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 font-medium text-gray-700">
          <option value="all">Barcha mijozlar</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name.split(' ')[0]}</option>)}
        </select>

        {/* Platform filter */}
        <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 font-medium text-gray-700">
          <option value="all">Barcha platformalar</option>
          <option value="instagram">📸 Instagram</option>
          <option value="youtube">▶️ YouTube</option>
          <option value="telegram">✈️ Telegram</option>
        </select>

        {/* Status filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 font-medium text-gray-700">
          <option value="all">Barcha statuslar</option>
          <option value="idea">G'oya</option>
          <option value="script">Script</option>
          <option value="shooting">Yozuv</option>
          <option value="editing">Montaj</option>
          <option value="ready">Tayyor</option>
          <option value="published">Chiqarildi</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200 font-medium text-gray-700">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 ml-auto">
          <button onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-800">{items.length}</span> ta video topildi
        </p>
        <button
          onClick={() => exportVideosCSV(items, clients)}
          className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={14} /> CSV yuklab olish
        </button>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Hech narsa topilmadi</p>
          <p className="text-gray-400 text-sm">Filtrlarni o'zgartiring yoki qidiruvni tozalang</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <VideoCard
              key={item.id}
              item={item}
              client={clients.find(c => c.id === item.clientId)}
            />
          ))}
        </div>
      ) : (
        <div className="card p-3 space-y-2">
          {/* List header */}
          <div className="hidden sm:flex items-center gap-3 px-3 pb-2 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <div className="w-8" />
            <div className="flex-1">Video</div>
            <div className="flex gap-6">
              <span className="w-16 text-center">Ko'rish</span>
              <span className="w-12 text-center">Like</span>
              <span className="w-12 text-center">Save</span>
              <span className="w-14 text-center">Eng.</span>
              <span className="w-24 text-center">Sana</span>
            </div>
          </div>
          {items.map(item => (
            <VideoRow
              key={item.id}
              item={item}
              client={clients.find(c => c.id === item.clientId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
