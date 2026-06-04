import { Link } from 'react-router-dom'
import {
  Eye, Users, Video, Clock, TrendingUp,
  ArrowRight, Flame, Star, Download,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import PlatformBadge from '../components/PlatformBadge'
import { useApp } from '../context/AppContext'
import { analyticsData, platformStats, overallStats } from '../data/mockData'
import { printHTML } from '../utils/exportUtils'
import { buildDashboardPDF } from '../utils/pdfTemplates'

export default function Dashboard() {
  const { clients, contentItems } = useApp()

  // Kelayotgan deadline lar (published bo'lmaganlar)
  const upcoming = contentItems
    .filter((v) => v.status !== 'published')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4)

  // Top performing videos
  const topVideos = [...contentItems]
    .filter((v) => v.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)

  // Status bo'yicha hisoblash
  const statusCounts = contentItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})

  const COLORS = ['#E1306C', '#FF0000', '#0088cc']
  const kanbanCols = [
    { key: 'idea',      label: "G'oya",  color: 'bg-gray-400'   },
    { key: 'script',    label: 'Script', color: 'bg-blue-400'   },
    { key: 'shooting',  label: 'Yozuv',  color: 'bg-yellow-400' },
    { key: 'editing',   label: 'Montaj', color: 'bg-orange-400' },
    { key: 'ready',     label: 'Tayyor', color: 'bg-green-400'  },
    { key: 'published', label: 'Chiqdi', color: 'bg-brand-500'  },
  ]

  const handleExportPDF = () => {
    const html = buildDashboardPDF({ clients, contentItems, overallStats, analyticsData })
    printHTML(html, 'BrandFlow — Umumiy Hisobot')
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Xush kelibsiz, Sardor! 👋
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Bugun kontent rejangiz va natijalaringiz
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF}
            className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={14} /> PDF Hisobot
          </button>
          <Link to="/calendar" className="btn-primary flex items-center gap-2 text-sm">
            <Clock size={15} /> Reja qo'shish
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          iconBg="bg-brand-500"
          label="Jami Ko'rishlar"
          value={overallStats.totalViews.toLocaleString()}
          sub="Barcha platforma"
          trend="+18%"
          trendUp
        />
        <StatCard
          icon={Users}
          iconBg="bg-purple-500"
          label="Jami Followers"
          value={overallStats.totalFollowers.toLocaleString()}
          sub="2 ta profil"
          trend="+14%"
          trendUp
        />
        <StatCard
          icon={Video}
          iconBg="bg-green-500"
          label="Chiqarilgan Video"
          value={overallStats.publishedVideos}
          sub="Bu oy"
          trend="+2"
          trendUp
        />
        <StatCard
          icon={Clock}
          iconBg="bg-orange-400"
          label="Kutayotgan Kontent"
          value={overallStats.pendingContent}
          sub="Deadline yaqinlashmoqda"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Views Chart — 2/3 */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900">Ko'rishlar Dinamikasi</h4>
              <p className="text-xs text-gray-400">Oylik jami views</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-brand-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block" />
                Sardor
              </span>
              <span className="flex items-center gap-1 text-purple-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                Aziza
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sardor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aziza" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip
                formatter={(val, name) => [val.toLocaleString(), name === 'sardorViews' ? 'Sardor' : 'Aziza']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="sardorViews" stroke="#4f6ef7" strokeWidth={2}
                fill="url(#sardor)" dot={false} />
              <Area type="monotone" dataKey="azizaViews" stroke="#a855f7" strokeWidth={2}
                fill="url(#aziza)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform taqsimot — 1/3 */}
        <div className="card flex flex-col">
          <h4 className="font-bold text-gray-900 mb-1">Platforma Taqsimoti</h4>
          <p className="text-xs text-gray-400 mb-3">Ko'rishlar ulushi</p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={platformStats}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="totalViews"
                >
                  {platformStats.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(val) => <span className="text-xs text-gray-600">{val}</span>}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {platformStats.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{p.platform}</span>
                </div>
                <span className="font-semibold text-gray-800">{p.totalViews.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban mini progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Kontent Pipeline</h4>
          <Link to="/calendar" className="text-xs text-brand-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Hammasini ko'rish <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {kanbanCols.map((col) => (
            <div key={col.key} className="text-center">
              <div className={`w-8 h-8 ${col.color} rounded-xl mx-auto flex items-center justify-center text-white font-bold text-sm mb-1.5`}>
                {statusCounts[col.key] || 0}
              </div>
              <p className="text-xs text-gray-500 font-medium">{col.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Upcoming deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock size={14} className="text-orange-500" />
              </div>
              <h4 className="font-bold text-gray-900">Kelayotgan Deadlinelar</h4>
            </div>
            <Link to="/calendar" className="text-xs text-brand-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Barchasi <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((item) => {
              const client = clients.find((c) => c.id === item.clientId)
              const daysLeft = Math.ceil((new Date(item.deadline) - new Date()) / 86400000)
              return (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className={`w-8 h-8 ${client?.avatarColor || 'bg-gray-400'} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {client?.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={item.status} />
                      <PlatformBadge platform={item.platform} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-bold ${daysLeft <= 2 ? 'text-red-500' : daysLeft <= 5 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {daysLeft <= 0 ? 'Bugun!' : `${daysLeft} kun`}
                    </p>
                    <p className="text-xs text-gray-400">{item.deadline}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top videos */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Flame size={14} className="text-yellow-500" />
              </div>
              <h4 className="font-bold text-gray-900">Top Videolar</h4>
            </div>
            <Link to="/library" className="text-xs text-brand-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Kutubxona <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {topVideos.map((video, idx) => {
              const client = clients.find((c) => c.id === video.clientId)
              return (
                <div key={video.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                    ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{video.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PlatformBadge platform={video.platform} />
                      <span className="text-xs text-gray-400">{client?.name.split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800">
                      {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}k` : video.views}
                    </p>
                    <p className="text-xs text-gray-400">ko'rish</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clients quick view */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Mijozlar Holati</h4>
          <Link to="/clients" className="text-xs text-brand-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Barchasi <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {clients.map((client) => (
            <Link to={`/clients/${client.id}`} key={client.id}
              className="p-4 border border-gray-100 rounded-xl hover:border-brand-200 hover:bg-brand-50/30 transition group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${client.avatarColor} rounded-xl flex items-center justify-center text-white font-bold`}>
                  {client.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                  <p className="text-xs text-gray-400">{client.niche}</p>
                </div>
                {client.type === 'self' && (
                  <span className="ml-auto badge bg-brand-100 text-brand-600">Men</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {client.platforms.map((pl) => {
                  const stats = client.stats[pl]
                  const key = pl === 'youtube' ? 'subscribers' : 'followers' in stats ? 'followers' : 'members'
                  const val = stats[key] || stats.subscribers || stats.members || stats.followers
                  const icons = { instagram: '📸', youtube: '▶️', telegram: '✈️' }
                  return (
                    <div key={pl} className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-base">{icons[pl]}</p>
                      <p className="text-xs font-bold text-gray-800">{val?.toLocaleString()}</p>
                      <p className="text-xs text-green-500 font-medium">{stats.growth}</p>
                    </div>
                  )
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
