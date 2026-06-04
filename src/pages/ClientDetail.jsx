import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Target, Calendar,
  Edit3, Video, Eye, Heart, Bookmark,
  CheckCircle2, Clock, Download, Users,
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { strategies } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import PlatformBadge from '../components/PlatformBadge'
import { printHTML } from '../utils/exportUtils'
import { buildClientPDF } from '../utils/pdfTemplates'

const platformIcons = { instagram: '📸', youtube: '▶️', telegram: '✈️' }

export default function ClientDetail() {
  const { id } = useParams()
  const { clients, contentItems } = useApp()
  const client = clients.find((c) => c.id === Number(id))

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Mijoz topilmadi</p>
        <Link to="/clients" className="btn-secondary flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Orqaga
        </Link>
      </div>
    )
  }

  const videos = contentItems.filter((v) => v.clientId === client.id)
  const published = videos.filter((v) => v.status === 'published')
  const pending = videos.filter((v) => v.status !== 'published')
  const strategy = strategies.find((s) => s.clientId === client.id)

  const handleExportPDF = () => {
    const html = buildClientPDF({ client, contentItems, strategy })
    printHTML(html, `${client.name} — BrandFlow Hisobot`)
  }

  const totalViews = published.reduce((s, v) => s + v.views, 0)
  const totalLikes = published.reduce((s, v) => s + v.likes, 0)
  const totalSaves = published.reduce((s, v) => s + v.saves, 0)

  // Platform performance bar chart
  const platformPerf = client.platforms.map((pl) => {
    const s = client.stats[pl]
    const plVideos = published.filter((v) => v.platform === pl)
    return {
      name: pl === 'instagram' ? 'IG' : pl === 'youtube' ? 'YT' : 'TG',
      views: plVideos.reduce((sum, v) => sum + v.views, 0),
      followers: s.followers || s.subscribers || s.members || 0,
    }
  })

  // Radar: content score
  const radarData = [
    { subject: 'Hook', value: 85 },
    { subject: 'Engage', value: 72 },
    { subject: 'Saves', value: 90 },
    { subject: 'Growth', value: 68 },
    { subject: 'Consistency', value: 75 },
    { subject: 'CTA', value: 60 },
  ]

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link to="/clients" className="mt-1 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition flex-shrink-0">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 ${client.avatarColor} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow`}>
              {client.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
                {client.type === 'self' && (
                  <span className="badge bg-brand-100 text-brand-600">Men</span>
                )}
                <span className="badge bg-green-100 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Aktiv
                </span>
              </div>
              <p className="text-gray-500">{client.niche}</p>
            </div>
          </div>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Edit3 size={14} /> Tahrirlash
        </button>
        <button onClick={handleExportPDF}
          className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={14} /> PDF
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Eye,          iconBg: 'bg-brand-500',  label: 'Jami Ko\'rishlar', value: totalViews.toLocaleString() },
          { icon: Heart,        iconBg: 'bg-pink-500',   label: 'Jami Likes',      value: totalLikes.toLocaleString() },
          { icon: Bookmark,     iconBg: 'bg-yellow-400', label: 'Jami Saves',      value: totalSaves.toLocaleString() },
          { icon: Video,        iconBg: 'bg-green-500',  label: 'Jami Videolar',   value: videos.length },
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

      {/* Platforms */}
      <div className="card">
        <h4 className="font-bold text-gray-900 mb-4">Platforma Natijalari</h4>
        <div className="grid grid-cols-3 gap-4">
          {client.platforms.map((pl) => {
            const s = client.stats[pl]
            const val = s.followers || s.subscribers || s.members
            const plVideos = published.filter((v) => v.platform === pl)
            const plViews = plVideos.reduce((sum, v) => sum + v.views, 0)
            return (
              <div key={pl} className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{platformIcons[pl]}</span>
                  <div>
                    <p className="font-bold text-gray-800 capitalize">{pl}</p>
                    <p className="text-xs text-green-500 font-semibold">{s.growth} bu oy</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Followers</span>
                    <span className="font-bold text-gray-800">{val?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Engagement</span>
                    <span className="font-bold text-gray-800">{s.engagement || s.reach || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ko'rishlar</span>
                    <span className="font-bold text-gray-800">{plViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Platform performance bar */}
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-4">Platforma bo'yicha Ko'rishlar</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformPerf} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip
                formatter={(v) => [v.toLocaleString(), 'Ko\'rishlar']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="views" fill={client.avatarColor.replace('bg-', '#').replace('-500','') || '#4f6ef7'}
                radius={[6, 6, 0, 0]}
                fill={client.id === 1 ? '#4f6ef7' : '#a855f7'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Content score radar */}
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-4">Kontent Sifat Ballari</h4>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Radar dataKey="value" stroke={client.id === 1 ? '#4f6ef7' : '#a855f7'}
                fill={client.id === 1 ? '#4f6ef7' : '#a855f7'} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategy goals */}
      {strategy && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Strategiya Maqsadlari — {strategy.period}</h4>
            <Link to="/strategy" className="text-xs text-brand-500 font-medium hover:underline">
              Batafsil →
            </Link>
          </div>
          <div className="space-y-3">
            {strategy.goals.map((goal, i) => {
              const pct = Math.min(100, Math.round((goal.current / goal.total) * 100))
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{goal.target}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {goal.current.toLocaleString()} / {goal.total.toLocaleString()}
                      </span>
                      <span className={`text-xs font-bold ${pct >= 100 ? 'text-green-600' : 'text-brand-600'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : client.id === 1 ? 'bg-brand-500' : 'bg-purple-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Kontent Ro'yxati</h4>
          <div className="flex gap-2">
            <span className="badge bg-green-100 text-green-700">{published.length} chiqarildi</span>
            <span className="badge bg-orange-100 text-orange-700">{pending.length} kutayotgan</span>
          </div>
        </div>
        <div className="space-y-2">
          {videos.map((video) => (
            <div key={video.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{video.title}</p>
                {video.hook && (
                  <p className="text-xs text-gray-400 italic truncate mt-0.5">"{video.hook}"</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={video.status} />
                  <PlatformBadge platform={video.platform} />
                  <span className="text-xs text-gray-400">{video.deadline}</span>
                </div>
              </div>
              {video.views > 0 && (
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    {video.views >= 1000 ? `${(video.views/1000).toFixed(1)}k` : video.views}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-end mt-0.5">
                    <span>❤️ {video.likes}</span>
                    <span>🔖 {video.saves}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Positioning & Audience */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target size={16} className="text-brand-500" /> Pozitsiya
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-brand-50 p-3 rounded-xl border border-brand-100 italic">
            "{client.positioning}"
          </p>
        </div>
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users size={16} className="text-purple-500" /> Target Auditoriya
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed bg-purple-50 p-3 rounded-xl border border-purple-100">
            {client.targetAudience}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            Boshlangan: {new Date(client.startDate).toLocaleDateString('uz-UZ')}
          </div>
        </div>
      </div>
    </div>
  )
}
