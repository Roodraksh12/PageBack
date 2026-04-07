# 📚 PageBack — Give Your Books a Second Life

> India's trusted used bookstore platform. Buy quality pre-loved books at unbeatable prices. Sell your old books for instant cash.

**Live Demo:** [pageback.vercel.app](https://pageback.vercel.app) *(deploy to update)*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛒 Buy Page | Browse 20+ books with search, genre/condition/price filters |
| 💰 Instant Price Estimator | 5-step sell flow with real-time payout calculation |
| 📊 Live Demand Meter | Genre-aware demand badge on sell page |
| 🌱 Book Karma Score | Tier system (Seedling → Legend) for sellers |
| 🌍 Environmental Impact | Live counter of paper/trees saved |
| 📋 Condition Report | Detailed per-book condition transparency |
| 🎯 Book Request | Buyers can request specific books |
| 💬 WhatsApp Quick Sell | One-tap WhatsApp quote button |
| 🌙 Dark Mode | Full dark mode with localStorage persistence |
| 📱 Mobile-First | Bottom nav bar, responsive grid, touch-friendly |
| 🔐 Admin Portal | PIN-protected, WhatsApp number management |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub: `https://github.com/Roodraksh12/PagePay`
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click Deploy ✅

The `vercel.json` file already handles SPA routing so all React Router pages work in production.

---

## 📤 Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial PageBack website"
git branch -M main
git remote add origin https://github.com/Roodraksh12/PagePay.git
git push -u origin main
```

---

## 🗂️ Project Structure

```
src/
├── context/       # Cart, Theme, App (karma, WhatsApp) state
├── data/          # 20 dummy books + genres + testimonials
├── components/    # Reusable: BookCard, BookModal, CartSidebar, etc.
├── pages/         # Home, Buy, Sell, Orders, About, Admin
└── index.css      # Tailwind + custom design system
```

---

## 🔐 Admin Portal

- URL: `/admin`
- Demo PIN: `2580`
- Features: WhatsApp number management, site stats, book request viewer

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v3** (custom palette: forest green + cream + amber)
- **React Router v6**
- **Lucide React** icons
- **Google Fonts** — Playfair Display + DM Sans
- **localStorage** for cart, orders, karma, dark mode

---

## 📱 Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/buy` | Browse + Book Request |
| `/sell` | 5-Step Instant Price Estimator |
| `/orders` | Order Tracking |
| `/about` | About PageBack |
| `/admin` | Admin Portal |

---

*Made with ❤️ in India*
