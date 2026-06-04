import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Bell, Search } from 'lucide-react'

const pageTitles = {
  '/':          { title: 'Dashboard',        subtitle: 'Umumiy ko\'rinish va statistika' },
  '/clients':   { title: 'Mijozlar',         subtitle: 'Profil va mijozlar boshqaruvi'   },
  '/calendar':  { title: 'Kontent Kalendar', subtitle: 'Haftalik va oylik reja'          },
  '/library':   { title: 'Video Kutubxona',  subtitle: 'Barcha videolar va natijalar'    },
  '/strategy':  { title: 'Strategiya',       subtitle: 'Maqsad va content pillar'        },
  '/analytics': { title: 'Analytics',        subtitle: 'O\'sish va performance tahlili'  },
}

export default function Layout() {
  const location = useLocation()

  // client detail page
  const baseKey = Object.keys(pageTitles).find(
    (k) => k !== '/' && location.pathname.startsWith(k)
  ) || (location.pathname === '/' ? '/' : null)

  const page = pageTitles[baseKey] || { title: 'BrandFlow', subtitle: '' }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-none">{page.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{page.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition"
              />
            </div>

            {/* Notification */}
            <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-brand-600 transition">
              ST
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
