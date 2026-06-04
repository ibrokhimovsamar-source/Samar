import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarDays, PlaySquare,
  Target, BarChart3, Zap, ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/clients',   icon: Users,           label: 'Mijozlar'        },
  { to: '/calendar',  icon: CalendarDays,    label: 'Kontent Kalendar'},
  { to: '/library',   icon: PlaySquare,      label: 'Video Kutubxona' },
  { to: '/strategy',  icon: Target,          label: 'Strategiya'      },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics'       },
]

export default function Sidebar() {
  const location = useLocation()
  const { clients } = useApp()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">BrandFlow</h1>
            <p className="text-xs text-gray-400 mt-0.5">Kontent Boshqaruv</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
          Asosiy
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {location.pathname === to && (
              <ChevronRight size={14} className="text-brand-400" />
            )}
          </NavLink>
        ))}

        {/* Mijozlar ro'yxati */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Profil & Mijozlar
          </p>
          {clients.map((client) => (
            <NavLink
              key={client.id}
              to={`/clients/${client.id}`}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <div
                className={`w-7 h-7 rounded-lg ${client.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {client.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate leading-none">
                  {client.name.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{client.niche.split(' ').slice(0, 2).join(' ')}</p>
              </div>
              {client.type === 'self' && (
                <span className="text-xs bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-md font-medium">
                  Men
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            ST
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate leading-none">Sardor T.</p>
            <p className="text-xs text-gray-400">Brend Mutaxassisi</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full" title="Online" />
        </div>
      </div>
    </aside>
  )
}
