import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, ArrowRight, Target, X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp, AVATAR_COLORS } from '../context/AppContext'
import { exportClientsCSV } from '../utils/exportUtils'
import { Download } from 'lucide-react'

const platformIcons  = { instagram: '📸', youtube: '▶️', telegram: '✈️' }
const platformLabels = { instagram: 'Instagram', youtube: 'YouTube', telegram: 'Telegram' }
const ALL_PLATFORMS  = ['instagram', 'youtube', 'telegram']

// Har bir step uchun maydonlar validatsiyasi
const REQUIRED = {
  0: ['name', 'niche'],
  1: ['platforms', 'positioning', 'targetAudience'],
  2: ['goal'],
  3: [],
}

const STEPS = [
  { label: 'Asosiy', desc: 'Ism va soha'        },
  { label: 'Brend',  desc: 'Pozitsiya'           },
  { label: 'Maqsad', desc: 'KPI va reja'         },
  { label: 'Statistika', desc: 'Mavjud followers'},
]

const EMPTY_FORM = {
  name: '', niche: '', phone: '', email: '', notes: '',
  avatarColor: AVATAR_COLORS[1],
  platforms: ['instagram'],
  positioning: '', targetAudience: '',
  goal: '', monthlyVideos: '4',
  igFollowers: '', ytSubscribers: '', tgMembers: '',
}


// ── Step 0: Asosiy ma'lumotlar ────────────────────────────────
function Step0({ form, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="form-label">To'liq ism *</label>
          <input className="form-input" placeholder="Masalan: Aziz Karimov"
            value={form.name} onChange={e => onChange('name', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="form-label">Soha / Mutaxassislik *</label>
          <input className="form-input" placeholder="Masalan: Biznes Kouchu, Psixolog, Marketolog"
            value={form.niche} onChange={e => onChange('niche', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Telefon</label>
          <input className="form-input" placeholder="+998 90 123 45 67"
            value={form.phone} onChange={e => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="email@gmail.com"
            value={form.email} onChange={e => onChange('email', e.target.value)} />
        </div>
      </div>

      {/* Avatar rang tanlash */}
      <div>
        <label className="form-label">Avatar Rangi</label>
        <div className="flex gap-2 flex-wrap mt-1">
          {AVATAR_COLORS.map(color => (
            <button key={color} type="button"
              onClick={() => onChange('avatarColor', color)}
              className={`w-8 h-8 rounded-xl ${color} transition-all
                ${form.avatarColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
            />
          ))}
        </div>
        {/* Preview */}
        <div className="mt-3 flex items-center gap-3">
          <div className={`w-12 h-12 ${form.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
            {form.name ? form.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : 'AK'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{form.name || 'Ism Familiya'}</p>
            <p className="text-sm text-gray-400">{form.niche || 'Soha'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ── Step 1: Brend pozitsiya ───────────────────────────────────
function Step1({ form, onChange }) {
  const togglePlatform = (pl) => {
    const cur = form.platforms
    if (cur.includes(pl)) {
      if (cur.length === 1) return // kamida 1 ta
      onChange('platforms', cur.filter(p => p !== pl))
    } else {
      onChange('platforms', [...cur, pl])
    }
  }
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Platformalar *</label>
        <div className="flex gap-2 mt-1">
          {ALL_PLATFORMS.map(pl => (
            <button key={pl} type="button" onClick={() => togglePlatform(pl)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all
                ${form.platforms.includes(pl)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              <span>{platformIcons[pl]}</span>
              {platformLabels[pl]}
              {form.platforms.includes(pl) && <Check size={14} className="text-brand-500" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="form-label">Pozitsiya iborasi *</label>
        <input className="form-input"
          placeholder='Masalan: "O\'zbekistonda #1 ayollar biznesi kouchu"'
          value={form.positioning} onChange={e => onChange('positioning', e.target.value)} />
        <p className="text-xs text-gray-400 mt-1">Qisqa, kuchli, esda qoluvchi pozitsiya</p>
      </div>
      <div>
        <label className="form-label">Target auditoriya *</label>
        <textarea className="form-input resize-none" rows={3}
          placeholder="Masalan: 25-40 yoshli ayollar, kichik biznes egalari, onlayn kurs izlovchilar"
          value={form.targetAudience} onChange={e => onChange('targetAudience', e.target.value)} />
      </div>
      <div>
        <label className="form-label">Qo'shimcha izoh</label>
        <textarea className="form-input resize-none" rows={2}
          placeholder="Mijoz haqida muhim ma'lumot, xohishlar..."
          value={form.notes} onChange={e => onChange('notes', e.target.value)} />
      </div>
    </div>
  )
}

// ── Step 2: Maqsad va reja ────────────────────────────────────
function Step2({ form, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Asosiy maqsad *</label>
        <input className="form-input"
          placeholder='Masalan: "6 oy ichida 10,000 follower va 5 ta onlayn kurs savdosi"'
          value={form.goal} onChange={e => onChange('goal', e.target.value)} />
      </div>
      <div>
        <label className="form-label">Oylik video soni</label>
        <div className="flex items-center gap-3 mt-1">
          {[2,4,6,8,12,16].map(n => (
            <button key={n} type="button" onClick={() => onChange('monthlyVideos', String(n))}
              className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all
                ${form.monthlyVideos === String(n)
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-brand-200'}`}>
              {n}
            </button>
          ))}
          <span className="text-sm text-gray-400">ta/oy</span>
        </div>
      </div>
      {/* Visual goal display */}
      <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-2">Reja xulosasi</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Haftalik',Math.round(Number(form.monthlyVideos||4)/4),'ta video'],
            ['Oylik',form.monthlyVideos||4,'ta video'],
            ['Yillik',Number(form.monthlyVideos||4)*12,'ta video']
          ].map(([label,val,unit],i) => (
            <div key={i}>
              <p className="text-xl font-bold text-brand-600">{val}</p>
              <p className="text-xs text-brand-400">{label}</p>
              <p className="text-xs text-gray-400">{unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Mavjud statistika ─────────────────────────────────
function Step3({ form, onChange }) {
  const fields = [
    { pl:'instagram', icon:'📸', label:'Instagram Followers',   key:'igFollowers',    placeholder:'4200' },
    { pl:'youtube',   icon:'▶️', label:'YouTube Subscribers',   key:'ytSubscribers',  placeholder:'1850' },
    { pl:'telegram',  icon:'✈️', label:'Telegram Members',      key:'tgMembers',      placeholder:'2100' },
  ]
  const activeFields = fields.filter(f => form.platforms.includes(f.pl))
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Hozirgi followers sonini kiriting. Agar yo'q bo'lsa, 0 qoldiring.
      </p>
      {activeFields.map(f => (
        <div key={f.key}>
          <label className="form-label">{f.icon} {f.label}</label>
          <input className="form-input" type="number" min="0" placeholder={f.placeholder}
            value={form[f.key]} onChange={e => onChange(f.key, e.target.value)} />
        </div>
      ))}
      {/* Summary card */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Profil Ko'rinishi</p>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${form.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
            {form.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'AK'}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{form.name || '—'}</p>
            <p className="text-sm text-gray-500">{form.niche || '—'}</p>
          </div>
          <div className="flex gap-1.5">
            {form.platforms.map(pl => (
              <span key={pl} className="text-lg">{platformIcons[pl]}</span>
            ))}
          </div>
        </div>
        {form.positioning && (
          <p className="text-xs text-brand-600 italic mt-2 p-2 bg-brand-50 rounded-lg">
            "{form.positioning}"
          </p>
        )}
      </div>
    </div>
  )
}


// ── Modal ─────────────────────────────────────────────────────
function AddClientModal({ onClose, onSave }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const onChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const req = REQUIRED[step]
    const newErrors = {}
    req.forEach(key => {
      const val = form[key]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        newErrors[key] = 'Bu maydon majburiy'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const prev = () => setStep(s => s - 1)

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      onSave(form)
      setSaving(false)
      onClose()
    }, 400)
  }

  const stepComponents = [
    <Step0 form={form} onChange={onChange} errors={errors} />,
    <Step1 form={form} onChange={onChange} errors={errors} />,
    <Step2 form={form} onChange={onChange} errors={errors} />,
    <Step3 form={form} onChange={onChange} errors={errors} />,
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Yangi Mijoz Qo'shish</h3>
            <p className="text-xs text-gray-400">{STEPS[step].label} — {STEPS[step].desc}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                  ${i < step ? 'bg-brand-500 text-white'
                    : i === step ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                    : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-all ${i < step ? 'bg-brand-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5 mb-1">
            {STEPS.map((s, i) => (
              <span key={i} className={`text-xs font-medium ${i === step ? 'text-brand-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {stepComponents[step]}
          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-600 font-medium">
                ⚠️ Majburiy maydonlarni to'ldiring
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
          {step > 0
            ? <button onClick={prev}
                className="btn-secondary flex items-center gap-1.5 text-sm">
                <ChevronLeft size={15} /> Orqaga
              </button>
            : <button onClick={onClose} className="btn-secondary text-sm">Bekor qilish</button>
          }
          <div className="flex-1" />
          <span className="text-xs text-gray-400">{step + 1} / {STEPS.length}</span>
          {step < STEPS.length - 1
            ? <button onClick={next}
                className="btn-primary flex items-center gap-1.5 text-sm">
                Keyingi <ChevronRight size={15} />
              </button>
            : <button onClick={handleSave} disabled={saving}
                className={`btn-primary flex items-center gap-2 text-sm min-w-28 justify-center
                  ${saving ? 'opacity-70 cursor-wait' : ''}`}>
                {saving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : <Check size={15} />}
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}


// ── Helper: getClientStats ────────────────────────────────────
function getClientStats(clientId, contentItems) {
  const videos = contentItems.filter(v => v.clientId === clientId)
  const published = videos.filter(v => v.status === 'published')
  const pending = videos.filter(v => v.status !== 'published')
  const totalViews = published.reduce((s, v) => s + v.views, 0)
  return { total: videos.length, published: published.length, pending: pending.length, totalViews }
}

// ── Asosiy sahifa ─────────────────────────────────────────────
export default function Clients() {
  const { clients, contentItems, addClient } = useApp()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [successName, setSuccessName] = useState('')

  const handleSave = (formData) => {
    const newClient = addClient(formData)
    setSuccessName(newClient.name)
    setTimeout(() => setSuccessName(''), 3000)
    navigate(`/clients/${newClient.id}`)
  }

  return (
    <div className="space-y-6">
      {showModal && (
        <AddClientModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      {/* Success toast */}
      {successName && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white
          px-5 py-3 rounded-2xl shadow-xl animate-bounce-once">
          <Check size={18} />
          <span className="font-medium">{successName} muvaffaqiyatli qo'shildi!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Jami <span className="font-bold text-gray-800">{clients.length}</span> ta profil
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => exportClientsCSV(clients)}
            className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={14} /> CSV Eksport
          </button>
          <button onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Yangi mijoz
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clients.map(client => {
          const stats = getClientStats(client.id, contentItems)
          return (
            <div key={client.id} className="card hover:shadow-md transition-shadow group">
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${client.avatarColor} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                    {client.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{client.name}</h3>
                      {client.type === 'self' && (
                        <span className="badge bg-brand-100 text-brand-600">Men</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{client.niche}</p>
                  </div>
                </div>
                <span className={`badge ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {client.status === 'active' ? 'Aktiv' : 'Pauza'}
                </span>
              </div>

              {/* Positioning */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Pozitsiya</p>
                <p className="text-sm text-gray-700 font-medium">"{client.positioning}"</p>
              </div>

              {/* Platform stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {client.platforms.map(pl => {
                  const s = client.stats[pl]
                  const val = s?.followers ?? s?.subscribers ?? s?.members ?? 0
                  return (
                    <div key={pl} className="text-center p-2.5 bg-gray-50 rounded-xl">
                      <p className="text-lg mb-0.5">{platformIcons[pl]}</p>
                      <p className="text-sm font-bold text-gray-800">{val.toLocaleString()}</p>
                      <p className="text-xs text-green-500 font-semibold">{s?.growth ?? '+0%'}</p>
                      <p className="text-xs text-gray-400">{platformLabels[pl]}</p>
                    </div>
                  )
                })}
              </div>

              {/* Content stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Jami',       value: stats.total,     color: 'text-gray-800' },
                  { label: 'Chiqarildi', value: stats.published, color: 'text-green-600' },
                  { label: 'Kutayotgan', value: stats.pending,   color: 'text-orange-500' },
                  { label: "Ko'rishlar", value: stats.totalViews >= 1000
                      ? `${(stats.totalViews/1000).toFixed(1)}k` : stats.totalViews,
                    color: 'text-brand-600' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-2 border border-gray-100 rounded-xl">
                    <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-gray-400 leading-tight mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Goal */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Target size={14} className="text-brand-400 flex-shrink-0" />
                <span className="truncate">{client.goal}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Oyiga <span className="font-semibold text-gray-700">{client.monthlyVideos}</span> ta video
                </p>
                <Link to={`/clients/${client.id}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-700 group-hover:gap-2.5 transition-all">
                  Batafsil <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}

        {/* Add card */}
        <button onClick={() => setShowModal(true)}
          className="card border-2 border-dashed border-gray-200 hover:border-brand-300 hover:bg-brand-50/30
            transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer group">
          <div className="w-12 h-12 bg-gray-100 group-hover:bg-brand-100 rounded-2xl flex items-center justify-center transition-colors">
            <Plus size={22} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-500 group-hover:text-brand-600 transition-colors">Yangi mijoz qo'shish</p>
            <p className="text-xs text-gray-400 mt-1">Profil va strategiya yarating</p>
          </div>
        </button>
      </div>
    </div>
  )
}
