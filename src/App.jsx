import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Calendar from './pages/Calendar'
import Library from './pages/Library'
import Strategy from './pages/Strategy'
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="library" element={<Library />} />
          <Route path="strategy" element={<Strategy />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
