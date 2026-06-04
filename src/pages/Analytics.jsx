import { useState } from 'react'
import {
  TrendingUp, Eye, Users, Heart, Bookmark,
  Award, Zap, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { analyticsData, platformStats } from '../data/mockData'

// Engagement rate hisoblash
function engRate(item) {
  if (!item.views || item.views === 0) return 0
  return Number((((item.likes + item.comments + item.saves) / item.views) * 100).toFixed(2))
}

// Followers growth combined
const followersData = analyticsData.map(d => ({
  month: d.month,
  sardor: d.sardorFollowers,
  aziza: d.azizaFollowers,
  total: d.sardorFollowers + d.azizaFollowers,
}))

// Views + Followers combo
const comboData = analyticsData.map(d => ({
  month: d.month,
  views: d.sardorViews + d.azizaViews,
  sardor: d.sardorFollowers,
  aziza: d.azizaFollowers,
}))

const PLATFORM_COLORS = {
  instagram: '#E1306C',
  youtube:   '#FF0000',
  telegram:  '#0088cc',
}
const PIE_COLORS = ['#4f6ef7', '#a855f7', '#22c55e', '#f59e0b']

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-gray-800 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-bold text-gray-800">
            {typeof p.value === 'number' && p.value >= 1000
              ? `${(p.value / 1000).toFixed(1)}k`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { clients, contentItems } = useApp()
  const [activeClient, setActiveClient] = useState('all')

  // Computed from context
  const published = contentItems.filter(v => v.status === 'published')

  const platformBreakdown = ['instagram', 'youtube', 'telegram'].map(pl => {
    const items = published.filter(v => v.platform === pl)
    const views = items.reduce((s, v) => s + v.views, 0)
    const likes = items.reduce((s, v) => s + v.likes, 0)
    const saves = items.reduce((s, v) => s + v.saves, 0)
    const avgEng = items.length
      ? (items.reduce((s, v) => s + engRate(v), 0) / items.length).toFixed(1) : 0
    return { platform: pl, views, likes, saves, avgEng: Number(avgEng), count: items.length }
  })

  const typeBreakdown = ['reel', 'long-form', 'short', 'post'].map(type => {
    const items = published.filter(v => v.type === type)
    const avgViews = items.length ? Math.round(items.reduce((s,v) => s+v.views, 0) / items.length) : 0
    const avgSaves = items.length ? Math.round(items.reduce((s,v) => s+v.saves, 0) / items.length) : 0
    return {
      name: type === 'reel' ? 'Reel' : type === 'long-form' ? 'Long-form' : type === 'short' ? 'Short' : 'Post',
      avgViews, avgSaves, count: items.length,
    }
  })

  // Filtered views data
  const viewsData = analyticsData.map(d => {
    if (activeClient === '1') return { month: d.month, views: d.sardorViews }
    if (activeClient === '2') return { month: d.month, views: d.azizaViews }
    return { month: d.month, sardor: d.sardorViews, aziza: d.azizaViews, total: d.sardorViews + d.azizaViews }
  })

  // KPI cards
  const totalViews    = published.reduce((s, v) => s + v.views, 0)
  const totalLikes    = published.reduce((s, v) => s + v.likes, 0)
  const totalSaves    = published.reduce((s, v) => s + v.saves, 0)
  const totalComments = published.reduce((s, v) => s + v.comments, 0)
  const avgEngagement = published.length
    ? (published.reduce((s, v) => s + engRate(v), 0) / published.length).toFixed(1)
    : 0
  const totalFollowers = clients.reduce((s, c) => {
    return s + (c.stats.instagram?.followers || 0)
         + (c.stats.youtube?.subscribers || 0)
         + (c.stats.telegram?.members || 0)
  }, 0)

  const kpiCards = [
    { icon: Eye,      bg: 'bg-brand-500',  label: 'Jami Ko\'rishlar',  value: totalViews.toLocaleString(),    trend: '+18%', up: true  },
    { icon: Users,    bg: 'bg-purple-500', label: 'Jami Followers',    value: totalFollowers.toLocaleString(), trend: '+14%', up: true  },
    { icon: Heart,    bg: 'bg-pink-500',   label: 'Jami Likes',        value: totalLikes.toLocaleString(),    trend: '+22%', up: true  },
    { icon: Bookmark, bg: 'bg-yellow-400', label: 'Jami Saves',        value: totalSaves.toLocaleString(),    trend: '+35%', up: true  },
    { icon: Zap,      bg: 'bg-green-500',  label: 'Avg. Engagement',   value: `${avgEngagement}%`,            trend: '+1.2%',up: true  },
    { icon: Award,    bg: 'bg-orange-400', label: 'Chiqarilgan Video', value: published.length,               trend: '+2',   up: true  },
  ]

  return (
    <div className="space-y-6">
      {/* Client filter */}
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {[
            { key: 'all', label: 'Barcha' },
            { key: '1',   label: 'Sardor' },
            { key: '2',   label: 'Aziza'  },
          ].map(opt => (
            <button key={opt.key} onClick={() => setActiveClient(opt.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${activeClient === opt.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-2">Q2 2024 • Yanvar — Iyun</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((k, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between">
              <div className={`w-8 h-8 ${k.bg} rounded-xl flex items-center justify-center`}>
                <k.icon size={14} className="text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold
                ${k.up ? 'text-green-600' : 'text-red-500'}`}>
                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {k.trend}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-2">{k.value}</p>
            <p className="text-xs text-gray-500 leading-tight">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Views trend + Followers growth */}
      <div className="grid grid-cols-3 gap-5">
        {/* Views area chart — 2/3 */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900">Ko'rishlar Trendi</h4>
              <p className="text-xs text-gray-400">Oylik jami views dinamikasi</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            {activeClient !== 'all' ? (
              <AreaChart data={viewsData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeClient === '1' ? '#4f6ef7' : '#a855f7'} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={activeClient === '1' ? '#4f6ef7' : '#a855f7'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" name="Ko'rishlar"
                  stroke={activeClient === '1' ? '#4f6ef7' : '#a855f7'} strokeWidth={2.5}
                  fill="url(#gViews)" dot={{ r: 4, fill: activeClient === '1' ? '#4f6ef7' : '#a855f7' }} />
              </AreaChart>
            ) : (
              <AreaChart data={viewsData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span className="text-xs text-gray-600">{v}</span>} />
                <Area type="monotone" dataKey="sardor" name="Sardor"
                  stroke="#4f6ef7" strokeWidth={2} fill="url(#gS)" dot={false} />
                <Area type="monotone" dataKey="aziza" name="Aziza"
                  stroke="#a855f7" strokeWidth={2} fill="url(#gA)" dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Platform views pie — 1/3 */}
        <div className="card flex flex-col">
          <h4 className="font-bold text-gray-900 mb-1">Platforma Ulushi</h4>
          <p className="text-xs text-gray-400 mb-2">Ko'rishlar bo'yicha</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={platformStats} cx="50%" cy="50%"
                innerRadius={45} outerRadius={65}
                paddingAngle={3} dataKey="totalViews">
                {platformStats.map((_, i) => (
                  <Cell key={i} fill={Object.values(PLATFORM_COLORS)[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [v.toLocaleString(), name]}
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-auto">
            {platformStats.map((p, i) => {
              const total = platformStats.reduce((s, x) => s + x.totalViews, 0)
              const pct = Math.round((p.totalViews / total) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full"
                        style={{ background: Object.values(PLATFORM_COLORS)[i] }} />
                      {p.platform}
                    </span>
                    <span className="font-bold text-gray-800">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: Object.values(PLATFORM_COLORS)[i] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Followers growth + Content type */}
      <div className="grid grid-cols-2 gap-5">
        {/* Followers line chart */}
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-1">Followers O'sishi</h4>
          <p className="text-xs text-gray-400 mb-4">Oylik kumulyativ o'sish</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={followersData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span className="text-xs text-gray-600">{v}</span>} />
              <Line type="monotone" dataKey="sardor" name="Sardor"
                stroke="#4f6ef7" strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f6ef7', strokeWidth: 0 }}
                activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="aziza" name="Aziza"
                stroke="#a855f7" strokeWidth={2.5}
                dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }}
                activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content type performance */}
        <div className="card">
          <h4 className="font-bold text-gray-900 mb-1">Kontent Turi bo'yicha</h4>
          <p className="text-xs text-gray-400 mb-4">O'rtacha ko'rishlar va saves</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeBreakdown} margin={{ left: -15, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span className="text-xs text-gray-600">{v}</span>} />
              <Bar dataKey="avgViews" name="Avg. Ko'rish" fill="#4f6ef7" radius={[5, 5, 0, 0]} />
              <Bar dataKey="avgSaves" name="Avg. Save"   fill="#f59e0b" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform deep-dive table */}
      <div className="card">
        <h4 className="font-bold text-gray-900 mb-4">Platforma Tahlili</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Platforma', 'Videolar', 'Jami Ko\'rishlar', 'Jami Likes', 'Jami Saves', 'Avg. Engagement', 'Holat'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {platformBreakdown.map((row, i) => {
                const icons = { instagram: '📸', youtube: '▶️', telegram: '✈️' }
                const labels = { instagram: 'Instagram', youtube: 'YouTube', telegram: 'Telegram' }
                const isTop = i === platformBreakdown.sort((a,b) => b.views - a.views).indexOf(row)
                return (
                  <tr key={row.platform} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icons[row.platform]}</span>
                        <span className="font-semibold text-gray-800">{labels[row.platform]}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-700">{row.count}</td>
                    <td className="py-3 pr-4">
                      <span className="font-bold text-gray-900">
                        {row.views >= 1000 ? `${(row.views/1000).toFixed(1)}k` : row.views}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-pink-500">{row.likes.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-medium text-yellow-500">{row.saves.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-bold ${row.avgEng >= 5 ? 'text-green-600' : 'text-gray-700'}`}>
                        {row.avgEng}%
                      </span>
                    </td>
                    <td className="py-3">
                      {row.views === Math.max(...platformBreakdown.map(p => p.views)) ? (
                        <span className="badge bg-yellow-100 text-yellow-700">🏆 Top</span>
                      ) : row.avgEng === Math.max(...platformBreakdown.map(p => p.avgEng)) ? (
                        <span className="badge bg-green-100 text-green-700">🔥 Eng aktiv</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-500">O'sishda</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best content insights */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: '🏆 Eng Yaxshi Format',
            value: 'Instagram Reel',
            detail: 'O\'rtacha 28,000 ko\'rish, 6.2% engagement',
            color: 'bg-brand-50 border-brand-200',
            textColor: 'text-brand-700',
          },
          {
            title: '⚡ Eng Tez O\'suvchi',
            value: 'Telegram',
            detail: '+30% o\'sish, 72% reach — eng yuqori',
            color: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-700',
          },
          {
            title: '💡 Tavsiya',
            value: 'Reels × 2 hafta',
            detail: '1240 save pattern\'ni takrorlash — emotional hook',
            color: 'bg-amber-50 border-amber-200',
            textColor: 'text-amber-700',
          },
        ].map((ins, i) => (
          <div key={i} className={`card border ${ins.color}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{ins.title}</p>
            <p className={`text-lg font-bold ${ins.textColor} mb-1`}>{ins.value}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{ins.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
