<div align="center">

# 🌐 خدماتي — Khadamati

### منصة الخدمات المصغرة العربية

**Khadamati** is a modern Arabic micro-services marketplace connecting freelancers with clients in a secure and trusted environment. Built as a **Graduation Project** with a focus on real-world functionality, elegant UI/UX, and enterprise-grade architecture.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Application Routes](#-application-routes)
- [API Integration](#-api-integration)
- [Authentication & Authorization](#-authentication--authorization)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Khadamati (خدماتي)** is a full-featured Arabic freelancing marketplace that enables:

- **Sellers** to showcase their skills and offer micro-services
- **Buyers** to discover and hire talented freelancers
- **Admins** to manage users, verify sellers (KYC), and control the platform

The platform supports RTL (Right-to-Left) Arabic design, OTP verification, WhatsApp integration, role-based dashboards, and more.

---

## ✨ Features

### 🏠 Landing Page
- Responsive hero section with animated elements
- Services categories showcase
- Step-by-step "How It Works" guide
- AI-powered services section
- Testimonials carousel
- Call-to-action section

### 👤 Authentication System
- User registration for **Buyers** and **Sellers**
- Email & phone-based login with JWT tokens
- OTP verification via WhatsApp/SMS
- Seller KYC (Know Your Customer) document upload
- Protected routes with role-based access control

### 📊 User Dashboard
- Personalized dashboard for buyers and sellers
- Profile management with avatar upload
- Account verification status tracking
- Responsive sidebar navigation

### 🛡️ Admin Panel
- Admin-specific login & dashboard
- Platform statistics overview (users, sellers, revenue)
- Seller verification management (approve/reject KYC)
- Buyer management
- WhatsApp integration control (QR pairing, status, messaging)

### 🎨 UI/UX
- Fully RTL Arabic interface
- Light/dark theme support
- Responsive design (mobile, tablet, desktop)
- 60+ pre-built shadcn/ui components
- Smooth animations and transitions
- Toast & sonner notifications

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18.3 with TypeScript 5.8 |
| **Build Tool** | Vite 5.4 (SWC plugin) |
| **Styling** | Tailwind CSS 3.4 + tailwindcss-animate |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **State Management** | React Context API + TanStack React Query |
| **Routing** | React Router DOM 6.30 |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios with interceptors |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Testing** | Vitest + Testing Library + jsdom |
| **Linting** | ESLint 9 + TypeScript ESLint |

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui component library (60+ components)
│   │   ├── Navbar.tsx         # Main navigation bar
│   │   ├── HeroSection.tsx    # Landing page hero
│   │   ├── DashboardLayout.tsx# Dashboard shell layout
│   │   ├── ProtectedRoute.tsx # Role-based route guard
│   │   ├── Logo.tsx           # Brand logo component
│   │   └── ...                # Other section components
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context provider
│   ├── hooks/
│   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   └── use-toast.ts      # Toast notification hook
│   ├── lib/
│   │   ├── api.ts             # Axios instance & API functions
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Login.tsx          # Login page
│   │   ├── Register.tsx       # Registration selection
│   │   ├── RegisterBuyer.tsx  # Buyer registration form
│   │   ├── RegisterSeller.tsx # Seller registration + KYC
│   │   ├── NotFound.tsx       # 404 page
│   │   ├── dashboard/         # User dashboard pages
│   │   │   ├── DashboardHome.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── VerificationPage.tsx
│   │   └── admin/             # Admin panel pages
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminSellers.tsx
│   │       ├── AdminBuyers.tsx
│   │       ├── AdminWhatsApp.tsx
│   │       └── AdminLayout.tsx
│   ├── test/                  # Test files
│   ├── App.tsx                # Root component with routes
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Bun** (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/samehrafeeq/Graduation-Project-Codex-Frontend.git
cd Graduation-Project-Codex-Frontend

# Install dependencies
bun install
# or
npm install

# Start the development server
bun dev
# or
npm run dev
```

The app will be available at **http://localhost:8080**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server on port 8080 |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run lint` | Run ESLint across the project |
| `bun run preview` | Preview production build locally |
| `bun test` | Run tests once |
| `bun run test:watch` | Run tests in watch mode |

---

## 🗺️ Application Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Homepage with platform overview |
| `/login` | Login | User login form |
| `/register` | Register | Choose buyer or seller registration |
| `/register/buyer` | Buyer Registration | Buyer sign-up form |
| `/register/seller` | Seller Registration | Seller sign-up + KYC upload |

### Protected Routes — Dashboard (Buyer & Seller)

| Route | Allowed Roles | Description |
|---|---|---|
| `/dashboard` | buyer, seller | Main dashboard home |
| `/dashboard/profile` | buyer, seller | Profile settings |
| `/dashboard/verification` | seller | KYC verification status |

### Protected Routes — Admin Panel

| Route | Allowed Roles | Description |
|---|---|---|
| `/admin/login` | public | Admin login page |
| `/admin/dashboard` | admin | Admin statistics overview |
| `/admin/sellers` | admin | Manage & verify sellers |
| `/admin/buyers` | admin | Manage buyers |
| `/admin/whatsapp` | admin | WhatsApp integration panel |

---

## 🔌 API Integration

The app communicates with a RESTful backend via Axios. All API functions are centralized in `src/lib/api.ts`.

### API Modules

| Module | Endpoints | Description |
|---|---|---|
| `authApi` | `/auth/*` | Register, login, OTP, profile |
| `usersApi` | `/users/*` | Profile update, avatar upload |
| `kycApi` | `/kyc/*` | KYC verification status |
| `adminApi` | `/admin/*` | Stats, sellers/buyers management |
| `whatsappApi` | `/admin/whatsapp/*` | WhatsApp connect, QR, messaging |

### Key Features
- **JWT Authentication** — Token stored in localStorage, auto-attached via Axios interceptors
- **Auto-logout** — 401 responses clear session and redirect to login
- **File Uploads** — Multipart form data support for avatars and KYC documents

---

## 🔒 Authentication & Authorization

The app uses a **Context-based auth system** with JWT tokens:

1. **Login/Register** → Server returns JWT token + user object
2. **Token Storage** → Saved in `localStorage` for persistence
3. **Auto-Attach** → Axios interceptor adds `Authorization: Bearer <token>` to every request
4. **Route Protection** → `ProtectedRoute` component checks user role before rendering
5. **Session Refresh** → Profile is refreshed from server on app mount

### Supported Roles

| Role | Access |
|---|---|
| `buyer` | Dashboard, Profile |
| `seller` | Dashboard, Profile, Verification |
| `admin` | Full Admin Panel |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is developed as a **Graduation Project**. All rights reserved.

---

<div align="center">

**Built with ❤️ as a Graduation Project**

</div>
