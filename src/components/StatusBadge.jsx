import { contentStatuses } from '../data/mockData'

export default function StatusBadge({ status }) {
  const s = contentStatuses[status] || contentStatuses.idea
  return (
    <span className={`badge ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
