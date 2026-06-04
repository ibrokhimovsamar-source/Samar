import { platforms } from '../data/mockData'

export default function PlatformBadge({ platform }) {
  const p = platforms[platform] || { label: platform, icon: '📱', color: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`badge ${p.color}`}>
      <span>{p.icon}</span>
      {p.label}
    </span>
  )
}
