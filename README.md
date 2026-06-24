# S04-26-Equipo-05-Web-App-Development
# Reconecta 45 🔁

**Upskilling & Employability Platform for Professionals 45+**

A full-stack web application designed to bridge the gap between experienced professionals over 45 and the current job market — combining a learning experience platform, a dynamic professional profile, and a talent marketplace in a single product.

🌐 **Live demo:** [conectarte-client.onrender.com](https://conectarte-client.onrender.com)

▶️ **How it works:** [Watch the demo](https://www.youtube.com/watch?v=UIO78QckhwM)

---

## 📌 About the Project

This MVP was built as part of **No Country**, a job simulation program that assembles cross-functional teams and challenges them to design, build, and ship a real product in 5 weeks, ending in a live demo presentation.

The platform serves two types of users:

- **Professionals** — complete a skills diagnostic, receive a personalized learning path, build a dynamic profile, and access job opportunities
- **Companies** — browse a talent marketplace, filter candidates by skills, and manage job offers

---

## ✨ Features

### For Professionals
- Skills diagnostic with personalized results
- Personalized learning paths (courses + quizzes)
- Dynamic professional profile that updates with progress
- Talent marketplace to discover job opportunities
- Public shareable profile page

### For Companies
- Company profile management
- Job offer creation and management
- Candidate browsing and filtering

### Platform
- Authentication with email/password and Google OAuth
- Forgot/reset password flow
- Role-based access (professional vs company)
- Protected routes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Radix UI | Accessible component primitives |
| Framer Motion | Animations & transitions |
| React Hook Form + Zod | Form handling & validation |
| React Router v7 | Client-side routing |
| React Context API | Global state management |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| NestJS | Server framework |
| PostgreSQL | Database |
| Docker + Docker Compose | Containerization |
| Nginx | Frontend serving & reverse proxy |

---

## 📁 Project Structure

```
reconecta45/
├── client/                  # React frontend
│   └── src/
│       ├── app/
│       │   └── router/      # AppRouter with protected routes
│       ├── components/
│       │   └── ui/          # Reusable UI components
│       ├── context/         # AppContext (auth & global state)
│       └── pages/
│           ├── auth/        # Login, Register, OAuth, forgot/reset password
│           ├── dashboard/   # User dashboard
│           ├── diagnostic/  # Skills diagnostic & results
│           ├── home/        # Landing page
│           ├── learning/    # Courses, CoursePage, QuizPage
│           ├── marketplace/ # Talent marketplace
│           ├── profile/     # MyProfile & PublicProfile
│           └── company/     # CompanyProfile, JobOffers, Candidates
└── server/                  # NestJS backend
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Run with Docker (recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/conectarte.git
cd conectarte

# Create environment file
cp .env.example .env
# Fill in the required variables (see below)

# Start all services
docker compose up --build
```

App will be available at `http://localhost`

### Environment Variables

```env
# Database
DB_USER=authuser
DB_PASSWORD=authpass123
DB_NAME=authdb

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost
APP_PORT=80

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost/api/auth/google/callback

# Mail (optional)
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=ReConecta45 <noreply@reconecta45.com>
```

### Run Frontend Locally (development)

```bash
cd client
npm install
npm run dev
```

---

## 👥 Team

Built in 5 weeks by a team assembled through **No Country**:

| Role | Responsibility |
|---|---|
| Frontend Developer | UI/UX design, all frontend screens & components |
| Backend Developer x2 | API, database, business logic |
| Fullstack Developer | Integration & deployment |
| Project Manager | Planning, coordination & delivery |

---

## 📄 License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.
