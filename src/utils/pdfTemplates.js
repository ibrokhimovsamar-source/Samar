// ============================================================
// BRANDFLOW — PDF HTML Shablonlari
// ============================================================

const BASE_STYLES = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           color: #111; background: #fff; padding: 32px; font-size: 13px; }
    h1 { font-size: 22px; font-weight: 800; color: #1a1a2e; }
    h2 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
    h3 { font-size: 13px; font-weight: 700; color: #374151; }
    .header { display:flex; justify-content:space-between; align-items:flex-start;
              border-bottom: 2px solid #4f6ef7; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { display:flex; align-items:center; gap:10px; }
    .logo-icon { width:36px;height:36px;background:#4f6ef7;border-radius:10px;
                 display:flex;align-items:center;justify-content:center;
                 color:#fff;font-weight:800;font-size:16px; }
    .meta { text-align:right; color:#6b7280; font-size:11px; }
    .section { margin-bottom: 24px; }
    .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
    .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .card { background:#f8faff; border:1px solid #e0e9ff; border-radius:10px; padding:14px; }
    .card-blue { background:#eff4ff; border-color:#c7d7fd; }
    .stat-val { font-size:20px; font-weight:800; color:#4f6ef7; }
    .stat-label { font-size:11px; color:#6b7280; margin-top:2px; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    th { background:#f1f5fe; color:#374151; font-weight:700; text-align:left;
         padding:8px 10px; border-bottom:2px solid #dde6ff; font-size:11px; text-transform:uppercase; }
    td { padding:8px 10px; border-bottom:1px solid #f0f4ff; vertical-align:top; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:#f8faff; }
    .badge { display:inline-flex; align-items:center; gap:4px;
             padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; }
    .badge-green  { background:#dcfce7; color:#16a34a; }
    .badge-blue   { background:#dbeafe; color:#1d4ed8; }
    .badge-orange { background:#ffedd5; color:#c2410c; }
    .badge-gray   { background:#f3f4f6; color:#6b7280; }
    .badge-yellow { background:#fef9c3; color:#a16207; }
    .badge-purple { background:#f3e8ff; color:#7c3aed; }
    .progress-wrap { background:#e5e7eb; border-radius:4px; height:6px; margin-top:6px; }
    .progress-bar  { height:6px; border-radius:4px; background:#4f6ef7; }
    .text-muted { color:#6b7280; }
    .text-sm { font-size:11px; }
    .mb-1 { margin-bottom:4px; }
    .mb-2 { margin-bottom:8px; }
    .divider { border:none; border-top:1px solid #e5e7eb; margin:16px 0; }
    .platform-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; }
    .platform-chip { background:#fff; border:1px solid #e5e7eb; border-radius:8px;
                     padding:6px 10px; font-size:11px; text-align:center; min-width:80px; }
    .platform-chip strong { display:block; font-size:14px; color:#111; }
    .pillar-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
    .pillar-bar-wrap { flex:1; background:#e5e7eb; border-radius:4px; height:6px; }
    @media print {
      body { padding: 16px; }
      @page { margin: 1cm; }
    }
  </style>
`

// ── Umumiy hisobot ────────────────────────────────────────────
export function buildDashboardPDF({ clients, contentItems, overallStats, analyticsData }) {
  const today = new Date().toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' })
  const published = contentItems.filter(v => v.status === 'published')
  const totalViews = published.reduce((s,v) => s+v.views, 0)
  const totalLikes = published.reduce((s,v) => s+v.likes, 0)
  const totalSaves = published.reduce((s,v) => s+v.saves, 0)

  const topVideos = [...published].sort((a,b) => b.views - a.views).slice(0, 5)

  const statusMap = {
    published: ['Chiqarildi','badge-green'],
    editing:   ['Montaj','badge-orange'],
    ready:     ['Tayyor','badge-blue'],
    shooting:  ['Yozuv','badge-yellow'],
    script:    ['Script','badge-blue'],
    idea:      ["G'oya",'badge-gray'],
  }

  const topRows = topVideos.map(v => {
    const client = clients.find(c => c.id === v.clientId)
    const eng = v.views > 0 ? (((v.likes+v.comments+v.saves)/v.views)*100).toFixed(1) : '0'
    const [label, cls] = statusMap[v.status] || ['—','badge-gray']
    const plIcons = { instagram:'📸', youtube:'▶️', telegram:'✈️' }
    return `
      <tr>
        <td><strong>${v.title}</strong><br><span class="text-muted text-sm">${client?.name ?? ''}</span></td>
        <td>${plIcons[v.platform] ?? ''} ${v.platform}</td>
        <td><strong>${v.views.toLocaleString()}</strong></td>
        <td>${v.likes.toLocaleString()}</td>
        <td>${v.saves.toLocaleString()}</td>
        <td><strong>${eng}%</strong></td>
        <td><span class="badge ${cls}">${label}</span></td>
      </tr>`
  }).join('')

  const clientRows = clients.map(c => {
    const igF = c.stats.instagram?.followers ?? 0
    const ytS = c.stats.youtube?.subscribers ?? 0
    const tgM = c.stats.telegram?.members ?? 0
    const total = igF + ytS + tgM
    const cVideos = contentItems.filter(v => v.clientId === c.id)
    const cPub = cVideos.filter(v => v.status === 'published')
    const cViews = cPub.reduce((s,v) => s+v.views, 0)
    return `
      <tr>
        <td><strong>${c.name}</strong><br><span class="text-muted text-sm">${c.niche}</span></td>
        <td>${c.type === 'self' ? "O'zim" : 'Mijoz'}</td>
        <td>📸 ${igF.toLocaleString()}</td>
        <td>▶️ ${ytS.toLocaleString()}</td>
        <td>✈️ ${tgM.toLocaleString()}</td>
        <td><strong>${total.toLocaleString()}</strong></td>
        <td>${cPub.length} / ${cVideos.length}</td>
        <td><strong>${cViews.toLocaleString()}</strong></td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8">
    <title>BrandFlow — Umumiy Hisobot</title>${BASE_STYLES}</head><body>
    <div class="header">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <div><h1>BrandFlow</h1><p class="text-muted text-sm">Kontent Boshqaruv Tizimi</p></div>
      </div>
      <div class="meta"><strong>Umumiy Hisobot</strong><br>${today}<br>
        <span class="badge badge-green">Aktiv</span></div>
    </div>

    <div class="section">
      <h2>📊 Asosiy Ko'rsatkichlar</h2>
      <div class="grid-4">
        <div class="card card-blue">
          <div class="stat-val">${totalViews.toLocaleString()}</div>
          <div class="stat-label">Jami Ko'rishlar</div>
        </div>
        <div class="card card-blue">
          <div class="stat-val">${clients.reduce((s,c) =>
            s + (c.stats.instagram?.followers||0) +
            (c.stats.youtube?.subscribers||0) +
            (c.stats.telegram?.members||0), 0).toLocaleString()}</div>
          <div class="stat-label">Jami Followers</div>
        </div>
        <div class="card card-blue">
          <div class="stat-val">${totalLikes.toLocaleString()}</div>
          <div class="stat-label">Jami Likes</div>
        </div>
        <div class="card card-blue">
          <div class="stat-val">${totalSaves.toLocaleString()}</div>
          <div class="stat-label">Jami Saves</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>👥 Mijozlar Holati</h2>
      <table>
        <thead><tr>
          <th>Ism / Soha</th><th>Tur</th><th>Instagram</th>
          <th>YouTube</th><th>Telegram</th><th>Jami</th>
          <th>Video (chiq/jami)</th><th>Ko'rishlar</th>
        </tr></thead>
        <tbody>${clientRows}</tbody>
      </table>
    </div>

    <div class="section">
      <h2>🏆 Top 5 Video</h2>
      <table>
        <thead><tr>
          <th>Sarlavha / Mijoz</th><th>Platforma</th><th>Ko'rishlar</th>
          <th>Likes</th><th>Saves</th><th>Engagement</th><th>Status</th>
        </tr></thead>
        <tbody>${topRows}</tbody>
      </table>
    </div>

    <div class="section">
      <h2>📅 Kontent Pipeline</h2>
      <div class="grid-3">
        ${['idea','script','shooting','editing','ready','published'].map(s => {
          const count = contentItems.filter(v => v.status === s).length
          const labels = { idea:"G'oya", script:'Script', shooting:'Yozuv',
                           editing:'Montaj', ready:'Tayyor', published:'Chiqarildi' }
          const colors = { idea:'#9ca3af', script:'#60a5fa', shooting:'#fbbf24',
                           editing:'#fb923c', ready:'#4ade80', published:'#4f6ef7' }
          return `<div class="card" style="text-align:center">
            <div style="font-size:22px;font-weight:800;color:${colors[s]}">${count}</div>
            <div class="stat-label">${labels[s]}</div>
          </div>`
        }).join('')}
      </div>
    </div>

    <p class="text-muted text-sm" style="margin-top:32px;text-align:center">
      BrandFlow hisoboti • ${today} • Maxfiy ma'lumot
    </p>
  </body></html>`
}

// ── Mijoz hisoboti ────────────────────────────────────────────
export function buildClientPDF({ client, contentItems, strategy }) {
  const today = new Date().toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' })
  const videos = contentItems.filter(v => v.clientId === client.id)
  const published = videos.filter(v => v.status === 'published')
  const totalViews = published.reduce((s,v) => s+v.views, 0)
  const totalLikes = published.reduce((s,v) => s+v.likes, 0)
  const totalSaves = published.reduce((s,v) => s+v.saves, 0)

  const statusMap = {
    published: ['Chiqarildi','badge-green'],
    editing:   ['Montaj','badge-orange'],
    ready:     ['Tayyor','badge-blue'],
    shooting:  ['Yozuv','badge-yellow'],
    script:    ['Script','badge-blue'],
    idea:      ["G'oya",'badge-gray'],
  }
  const plIcons = { instagram:'📸', youtube:'▶️', telegram:'✈️' }

  const videoRows = videos.map(v => {
    const [label, cls] = statusMap[v.status] || ['—','badge-gray']
    const eng = v.views > 0 ? (((v.likes+v.comments+v.saves)/v.views)*100).toFixed(1) : '—'
    return `<tr>
      <td><strong>${v.title}</strong>${v.hook ? `<br><em class="text-muted text-sm">"${v.hook}"</em>` : ''}</td>
      <td>${plIcons[v.platform]??''} ${v.platform}</td>
      <td><span class="badge ${cls}">${label}</span></td>
      <td>${v.deadline ?? '—'}</td>
      <td>${v.views > 0 ? v.views.toLocaleString() : '—'}</td>
      <td>${v.likes > 0 ? v.likes.toLocaleString() : '—'}</td>
      <td>${v.saves > 0 ? v.saves.toLocaleString() : '—'}</td>
      <td>${v.views > 0 ? eng+'%' : '—'}</td>
    </tr>`
  }).join('')

  const goalRows = strategy?.goals?.map(g => {
    const pct = Math.min(100, Math.round((g.current / g.total) * 100))
    return `<tr>
      <td>${g.target}</td>
      <td>${g.current.toLocaleString()} / ${g.total.toLocaleString()}</td>
      <td>
        <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
        <span class="text-sm">${pct}%</span>
      </td>
    </tr>`
  }).join('') ?? ''

  const pillarRows = strategy?.contentPillars?.map(p => {
    const colors = ['#4f6ef7','#a855f7','#22c55e','#f59e0b','#ef4444']
    const idx = strategy.contentPillars.indexOf(p)
    const c = colors[idx % colors.length]
    return `<div class="pillar-row">
      <span style="width:140px;font-size:12px">${p.name}</span>
      <div class="pillar-bar-wrap">
        <div class="progress-bar" style="width:${p.percent}%;background:${c}"></div>
      </div>
      <span class="text-sm" style="width:32px;text-align:right"><strong>${p.percent}%</strong></span>
    </div>`
  }).join('') ?? ''

  const igS = client.stats.instagram
  const ytS = client.stats.youtube
  const tgS = client.stats.telegram

  return `<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8">
    <title>${client.name} — BrandFlow Hisobot</title>${BASE_STYLES}</head><body>
    <div class="header">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <div><h1>BrandFlow</h1><p class="text-muted text-sm">Mijoz Hisoboti</p></div>
      </div>
      <div class="meta"><strong>${client.name}</strong><br>${today}<br>
        <span class="badge badge-green">Aktiv</span></div>
    </div>

    <div class="section">
      <div class="grid-2">
        <div class="card">
          <h3 style="margin-bottom:8px">👤 Profil</h3>
          <p><strong>Ism:</strong> ${client.name}</p>
          <p><strong>Soha:</strong> ${client.niche}</p>
          <p><strong>Maqsad:</strong> ${client.goal}</p>
          <p><strong>Boshlanish:</strong> ${client.startDate}</p>
          ${client.phone ? `<p><strong>Tel:</strong> ${client.phone}</p>` : ''}
          ${client.email ? `<p><strong>Email:</strong> ${client.email}</p>` : ''}
        </div>
        <div class="card">
          <h3 style="margin-bottom:8px">🎯 Pozitsiya</h3>
          <p style="font-style:italic;color:#4f6ef7">"${client.positioning}"</p>
          <hr class="divider">
          <h3 style="margin-bottom:4px">👥 Target Auditoriya</h3>
          <p>${client.targetAudience}</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>📊 Asosiy Natijalar</h2>
      <div class="grid-4">
        <div class="card card-blue"><div class="stat-val">${totalViews.toLocaleString()}</div><div class="stat-label">Jami Ko'rishlar</div></div>
        <div class="card card-blue"><div class="stat-val">${totalLikes.toLocaleString()}</div><div class="stat-label">Jami Likes</div></div>
        <div class="card card-blue"><div class="stat-val">${totalSaves.toLocaleString()}</div><div class="stat-label">Jami Saves</div></div>
        <div class="card card-blue"><div class="stat-val">${videos.length}</div><div class="stat-label">Jami Videolar</div></div>
      </div>
    </div>

    <div class="section">
      <h2>📱 Platforma Statistikasi</h2>
      <div class="platform-row">
        ${client.platforms.map(pl => {
          const s = client.stats[pl]
          const val = s?.followers ?? s?.subscribers ?? s?.members ?? 0
          const growth = s?.growth ?? '+0%'
          const eng = s?.engagement ?? s?.reach ?? '—'
          return `<div class="platform-chip">
            <span style="font-size:18px">${plIcons[pl]}</span>
            <strong>${val.toLocaleString()}</strong>
            <span class="text-muted text-sm">${growth}</span>
            <span class="text-muted text-sm">${eng}</span>
          </div>`
        }).join('')}
      </div>
    </div>

    ${strategy ? `
    <div class="section">
      <div class="grid-2">
        <div>
          <h2>🎯 Strategiya Maqsadlari — ${strategy.period}</h2>
          <table>
            <thead><tr><th>Maqsad</th><th>Holat</th><th>Progress</th></tr></thead>
            <tbody>${goalRows}</tbody>
          </table>
        </div>
        <div>
          <h2>📌 Content Pillars</h2>
          <div style="margin-top:8px">${pillarRows}</div>
          ${strategy.notes ? `<div class="card" style="margin-top:12px">
            <p class="text-sm text-muted"><strong>Eslatma:</strong> ${strategy.notes}</p>
          </div>` : ''}
        </div>
      </div>
    </div>` : ''}

    <div class="section">
      <h2>🎬 Kontent Ro'yxati (${videos.length} ta video)</h2>
      <table>
        <thead><tr>
          <th>Sarlavha / Hook</th><th>Platforma</th><th>Status</th>
          <th>Deadline</th><th>Ko'rish</th><th>Like</th><th>Save</th><th>Eng.</th>
        </tr></thead>
        <tbody>${videoRows}</tbody>
      </table>
    </div>

    <p class="text-muted text-sm" style="margin-top:32px;text-align:center">
      BrandFlow • ${client.name} hisoboti • ${today} • Maxfiy ma'lumot
    </p>
  </body></html>`
}
