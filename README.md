# 🧠 AI Smart Calendar

A production-ready, AI-powered scheduling and productivity assistant built with Next.js 14, PostgreSQL, and GPT-4.

![AI Smart Calendar](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss) ![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)

---

## ✨ Features

### 🔐 Authentication
- JWT-based auth (signup, login, logout)
- Secure HTTP-only cookies
- Route protection via Next.js middleware
- Password hashing with bcrypt

### 📅 Calendar System
- **Three views**: Day, Week, Month
- **Interactive time grid** with click-to-create
- **Event management**: Create, edit, delete events
- **Color-coded categories**: Work, School, Fitness, Personal, Health, Social, Finance, Learning
- **Priority levels**: Low, Medium, High
- **Current time indicator** in week/day view

### 🎯 Goals & Habits
- Set short-term and long-term goals
- Track progress with visual progress bars
- Build daily/weekly habits with streak tracking
- Link goals to calendar categories

### 🤖 AI Analysis Engine (GPT-4)
- **Weekly schedule analysis** — productivity score (0–100), balance assessment
- **Smart suggestions** — "Move deep work to mornings", "Add recovery time"
- **Time breakdown** — hours per category visualized as pie chart
- **Overload detection** — alerts when schedule is too packed
- **Focus block recommendations** — optimal time windows

### ⚡ AI Auto-Scheduling
- Input a goal: *"Study 10 hours this week"*
- AI analyzes existing events and finds optimal time slots
- Automatically creates events avoiding conflicts
- Configurable session duration and preferences

### 📊 Insights Dashboard
- Productivity score ring chart
- Weekly summary from AI
- Time breakdown pie chart
- Productivity trend over time (area chart)
- Historical analysis records

### 🔔 Notifications
- Overload alerts from AI analysis
- Notification panel with unread count
- Persistent notifications in database

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand (with persistence) |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jose library) + bcrypt |
| AI | OpenAI GPT-4 Turbo |
| Charts | Recharts |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-smart-calendar.git
cd ai-smart-calendar
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/ai_smart_calendar"

# JWT secret — use a long random string
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"

# OpenAI API key from https://platform.openai.com
OPENAI_API_KEY="sk-your-openai-key"
OPENAI_MODEL="gpt-4-turbo-preview"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Optional: Seed with demo data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials** (after seeding):
- Email: `demo@smartcal.ai`
- Password: `demo12345`

---

## 📁 Project Structure

```
ai-smart-calendar/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # signup, login, logout, me
│   │   │   ├── events/        # CRUD + [id] routes
│   │   │   ├── goals/         # Goals CRUD
│   │   │   ├── habits/        # Habits CRUD
│   │   │   ├── ai/
│   │   │   │   ├── analyze/   # GPT-4 schedule analysis
│   │   │   │   └── auto-schedule/ # AI auto-scheduling
│   │   │   ├── insights/      # Saved AI insights
│   │   │   └── notifications/ # Notification management
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Registration page
│   │   ├── dashboard/
│   │   │   ├── calendar/      # Full calendar (day/week/month)
│   │   │   ├── goals/         # Goals & habits management
│   │   │   ├── insights/      # AI insights & charts
│   │   │   ├── layout.tsx     # Sidebar + nav layout
│   │   │   └── page.tsx       # Dashboard overview
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── calendar/
│   │   │   └── EventModal.tsx # Create/edit event modal
│   │   └── dashboard/
│   │       └── NotificationPanel.tsx
│   ├── lib/
│   │   ├── ai.ts              # OpenAI integration
│   │   ├── auth.ts            # JWT utilities
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── store.ts           # Zustand global state
│   │   └── utils.ts           # Shared utilities
│   ├── styles/
│   │   └── globals.css        # Global styles + design system
│   └── middleware.ts          # Route protection
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🤖 AI Prompt Engineering

The AI analysis uses a carefully crafted prompt that instructs GPT-4 to:

```
Analyze this user's weekly schedule and suggest improvements for 
productivity, balance, and efficiency. Identify:
1. Time distribution across categories
2. Productivity patterns (peak hour alignment)
3. Schedule overload (back-to-back, no recovery)
4. Goal alignment
5. Work-life balance gaps
6. Missing time blocks (exercise, deep work, etc.)
```

The response is structured JSON with:
- `productivityScore` (0–100)
- `summary` (2–3 sentence overview)
- `suggestions` (5 actionable items)
- `timeBreakdown` (hours per category)
- `overloadWarning` (boolean)
- `balanceScore` (0–100)
- `focusBlocks` (recommended time windows)

---

## 🗄 Database Schema

```
users          — Authentication & profile
events         — Calendar events with categories
goals          — Short/long-term goals with progress
habits         — Daily/weekly habits with streaks
insights       — Saved AI analysis results
notifications  — User notifications
```

---

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Sync schema to database |
| `npm run db:migrate` | Run migrations (production) |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:seed` | Seed demo data |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Database Options
- **[Neon](https://neon.tech)** — Serverless PostgreSQL, generous free tier
- **[Supabase](https://supabase.com)** — PostgreSQL with extras
- **[PlanetScale](https://planetscale.com)** — MySQL alternative

### Environment Variables for Production
```env
DATABASE_URL="your-production-db-url"
JWT_SECRET="long-random-secret-min-32-chars"
OPENAI_API_KEY="sk-your-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

---

## 🎨 Design System

The app uses a custom dark-first design system with:
- **Glass morphism** cards with backdrop blur
- **Gradient accents** (violet → indigo)
- **Smooth animations** (fade, slide, scale)
- **Custom scrollbars**
- **CSS variables** for theming (dark/light mode)
- **DM Sans** for UI text, **Instrument Serif** for display

---

## 📈 Roadmap

- [ ] Google Calendar sync
- [ ] Voice input for events
- [ ] Weekly AI email reports
- [ ] Recurring events (RRULE)
- [ ] Drag-and-drop event rescheduling
- [ ] Mobile app (React Native)
- [ ] Team calendar sharing
- [ ] Webhook integrations

---

## 📄 License

MIT — free for personal and commercial use.

---

Built with ❤️ using Next.js, GPT-4, and Tailwind CSS
