# SwiftStruct Limited — Real Estate & Construction Project Delivery Platform

SwiftStruct Limited is an integrated **Real Estate & Construction Project Delivery** platform connecting property acquisition opportunities with professional engineering execution.

## 🏗️ Core Business Pillars

1. **Real Estate Agency** — Property sales, rentals, property sourcing, and marketing.
2. **Real Estate Consultancy** — Investment advisory, feasibility studies, market research, and acquisition due diligence.
3. **Building & Construction** — Turnkey residential and commercial construction, structural renovations, and remodeling.
4. **Project Management** — Cost coordination, schedule planning, site supervision, contractor oversight, and quality assurance.
5. **General Contracting** — Construction contracts, procurement, and civil engineering execution.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **API Architecture**: REST API
- **ORM**: Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT & bcrypt
- **Deployment**: Render

### Media Management
- Cloudinary CDN

---

## 📁 Repository Structure

```text
swiftstruct/
├── backend/                  # NestJS REST API Server
│   ├── prisma/
│   │   └── schema.prisma     # Full PostgreSQL Prisma Data Schema
│   ├── src/
│   │   ├── auth/             # JWT & Bcrypt Authentication
│   │   ├── properties/       # Property Catalog API & Filters
│   │   ├── projects/         # Construction Projects Portfolio API
│   │   ├── services/         # Official SwiftStruct Core Services API
│   │   ├── enquiries/        # Property, Project Brief & Contact Form Submissions
│   │   ├── insights/         # Articles & Blog CMS API
│   │   ├── testimonials/     # Client Testimonials API
│   │   └── media/            # Cloudinary Upload Signature API
│   └── .env.example
├── frontend/                 # Next.js 15 Web Application & Admin CMS
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── properties/       # Filterable Properties Catalog & Detail
│   │   ├── projects/         # Filterable Projects Portfolio & Detail
│   │   ├── services/         # 5 Core Service Pages
│   │   ├── about/            # Corporate Profile & Positioning
│   │   ├── insights/         # Industry Insights & Blog
│   │   ├── contact/          # Interactive Contact & Project Brief Form
│   │   └── admin/            # Protected Admin CMS Portal
│   ├── lib/                  # Centralized API Service Layer
│   └── .env.example
└── README.md
```

---

## 🔑 Default Admin Credentials

- **Email**: `admin@swiftstruct.com`
- **Password**: `Admin123!`
- **Portal URL**: `/admin/login`

---

## 🚀 Environment Setup

### Backend (`backend/.env`)
```env
PORT=4000
DATABASE_URL="postgresql://user:password@neon.tech/swiftstruct?sslmode=require"
JWT_SECRET="swiftstruct-jwt-secret-key-2025"
JWT_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME="swiftstruct"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 🧪 Testing

### Backend Unit Tests
```bash
cd backend
npm run test
```

### Type Verification
```bash
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

---

## 🚢 Deployment Architecture

- **Frontend**: Deployed to Vercel connected to Next.js App Router repository root `frontend/`.
- **Backend**: Deployed to Render as a Node.js web service running `backend/` NestJS build.
- **Database**: PostgreSQL hosted on Neon connected via Prisma `DATABASE_URL`.
- **Media**: Cloudinary CDN for property & project imagery.
