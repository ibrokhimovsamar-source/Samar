// ============================================================
// BRANDFLOW — Export Utilities (pure JS, no external deps)
// ============================================================

// ── CSV EKSPORT ──────────────────────────────────────────────
/**
 * Massivdan CSV string hosil qiladi va yuklab oladi
 * @param {string[][]} rows  - [header, ...dataRows]
 * @param {string}     filename
 */
export function downloadCSV(rows, filename = 'export.csv') {
  const escape = (val) => {
    const s = String(val ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const csv = rows.map((row) => row.map(escape).join(',')).join('\n')
  const BOM = '\uFEFF' // Excel UTF-8 uchun
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename)
}

// ── PDF EKSPORT (print dialog) ───────────────────────────────
/**
 * HTML string ni yangi oynada ochib print dialog ko'rsatadi
 * @param {string} htmlContent  - to'liq HTML sahifa
 * @param {string} title
 */
export function printHTML(htmlContent, title = 'BrandFlow Hisobot') {
  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(htmlContent)
  win.document.title = title
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
  }, 600)
}

// ── Yordamchi ────────────────────────────────────────────────
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── VIDEOLAR CSV ─────────────────────────────────────────────
export function exportVideosCSV(contentItems, clients) {
  const header = [
    'Mijoz', 'Sarlavha', 'Hook', 'Platforma', 'Tur',
    'Status', 'Deadline', 'Chiqarilgan sana',
    'Ko\'rishlar', 'Likes', 'Izohlar', 'Saves', 'Engagement %', 'CTA', 'Izoh',
  ]
  const rows = contentItems.map((v) => {
    const client = clients.find((c) => c.id === v.clientId)
    const eng = v.views > 0
      ? (((v.likes + v.comments + v.saves) / v.views) * 100).toFixed(1)
      : '0'
    return [
      client?.name ?? '',
      v.title,
      v.hook,
      v.platform,
      v.type,
      v.status,
      v.deadline ?? '',
      v.publishDate ?? '',
      v.views,
      v.likes,
      v.comments,
      v.saves,
      eng,
      v.cta,
      v.notes,
    ]
  })
  const today = new Date().toISOString().split('T')[0]
  downloadCSV([header, ...rows], `brandflow-videolar-${today}.csv`)
}

// ── MIJOZLAR CSV ─────────────────────────────────────────────
export function exportClientsCSV(clients) {
  const header = [
    'Ism', 'Soha', 'Tur', 'Status', 'Maqsad',
    'IG Followers', 'YT Subscribers', 'TG Members',
    'Oylik videolar', 'Boshlanish sanasi', 'Telefon', 'Email',
  ]
  const rows = clients.map((c) => [
    c.name,
    c.niche,
    c.type === 'self' ? 'O\'zim' : 'Mijoz',
    c.status === 'active' ? 'Aktiv' : 'Pauza',
    c.goal,
    c.stats.instagram?.followers ?? 0,
    c.stats.youtube?.subscribers ?? 0,
    c.stats.telegram?.members ?? 0,
    c.monthlyVideos,
    c.startDate,
    c.phone ?? '',
    c.email ?? '',
  ])
  const today = new Date().toISOString().split('T')[0]
  downloadCSV([header, ...rows], `brandflow-mijozlar-${today}.csv`)
}
