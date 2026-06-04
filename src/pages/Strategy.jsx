import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Target, CheckCircle2, Clock, TrendingUp,
  Edit3, Plus, Lightbulb, Users, BarChart2,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { strategies } from '../data/mockData'

// Progress bar komponenti
function ProgressBar({ current, total, color = 'bg-brand-500' }) {
  const pct = Math.min(100, Math.round((current / total) * 100))
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// Haftalik jadval
function WeeklySchedule({ plan, clientColor }) {
  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
  const platformSchedules = {
    instagram: [1, 3, 5],   // Du, Ch, Ju
    youtube:   [3],          // Ch
    telegram:  [0, 1, 2, 3, 4], // har kuni
  }

  const platformColors = {
    instagram: 'bg-pink-400',
    youtube:   'bg-red-400',
    telegram:  'bg-blue-400',
  }
  const platformIcons = {
    instagram: '📸',
    youtube:   '▶️',
    telegram:  '✈️',
  }

  return (
    <div className="space-y-3">
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          const dayPlatforms = Object.entries(plan)
            .filter(([pl]) => platformSchedules[pl]?.includes(i))
            .map(([pl]) => pl)
          return (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-400 mb-1.5 font-medium">{day}</p>
              <div className={`rounded-xl p-1.5 min-h-14 flex flex-col items-center gap-1
                ${dayPlatforms.length > 0 ? 'bg-gray-50 border border-gray-200' : 'bg-gray-50/50'}`}>
                {dayPlatforms.length > 0 ? (
                  dayPlatforms.map(pl => (
                    <span key={pl} className="text-sm leading-none">{platformIcons[pl]}</span>
                  ))
                ) : (
                  <span className="text-gray-200 text-xs mt-1">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Platform totals */}
      <div className="flex items-center gap-3 pt-1">
        {Object.entries(plan).map(([pl, count]) => (
          <div key={pl} className="flex items-center gap-1.5 text-sm">
            <span>{platformIcons[pl]}</span>
            <span className="text-gray-600">
              <span className="font-bold text-gray-900">{count}</span> ta/hafta
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Strategiya kartasi
function StrategyCard({ strategy, client }) {
  const [expanded, setExpanded] = useState(true)
  const isActive = client?.type === 'self'

  // Content pillar pie data
  const pieData = strategy.contentPillars.map(p => ({
    name: p.name,
    value: p.percent,
  }))
  const pieColors = ['#4f6ef7', '#a855f7', '#22c55e', '#f59e0b', '#ef4444']

  return (
    <div className={`card border-2 ${isActive ? 'border-brand-200' : 'border-transparent'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${client?.avatarColor} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
            {client?.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{client?.name}</h3>
              {client?.type === 'self' && (
                <span className="badge bg-brand-100 text-brand-600">Men</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{strategy.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {strategy.period}
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition">
            <Edit3 size={14} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Phase */}
      <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
        <Lightbulb size={16} className="text-amber-500 flex-shrink-0" />
        <div>
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Joriy Faza</p>
          <p className="text-sm font-bold text-amber-800">{strategy.phase}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Content Pillars pie */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart2 size={15} className="text-brand-500" />
            Content Pillars
          </h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [`${v}%`, name]}
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {strategy.contentPillars.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: pieColors[i % pieColors.length] }} />
                <span className="text-xs text-gray-600 flex-1 truncate">{p.name}</span>
                <span className="text-xs font-bold text-gray-800">{p.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Haftalik jadval */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={15} className="text-purple-500" />
            Haftalik Jadval
          </h4>
          <WeeklySchedule plan={strategy.weeklyPlan} clientColor={client?.avatarColor} />
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500">
              Jami oyiga:{' '}
              <span className="font-bold text-gray-800">
                {Object.values(strategy.weeklyPlan).reduce((s, v) => s + v * 4, 0)} ta video
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="mb-5">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target size={15} className="text-green-500" />
          Maqsadlar
        </h4>
        <div className="space-y-3">
          {strategy.goals.map((goal, i) => {
            const pct = Math.min(100, Math.round((goal.current / goal.total) * 100))
            const colors = ['bg-brand-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-400']
            return (
              <div key={i} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {pct >= 100
                      ? <CheckCircle2 size={14} className="text-green-500" />
                      : <div className={`w-3.5 h-3.5 rounded-full border-2 ${colors[i % colors.length].replace('bg-', 'border-')}`} />
                    }
                    <span className="text-sm font-medium text-gray-700">{goal.target}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">
                      {goal.current.toLocaleString()} / {goal.total.toLocaleString()}
                    </span>
                    <span className={`font-bold px-1.5 py-0.5 rounded-md
                      ${pct >= 100 ? 'bg-green-100 text-green-700'
                        : pct >= 60 ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <ProgressBar current={goal.current} total={goal.total} color={colors[i % colors.length]} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      {strategy.notes && (
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            💬 Strategiya Eslatmasi
          </p>
          <p className="text-sm text-blue-800">{strategy.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function Strategy() {
  const { clients } = useApp()
  const [activeClient, setActiveClient] = useState('all')

  const filtered = activeClient === 'all'
    ? strategies
    : strategies.filter(s => s.clientId === Number(activeClient))

  // Umumiy maqsad progressi
  const allGoals = strategies.flatMap(s => s.goals)
  const avgProgress = Math.round(
    allGoals.reduce((sum, g) => sum + Math.min(100, (g.current / g.total) * 100), 0) / allGoals.length
  )

  const totalWeeklyVideos = strategies.reduce((sum, s) =>
    sum + Object.values(s.weeklyPlan).reduce((a, b) => a + b, 0), 0
  )

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: Target,
            iconBg: 'bg-brand-500',
            label: 'Faol Strategiya',
            value: strategies.length,
            sub: 'Q2 2024',
          },
          {
            icon: TrendingUp,
            iconBg: 'bg-green-500',
            label: 'O\'rtacha Progress',
            value: `${avgProgress}%`,
            sub: 'Barcha maqsadlar',
          },
          {
            icon: Clock,
            iconBg: 'bg-purple-500',
            label: 'Haftalik Video',
            value: totalWeeklyVideos,
            sub: '2 ta profil jami',
          },
          {
            icon: Users,
            iconBg: 'bg-orange-400',
            label: 'Faol Mijozlar',
            value: clients.filter(c => c.status === 'active').length,
            sub: 'Barcha aktiv',
          },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center`}>
              <s.icon size={16} className="text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900 mt-2">{s.value}</p>
            <p className="text-xs font-medium text-gray-600">{s.label}</p>
            {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Filter + action */}
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => setActiveClient('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${activeClient === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Hammasi
          </button>
          {clients.map(c => (
            <button key={c.id} onClick={() => setActiveClient(String(c.id))}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${activeClient === String(c.id) ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm ml-auto">
          <Plus size={15} /> Yangi Strategiya
        </button>
      </div>

      {/* Strategy cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            client={clients.find(c => c.id === strategy.clientId)}
          />
        ))}
      </div>

      {/* Overall progress summary */}
      <div className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white border-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg">Umumiy Progress</h4>
            <p className="text-brand-200 text-sm">Q2 2024 — Barcha maqsadlar</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{avgProgress}%</p>
            <p className="text-brand-200 text-sm">bajarildi</p>
          </div>
        </div>

        {/* Big progress bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-4">
          <div
            className="h-3 bg-white rounded-full transition-all duration-700"
            style={{ width: `${avgProgress}%` }}
          />
        </div>

        {/* All goals mini */}
        <div className="grid grid-cols-2 gap-3">
          {allGoals.map((goal, i) => {
            const pct = Math.min(100, Math.round((goal.current / goal.total) * 100))
            return (
              <div key={i} className="flex items-center gap-2">
                {pct >= 100
                  ? <CheckCircle2 size={14} className="text-green-300 flex-shrink-0" />
                  : <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 flex-shrink-0" />
                }
                <span className="text-xs text-white/80 truncate flex-1">{goal.target}</span>
                <span className="text-xs font-bold text-white">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
