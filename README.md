# 🚀 BrandFlow — Kontent Boshqaruv Dashboard

Shaxsiy brend mutaxassislari uchun video kontent rejalashtirish va analytics tizimi.

## ✨ Imkoniyatlar

| Sahifa | Tavsif |
|--------|--------|
| 📊 **Dashboard** | Umumiy statistika, views chart, deadline tracking |
| 👥 **Mijozlar** | Profil kartalari, platforma stats, radar chart |
| 📅 **Kontent Kalendar** | Kanban board (6 ustun) + Oylik view |
| 🎬 **Video Kutubxona** | Grid/List view, filter, sort, engagement rate |
| 🎯 **Strategiya** | Content pillars, haftalik jadval, maqsad progress |
| 📈 **Analytics** | Views trend, followers o'sishi, platforma tahlili |

## 🛠 Ishga tushirish

### Talablar
- Node.js 18+ yoki Bun 1.0+

### O'rnatish

```bash
# Papkaga kiring
cd content-dashboard

# Paketlarni o'rnating
npm install
# yoki
bun install

# Development serverini ishga tushiring
npm run dev
# yoki
bun dev
```

Brauzerda oching: **http://localhost:5173**

### Build qilish

```bash
npm run build
npm run preview
```

## 🏗 Texnologiyalar

- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **React Router v6** — Routing
- **Recharts** — Grafiklar
- **Lucide React** — Ikonalar

## 📁 Loyiha Strukturasi

```
src/
├── components/
│   ├── Layout.jsx       # Umumiy layout + topbar
│   ├── Sidebar.jsx      # Navigatsiya
│   ├── StatCard.jsx     # Statistika kartasi
│   ├── StatusBadge.jsx  # Status badge
│   └── PlatformBadge.jsx # Platforma badge
├── pages/
│   ├── Dashboard.jsx    # Bosh sahifa
│   ├── Clients.jsx      # Mijozlar ro'yxati
│   ├── ClientDetail.jsx # Mijoz profili
│   ├── Calendar.jsx     # Kontent kalendar
│   ├── Library.jsx      # Video kutubxona
│   ├── Strategy.jsx     # Strategiya planner
│   └── Analytics.jsx    # Analytics
├── data/
│   └── mockData.js      # Ma'lumotlar
├── App.jsx
├── main.jsx
└── index.css
```

## 🔧 Sozlash

`src/data/mockData.js` faylida o'z ma'lumotlaringizni kiriting:

```js
// Mijoz qo'shish
export const clients = [
  {
    id: 3,
    name: "Yangi Mijoz",
    niche: "Soha",
    platforms: ["instagram", "youtube"],
    // ...
  }
]
```

## 📞 Muallif

BrandFlow — Sardor Toshmatov tomonidan ishlab chiqilgan.
